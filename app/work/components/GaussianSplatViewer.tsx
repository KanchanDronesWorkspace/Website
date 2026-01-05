"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  getProjectionMatrix,
  getViewMatrix,
  multiply4,
  invert4,
  rotate4,
  translate4,
  defaultCameras,
  defaultViewMatrix,
} from "@/app/work/lib/matrix-utils";
import { vertexShaderSource, fragmentShaderSource } from "@/app/work/lib/shaders";

interface GaussianSplatViewerProps {
  modelUrl: string;
  onProgress: (progress: number) => void;
  onLoaded: () => void;
  onError: (error: string) => void;
  isCarousel: boolean;
  onCarouselChange: (value: boolean) => void;
}

export function GaussianSplatViewer({
  modelUrl,
  onProgress,
  onLoaded,
  onError,
  isCarousel,
  onCarouselChange,
}: GaussianSplatViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const carouselRef = useRef(isCarousel);

  useEffect(() => {
    carouselRef.current = isCarousel;
  }, [isCarousel]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cameras = [...defaultCameras];
    let camera = cameras[0];
    let viewMatrix = [...defaultViewMatrix];

    const params = new URLSearchParams(window.location.search);
    try {
      const hash = window.location.hash.slice(1);
      if (hash) {
        viewMatrix = JSON.parse(decodeURIComponent(hash));
        carouselRef.current = false;
        onCarouselChange(false);
      }
    } catch (err) {}

    const url = new URL(
      params.get("url") || modelUrl,
      process.env.NEXT_PUBLIC_HUGGINGFACE_URL
    );

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", { antialias: false });
    if (!gl) {
      onError("WebGL2 not supported");
      return;
    }

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) return;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(vertexShader));
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) return;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(fragmentShader));
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
    }

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(
      gl.ONE_MINUS_DST_ALPHA,
      gl.ONE,
      gl.ONE_MINUS_DST_ALPHA,
      gl.ONE
    );
    gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);

    const u_projection = gl.getUniformLocation(program, "projection");
    const u_viewport = gl.getUniformLocation(program, "viewport");
    const u_focal = gl.getUniformLocation(program, "focal");
    const u_view = gl.getUniformLocation(program, "view");

    const triangleVertices = new Float32Array([-2, -2, 2, -2, 2, 2, -2, 2]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
    const a_position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(a_position);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const u_textureLocation = gl.getUniformLocation(program, "u_texture");
    gl.uniform1i(u_textureLocation, 0);

    const indexBuffer = gl.createBuffer();
    const a_index = gl.getAttribLocation(program, "index");
    gl.enableVertexAttribArray(a_index);
    gl.bindBuffer(gl.ARRAY_BUFFER, indexBuffer);
    gl.vertexAttribIPointer(a_index, 1, gl.INT, 0, 0);
    gl.vertexAttribDivisor(a_index, 1);

    let projectionMatrix: number[] = [];
    const rowLength = 3 * 4 + 3 * 4 + 4 + 4;
    let splatData = new Uint8Array(0);
    let vertexCount = 0;

    const worker = new Worker("/worker.js");

    const resize = () => {
      const originalAspect = camera.width / camera.height;
      const currentAspect = window.innerWidth / window.innerHeight;

      const scaleX = window.innerWidth / camera.width;
      const scaleY = window.innerHeight / camera.height;
      const scale = Math.min(scaleX, scaleY);

      const scaledFx = camera.fx * scale;
      const scaledFy = camera.fy * scale;

      gl.uniform2fv(u_focal, new Float32Array([scaledFx, scaledFy]));

      projectionMatrix = getProjectionMatrix(
        scaledFx,
        scaledFy,
        window.innerWidth,
        window.innerHeight
      );

      gl.uniform2fv(
        u_viewport,
        new Float32Array([window.innerWidth, window.innerHeight])
      );

      const downsample =
        splatData.length / rowLength > 500000 ? 1 : 1 / window.devicePixelRatio;
      gl.canvas.width = Math.round(window.innerWidth / downsample);
      gl.canvas.height = Math.round(window.innerHeight / downsample);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      gl.uniformMatrix4fv(u_projection, false, projectionMatrix);
    };

    window.addEventListener("resize", resize);
    resize();

    worker.onmessage = (e) => {
      if (e.data.buffer) {
        splatData = new Uint8Array(e.data.buffer);
      } else if (e.data.texdata) {
        const { texdata, texwidth, texheight } = e.data;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA32UI,
          texwidth,
          texheight,
          0,
          gl.RGBA_INTEGER,
          gl.UNSIGNED_INT,
          texdata
        );
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
      } else if (e.data.depthIndex) {
        const { depthIndex } = e.data;
        gl.bindBuffer(gl.ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, depthIndex, gl.DYNAMIC_DRAW);
        vertexCount = e.data.vertexCount;
      }
    };

    let activeKeys: string[] = [];
    let currentCameraIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      carouselRef.current = false;
      onCarouselChange(false);
      if (!activeKeys.includes(e.code)) activeKeys.push(e.code);
      if (/\d/.test(e.key)) {
        currentCameraIndex = parseInt(e.key);
        camera = cameras[currentCameraIndex];
        viewMatrix = getViewMatrix(camera);
      }
      if (["-", "_"].includes(e.key)) {
        currentCameraIndex =
          (currentCameraIndex + cameras.length - 1) % cameras.length;
        viewMatrix = getViewMatrix(cameras[currentCameraIndex]);
      }
      if (["+", "="].includes(e.key)) {
        currentCameraIndex = (currentCameraIndex + 1) % cameras.length;
        viewMatrix = getViewMatrix(cameras[currentCameraIndex]);
      }
      if (e.code == "KeyV") {
        window.location.hash =
          "#" +
          JSON.stringify(viewMatrix.map((k) => Math.round(k * 100) / 100));
      } else if (e.code === "KeyP") {
        carouselRef.current = true;
        onCarouselChange(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      activeKeys = activeKeys.filter((k) => k !== e.code);
    };

    const handleBlur = () => {
      activeKeys = [];
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    const handleWheel = (e: WheelEvent) => {
      carouselRef.current = false;
      onCarouselChange(false);
      e.preventDefault();
      const lineHeight = 10;
      const scale =
        e.deltaMode == 1
          ? lineHeight
          : e.deltaMode == 2
          ? window.innerHeight
          : 1;
      let inv = invert4(viewMatrix);
      if (!inv) return;
      if (e.shiftKey) {
        inv = translate4(
          inv,
          (e.deltaX * scale) / window.innerWidth,
          (e.deltaY * scale) / window.innerHeight,
          0
        );
      } else if (e.ctrlKey || e.metaKey) {
        inv = translate4(
          inv,
          0,
          0,
          (-10 * (e.deltaY * scale)) / window.innerHeight
        );
      } else {
        let d = 4;
        inv = translate4(inv, 0, 0, d);
        inv = rotate4(inv, -(e.deltaX * scale) / window.innerWidth, 0, 1, 0);
        inv = rotate4(inv, (e.deltaY * scale) / window.innerHeight, 1, 0, 0);
        inv = translate4(inv, 0, 0, -d);
      }

      viewMatrix = invert4(inv) || viewMatrix;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    let startX = 0,
      startY = 0,
      down = 0;

    const handleMouseDown = (e: MouseEvent) => {
      carouselRef.current = false;
      onCarouselChange(false);
      e.preventDefault();
      startX = e.clientX;
      startY = e.clientY;
      down = e.ctrlKey || e.metaKey ? 2 : 1;
    };

    const handleContextMenu = (e: MouseEvent) => {
      carouselRef.current = false;
      onCarouselChange(false);
      e.preventDefault();
      startX = e.clientX;
      startY = e.clientY;
      down = 2;
    };

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (down == 1) {
        let inv = invert4(viewMatrix);
        if (!inv) return;
        let dx = (5 * (e.clientX - startX)) / window.innerWidth;
        let dy = (5 * (e.clientY - startY)) / window.innerHeight;
        let d = 4;

        inv = translate4(inv, 0, 0, d);
        inv = rotate4(inv, dx, 0, 1, 0);
        inv = rotate4(inv, -dy, 1, 0, 0);
        inv = translate4(inv, 0, 0, -d);
        viewMatrix = invert4(inv) || viewMatrix;

        startX = e.clientX;
        startY = e.clientY;
      } else if (down == 2) {
        let inv = invert4(viewMatrix);
        if (!inv) return;
        inv = translate4(
          inv,
          (-10 * (e.clientX - startX)) / window.innerWidth,
          0,
          (10 * (e.clientY - startY)) / window.innerHeight
        );
        viewMatrix = invert4(inv) || viewMatrix;

        startX = e.clientX;
        startY = e.clientY;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      down = 0;
      startX = 0;
      startY = 0;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("contextmenu", handleContextMenu);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    let altX = 0,
      altY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        carouselRef.current = false;
        onCarouselChange(false);
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        down = 1;
      } else if (e.touches.length === 2) {
        carouselRef.current = false;
        onCarouselChange(false);
        startX = e.touches[0].clientX;
        altX = e.touches[1].clientX;
        startY = e.touches[0].clientY;
        altY = e.touches[1].clientY;
        down = 1;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1 && down) {
        let inv = invert4(viewMatrix);
        if (!inv) return;
        let dx = (4 * (e.touches[0].clientX - startX)) / window.innerWidth;
        let dy = (4 * (e.touches[0].clientY - startY)) / window.innerHeight;

        let d = 4;
        inv = translate4(inv, 0, 0, d);
        inv = rotate4(inv, dx, 0, 1, 0);
        inv = rotate4(inv, -dy, 1, 0, 0);
        inv = translate4(inv, 0, 0, -d);

        viewMatrix = invert4(inv) || viewMatrix;

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const dtheta =
          Math.atan2(startY - altY, startX - altX) -
          Math.atan2(
            e.touches[0].clientY - e.touches[1].clientY,
            e.touches[0].clientX - e.touches[1].clientX
          );
        const dscale =
          Math.hypot(startX - altX, startY - altY) /
          Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
        const dx =
          (e.touches[0].clientX + e.touches[1].clientX - (startX + altX)) / 2;
        const dy =
          (e.touches[0].clientY + e.touches[1].clientY - (startY + altY)) / 2;
        let inv = invert4(viewMatrix);
        if (!inv) return;
        inv = rotate4(inv, dtheta, 0, 0, 1);

        inv = translate4(
          inv,
          -dx / window.innerWidth,
          -dy / window.innerHeight,
          0
        );

        inv = translate4(inv, 0, 0, 3 * (1 - dscale));

        viewMatrix = invert4(inv) || viewMatrix;

        startX = e.touches[0].clientX;
        altX = e.touches[1].clientX;
        startY = e.touches[0].clientY;
        altY = e.touches[1].clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      down = 0;
      startX = 0;
      startY = 0;
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    let jumpDelta = 0;
    let start = 0;

    // Gamepad support
    window.addEventListener("gamepadconnected", (e) => {
      const gp = navigator.getGamepads()[e.gamepad.index];
      if (gp) {
        console.log(`Gamepad connected: ${gp.id}`);
      }
    });

    let leftGamepadTrigger = false,
      rightGamepadTrigger = false;

    const frame = (now: number) => {
      let inv = invert4(viewMatrix);
      if (!inv) {
        requestAnimationFrame(frame);
        return;
      }
      let shiftKey =
        activeKeys.includes("Shift") ||
        activeKeys.includes("ShiftLeft") ||
        activeKeys.includes("ShiftRight");

      if (activeKeys.includes("ArrowUp")) {
        if (shiftKey) {
          inv = translate4(inv, 0, -0.03, 0);
        } else {
          inv = translate4(inv, 0, 0, 0.1);
        }
      }
      if (activeKeys.includes("ArrowDown")) {
        if (shiftKey) {
          inv = translate4(inv, 0, 0.03, 0);
        } else {
          inv = translate4(inv, 0, 0, -0.1);
        }
      }
      if (activeKeys.includes("ArrowLeft")) inv = translate4(inv, -0.03, 0, 0);
      if (activeKeys.includes("ArrowRight")) inv = translate4(inv, 0.03, 0, 0);
      if (activeKeys.includes("KeyA")) inv = rotate4(inv, -0.01, 0, 1, 0);
      if (activeKeys.includes("KeyD")) inv = rotate4(inv, 0.01, 0, 1, 0);
      if (activeKeys.includes("KeyQ")) inv = rotate4(inv, 0.01, 0, 0, 1);
      if (activeKeys.includes("KeyE")) inv = rotate4(inv, -0.01, 0, 0, 1);
      if (activeKeys.includes("KeyW")) inv = rotate4(inv, 0.005, 1, 0, 0);
      if (activeKeys.includes("KeyS")) inv = rotate4(inv, -0.005, 1, 0, 0);

      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      let isJumping = activeKeys.includes("Space");
      for (let gamepad of gamepads) {
        if (!gamepad) continue;

        const axisThreshold = 0.1;
        const moveSpeed = 0.06;
        const rotateSpeed = 0.02;

        if (Math.abs(gamepad.axes[0]) > axisThreshold) {
          inv = translate4(inv, moveSpeed * gamepad.axes[0], 0, 0);
          carouselRef.current = false;
        }
        if (Math.abs(gamepad.axes[1]) > axisThreshold) {
          inv = translate4(inv, 0, 0, -moveSpeed * gamepad.axes[1]);
          carouselRef.current = false;
        }
        if (gamepad.buttons[12].pressed || gamepad.buttons[13].pressed) {
          inv = translate4(
            inv,
            0,
            -moveSpeed *
              ((gamepad.buttons[12].pressed ? 1 : 0) -
                (gamepad.buttons[13].pressed ? 1 : 0)),
            0
          );
          carouselRef.current = false;
        }

        if (gamepad.buttons[14].pressed || gamepad.buttons[15].pressed) {
          inv = translate4(
            inv,
            -moveSpeed *
              ((gamepad.buttons[14].pressed ? 1 : 0) -
                (gamepad.buttons[15].pressed ? 1 : 0)),
            0,
            0
          );
          carouselRef.current = false;
        }

        if (Math.abs(gamepad.axes[2]) > axisThreshold) {
          inv = rotate4(inv, rotateSpeed * gamepad.axes[2], 0, 1, 0);
          carouselRef.current = false;
        }
        if (Math.abs(gamepad.axes[3]) > axisThreshold) {
          inv = rotate4(inv, -rotateSpeed * gamepad.axes[3], 1, 0, 0);
          carouselRef.current = false;
        }

        let tiltAxis = gamepad.buttons[6].value - gamepad.buttons[7].value;
        if (Math.abs(tiltAxis) > axisThreshold) {
          inv = rotate4(inv, rotateSpeed * tiltAxis, 0, 0, 1);
          carouselRef.current = false;
        }
        if (gamepad.buttons[4].pressed && !leftGamepadTrigger) {
          camera = cameras[(cameras.indexOf(camera) + 1) % cameras.length];
          inv = invert4(getViewMatrix(camera));
          if (!inv) {
            requestAnimationFrame(frame);
            return;
          }
          carouselRef.current = false;
        }
        if (gamepad.buttons[5].pressed && !rightGamepadTrigger) {
          camera =
            cameras[
              (cameras.indexOf(camera) + cameras.length - 1) % cameras.length
            ];
          inv = invert4(getViewMatrix(camera));
          if (!inv) {
            requestAnimationFrame(frame);
            return;
          }
          carouselRef.current = false;
        }
        leftGamepadTrigger = gamepad.buttons[4].pressed;
        rightGamepadTrigger = gamepad.buttons[5].pressed;
        if (gamepad.buttons[0].pressed) {
          isJumping = true;
          carouselRef.current = false;
        }
        if (gamepad.buttons[3].pressed) {
          carouselRef.current = true;
          onCarouselChange(true);
        }
      }

      if (
        ["KeyJ", "KeyK", "KeyL", "KeyI"].some((k) => activeKeys.includes(k))
      ) {
        let d = 4;
        inv = translate4(inv, 0, 0, d);
        inv = rotate4(
          inv,
          activeKeys.includes("KeyJ")
            ? -0.05
            : activeKeys.includes("KeyL")
            ? 0.05
            : 0,
          0,
          1,
          0
        );
        inv = rotate4(
          inv,
          activeKeys.includes("KeyI")
            ? 0.05
            : activeKeys.includes("KeyK")
            ? -0.05
            : 0,
          1,
          0,
          0
        );
        inv = translate4(inv, 0, 0, -d);
      }

      viewMatrix = invert4(inv) || viewMatrix;

      if (carouselRef.current) {
        let inv = invert4(defaultViewMatrix);
        if (!inv) {
          requestAnimationFrame(frame);
          return;
        }

        const t = Math.sin((Date.now() - start) / 5000);
        inv = translate4(inv, 2.5 * t, 0, 6 * (1 - Math.cos(t)));
        inv = rotate4(inv, -0.6 * t, 0, 1, 0);

        viewMatrix = invert4(inv) || viewMatrix;
      }

      if (isJumping) {
        jumpDelta = Math.min(1, jumpDelta + 0.05);
      } else {
        jumpDelta = Math.max(0, jumpDelta - 0.05);
      }

      let inv2 = invert4(viewMatrix);
      if (!inv2) {
        requestAnimationFrame(frame);
        return;
      }
      inv2 = translate4(inv2, 0, -jumpDelta, 0);
      inv2 = rotate4(inv2, -0.1 * jumpDelta, 1, 0, 0);
      let actualViewMatrix = invert4(inv2);
      if (!actualViewMatrix) {
        requestAnimationFrame(frame);
        return;
      }

      const viewProj = multiply4(projectionMatrix, actualViewMatrix);
      worker.postMessage({ view: viewProj });

      if (vertexCount > 0) {
        onLoaded();
        gl.uniformMatrix4fv(u_view, false, actualViewMatrix);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, vertexCount);
      } else {
        gl.clear(gl.COLOR_BUFFER_BIT);
        start = Date.now() + 2000;
      }

      const progressValue =
        (100 * vertexCount) / (splatData.length / rowLength);
      if (progressValue < 100 && splatData.length > 0) {
        onProgress(progressValue);
      } else if (splatData.length > 0) {
        onProgress(100);
      }

      requestAnimationFrame(frame);
    };

    frame(0);

    const isPly = (data: Uint8Array) =>
      data[0] == 112 && data[1] == 108 && data[2] == 121 && data[3] == 10;

    const selectFile = (file: File) => {
      const fr = new FileReader();
      if (/\.json$/i.test(file.name)) {
        fr.onload = () => {
          const loadedCameras = JSON.parse(fr.result as string);
          cameras.length = 0;
          cameras.push(...loadedCameras);
          camera = cameras[0];
          viewMatrix = getViewMatrix(camera);
          resize();
        };
        fr.readAsText(file);
      } else {
        fr.onload = () => {
          splatData = new Uint8Array(fr.result as ArrayBuffer);

          if (isPly(splatData)) {
            worker.postMessage({ ply: splatData.buffer, save: true });
          } else {
            worker.postMessage({
              buffer: splatData.buffer,
              vertexCount: Math.floor(splatData.length / rowLength),
            });
          }
        };
        fr.readAsArrayBuffer(file);
      }
    };

    const handleHashChange = () => {
      try {
        const hash = window.location.hash.slice(1);
        if (hash) {
          viewMatrix = JSON.parse(decodeURIComponent(hash));
          carouselRef.current = false;
          onCarouselChange(false);
        }
      } catch (err) {}
    };

    window.addEventListener("hashchange", handleHashChange);

    const preventDefault = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer?.files[0]) {
        selectFile(e.dataTransfer.files[0]);
      }
    };

    document.addEventListener("dragenter", preventDefault);
    document.addEventListener("dragover", preventDefault);
    document.addEventListener("dragleave", preventDefault);
    document.addEventListener("drop", handleDrop);

    // Load model
    (async () => {
      try {
        const req = await fetch(url, {
          mode: "cors",
          credentials: "omit",
        });
        if (req.status != 200)
          throw new Error(req.status + " Unable to load " + req.url);

        const reader = req.body?.getReader();
        if (!reader) return;

        const contentLength = req.headers.get("content-length");
        if (!contentLength) return;

        splatData = new Uint8Array(parseInt(contentLength));

        let bytesRead = 0;
        let lastVertexCount = -1;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          splatData.set(value, bytesRead);
          bytesRead += value.length;

          if (vertexCount > lastVertexCount) {
            if (!isPly(splatData)) {
              worker.postMessage({
                buffer: splatData.buffer,
                vertexCount: Math.floor(bytesRead / rowLength),
              });
            }
            lastVertexCount = vertexCount;
          }
        }
        if (isPly(splatData)) {
          worker.postMessage({ ply: splatData.buffer, save: false });
        } else {
          worker.postMessage({
            buffer: splatData.buffer,
            vertexCount: Math.floor(bytesRead / rowLength),
          });
        }
      } catch (err) {
        onError(err instanceof Error ? err.toString() : "Unknown error");
      }
    })();

    return () => {
      worker.terminate();
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("hashchange", handleHashChange);
      document.removeEventListener("dragenter", preventDefault);
      document.removeEventListener("dragover", preventDefault);
      document.removeEventListener("dragleave", preventDefault);
      document.removeEventListener("drop", handleDrop);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("contextmenu", handleContextMenu);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [modelUrl, onProgress, onLoaded, onError, onCarouselChange]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ touchAction: "none" }}
    />
  );
}
