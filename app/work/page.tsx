'use client';

import { useEffect, useRef, useState } from 'react';

const cameras = [
    {
        id: 0,
        img_name: "00001",
        width: 1959,
        height: 1090,
        position: [
            -3.0089893469241797, -0.11086489695181866, -3.7527640949141428,
        ],
        rotation: [
            [0.876134201218856, 0.06925962026449776, 0.47706599800804744],
            [-0.04747421839895102, 0.9972110940209488, -0.057586739349882114],
            [-0.4797239414934443, 0.027805376500959853, 0.8769787916452908],
        ],
        fy: 1164.6601287484507,
        fx: 1159.5880733038064,
    },
    {
        id: 1,
        img_name: "00009",
        width: 1959,
        height: 1090,
        position: [
            -2.5199776022057296, -0.09704735754873686, -3.6247725540304545,
        ],
        rotation: [
            [0.9982731285632193, -0.011928707708098955, -0.05751927260507243],
            [0.0065061360949636325, 0.9955928229282383, -0.09355533724430458],
            [0.058381769258182864, 0.09301955098900708, 0.9939511719154457],
        ],
        fy: 1164.6601287484507,
        fx: 1159.5880733038064,
    },
    {
        id: 2,
        img_name: "00017",
        width: 1959,
        height: 1090,
        position: [
            -0.7737533667465242, -0.3364271945329695, -2.9358969417573753,
        ],
        rotation: [
            [0.9998813418672372, 0.013742375651625236, -0.0069605529394208224],
            [-0.014268370388586709, 0.996512943252834, -0.08220929105659476],
            [0.00580653013657589, 0.08229885200307129, 0.9965907801935302],
        ],
        fy: 1164.6601287484507,
        fx: 1159.5880733038064,
    },
    {
        id: 3,
        img_name: "00025",
        width: 1959,
        height: 1090,
        position: [
            1.2198221749590001, -0.2196687861401182, -2.3183162007028453,
        ],
        rotation: [
            [0.9208648867765482, 0.0012010625395201253, 0.389880004297208],
            [-0.06298204172269357, 0.987319521752825, 0.14571693239364383],
            [-0.3847611242348369, -0.1587410451475895, 0.9092635249821667],
        ],
        fy: 1164.6601287484507,
        fx: 1159.5880733038064,
    },
    {
        id: 4,
        img_name: "00033",
        width: 1959,
        height: 1090,
        position: [
            1.742387858893817, -0.13848225198886954, -2.0566370113193146,
        ],
        rotation: [
            [0.24669889292141334, -0.08370189346592856, -0.9654706879349405],
            [0.11343747891376445, 0.9919082664242816, -0.05700815184573074],
            [0.9624300466054861, -0.09545671285663988, 0.2541976029815521],
        ],
        fy: 1164.6601287484507,
        fx: 1159.5880733038064,
    },
    {
        id: 5,
        img_name: "00041",
        width: 1959,
        height: 1090,
        position: [
            3.6567309419223935, -0.16470990600750707, -1.3458085590422042,
        ],
        rotation: [
            [0.2341293058324528, -0.02968330457755884, -0.9717522161434825],
            [0.10270823606832301, 0.99469554638321, -0.005638106875665722],
            [0.9667649592295676, -0.09848690996657204, 0.2359360976431732],
        ],
        fy: 1164.6601287484507,
        fx: 1159.5880733038064,
    },
    {
        id: 6,
        img_name: "00049",
        width: 1959,
        height: 1090,
        position: [
            3.9013554243203497, -0.2597500978038105, -0.8106154188297828,
        ],
        rotation: [
            [0.6717235545638952, -0.015718162115524837, -0.7406351366386528],
            [0.055627354673906296, 0.9980224478387622, 0.029270992841185218],
            [0.7387104058127439, -0.060861588786650656, 0.6712695459756353],
        ],
        fy: 1164.6601287484507,
        fx: 1159.5880733038064,
    },
    {
        id: 7,
        img_name: "00057",
        width: 1959,
        height: 1090,
        position: [4.742994605467533, -0.05591660945412069, 0.9500365976084458],
        rotation: [
            [-0.17042655709210375, 0.01207080756938, -0.9852964448542146],
            [0.1165090336695526, 0.9931575292530063, -0.00798543433078162],
            [0.9784581921120181, -0.1161568667478904, -0.1706667764862097],
        ],
        fy: 1164.6601287484507,
        fx: 1159.5880733038064,
    },
    {
        id: 8,
        img_name: "00065",
        width: 1959,
        height: 1090,
        position: [4.34676307626522, 0.08168160516967145, 1.0876221470355405],
        rotation: [
            [-0.003575447631888379, -0.044792503246552894, -0.9989899137764799],
            [0.10770152645126597, 0.9931680875192705, -0.04491693593046672],
            [0.9941768441149182, -0.10775333677534978, 0.0012732004866391048],
        ],
        fy: 1164.6601287484507,
        fx: 1159.5880733038064,
    },
    {
        id: 9,
        img_name: "00073",
        width: 1959,
        height: 1090,
        position: [3.264984351114202, 0.078974937336732, 1.0117200284114904],
        rotation: [
            [-0.026919994628162257, -0.1565891128261527, -0.9872968974090509],
            [0.08444552208239385, 0.983768234577625, -0.1583319754069128],
            [0.9960643893290491, -0.0876350978794554, -0.013259786205163005],
        ],
        fy: 1164.6601287484507,
        fx: 1159.5880733038064,
    },
];

function getProjectionMatrix(fx: number, fy: number, width: number, height: number) {
    const znear = 0.2;
    const zfar = 200;
    return [
        [(2 * fx) / width, 0, 0, 0],
        [0, -(2 * fy) / height, 0, 0],
        [0, 0, zfar / (zfar - znear), 1],
        [0, 0, -(zfar * znear) / (zfar - znear), 0],
    ].flat();
}

function getViewMatrix(camera: typeof cameras[0]) {
    const R = camera.rotation.flat();
    const t = camera.position;
    const camToWorld = [
        [R[0], R[1], R[2], 0],
        [R[3], R[4], R[5], 0],
        [R[6], R[7], R[8], 0],
        [
            -t[0] * R[0] - t[1] * R[3] - t[2] * R[6],
            -t[0] * R[1] - t[1] * R[4] - t[2] * R[7],
            -t[0] * R[2] - t[1] * R[5] - t[2] * R[8],
            1,
        ],
    ].flat();
    return camToWorld;
}

function multiply4(a: number[], b: number[]) {
    return [
        b[0] * a[0] + b[1] * a[4] + b[2] * a[8] + b[3] * a[12],
        b[0] * a[1] + b[1] * a[5] + b[2] * a[9] + b[3] * a[13],
        b[0] * a[2] + b[1] * a[6] + b[2] * a[10] + b[3] * a[14],
        b[0] * a[3] + b[1] * a[7] + b[2] * a[11] + b[3] * a[15],
        b[4] * a[0] + b[5] * a[4] + b[6] * a[8] + b[7] * a[12],
        b[4] * a[1] + b[5] * a[5] + b[6] * a[9] + b[7] * a[13],
        b[4] * a[2] + b[5] * a[6] + b[6] * a[10] + b[7] * a[14],
        b[4] * a[3] + b[5] * a[7] + b[6] * a[11] + b[7] * a[15],
        b[8] * a[0] + b[9] * a[4] + b[10] * a[8] + b[11] * a[12],
        b[8] * a[1] + b[9] * a[5] + b[10] * a[9] + b[11] * a[13],
        b[8] * a[2] + b[9] * a[6] + b[10] * a[10] + b[11] * a[14],
        b[8] * a[3] + b[9] * a[7] + b[10] * a[11] + b[11] * a[15],
        b[12] * a[0] + b[13] * a[4] + b[14] * a[8] + b[15] * a[12],
        b[12] * a[1] + b[13] * a[5] + b[14] * a[9] + b[15] * a[13],
        b[12] * a[2] + b[13] * a[6] + b[14] * a[10] + b[15] * a[14],
        b[12] * a[3] + b[13] * a[7] + b[14] * a[11] + b[15] * a[15],
    ];
}

function invert4(a: number[]) {
    let b00 = a[0] * a[5] - a[1] * a[4];
    let b01 = a[0] * a[6] - a[2] * a[4];
    let b02 = a[0] * a[7] - a[3] * a[4];
    let b03 = a[1] * a[6] - a[2] * a[5];
    let b04 = a[1] * a[7] - a[3] * a[5];
    let b05 = a[2] * a[7] - a[3] * a[6];
    let b06 = a[8] * a[13] - a[9] * a[12];
    let b07 = a[8] * a[14] - a[10] * a[12];
    let b08 = a[8] * a[15] - a[11] * a[12];
    let b09 = a[9] * a[14] - a[10] * a[13];
    let b10 = a[9] * a[15] - a[11] * a[13];
    let b11 = a[10] * a[15] - a[11] * a[14];
    let det =
        b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) return null;
    return [
        (a[5] * b11 - a[6] * b10 + a[7] * b09) / det,
        (a[2] * b10 - a[1] * b11 - a[3] * b09) / det,
        (a[13] * b05 - a[14] * b04 + a[15] * b03) / det,
        (a[10] * b04 - a[9] * b05 - a[11] * b03) / det,
        (a[6] * b08 - a[4] * b11 - a[7] * b07) / det,
        (a[0] * b11 - a[2] * b08 + a[3] * b07) / det,
        (a[14] * b02 - a[12] * b05 - a[15] * b01) / det,
        (a[8] * b05 - a[10] * b02 + a[11] * b01) / det,
        (a[4] * b10 - a[5] * b08 + a[7] * b06) / det,
        (a[1] * b08 - a[0] * b10 - a[3] * b06) / det,
        (a[12] * b04 - a[13] * b02 + a[15] * b00) / det,
        (a[9] * b02 - a[8] * b04 - a[11] * b00) / det,
        (a[5] * b07 - a[4] * b09 - a[6] * b06) / det,
        (a[0] * b09 - a[1] * b07 + a[2] * b06) / det,
        (a[13] * b01 - a[12] * b03 - a[14] * b00) / det,
        (a[8] * b03 - a[9] * b01 + a[10] * b00) / det,
    ];
}

function rotate4(a: number[], rad: number, x: number, y: number, z: number) {
    let len = Math.hypot(x, y, z);
    x /= len;
    y /= len;
    z /= len;
    let s = Math.sin(rad);
    let c = Math.cos(rad);
    let t = 1 - c;
    let b00 = x * x * t + c;
    let b01 = y * x * t + z * s;
    let b02 = z * x * t - y * s;
    let b10 = x * y * t - z * s;
    let b11 = y * y * t + c;
    let b12 = z * y * t + x * s;
    let b20 = x * z * t + y * s;
    let b21 = y * z * t - x * s;
    let b22 = z * z * t + c;
    return [
        a[0] * b00 + a[4] * b01 + a[8] * b02,
        a[1] * b00 + a[5] * b01 + a[9] * b02,
        a[2] * b00 + a[6] * b01 + a[10] * b02,
        a[3] * b00 + a[7] * b01 + a[11] * b02,
        a[0] * b10 + a[4] * b11 + a[8] * b12,
        a[1] * b10 + a[5] * b11 + a[9] * b12,
        a[2] * b10 + a[6] * b11 + a[10] * b12,
        a[3] * b10 + a[7] * b11 + a[11] * b12,
        a[0] * b20 + a[4] * b21 + a[8] * b22,
        a[1] * b20 + a[5] * b21 + a[9] * b22,
        a[2] * b20 + a[6] * b21 + a[10] * b22,
        a[3] * b20 + a[7] * b21 + a[11] * b22,
        ...a.slice(12, 16),
    ];
}

function translate4(a: number[], x: number, y: number, z: number) {
    return [
        ...a.slice(0, 12),
        a[0] * x + a[4] * y + a[8] * z + a[12],
        a[1] * x + a[5] * y + a[9] * z + a[13],
        a[2] * x + a[6] * y + a[10] * z + a[14],
        a[3] * x + a[7] * y + a[11] * z + a[15],
    ];
}

const vertexShaderSource = `
#version 300 es
precision highp float;
precision highp int;

uniform highp usampler2D u_texture;
uniform mat4 projection, view;
uniform vec2 focal;
uniform vec2 viewport;

in vec2 position;
in int index;

out vec4 vColor;
out vec2 vPosition;

void main () {
    uvec4 cen = texelFetch(u_texture, ivec2((uint(index) & 0x3ffu) << 1, uint(index) >> 10), 0);
    vec4 cam = view * vec4(uintBitsToFloat(cen.xyz), 1);
    vec4 pos2d = projection * cam;

    float clip = 1.2 * pos2d.w;
    if (pos2d.z < -clip || pos2d.x < -clip || pos2d.x > clip || pos2d.y < -clip || pos2d.y > clip) {
        gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
        return;
    }

    uvec4 cov = texelFetch(u_texture, ivec2(((uint(index) & 0x3ffu) << 1) | 1u, uint(index) >> 10), 0);
    vec2 u1 = unpackHalf2x16(cov.x), u2 = unpackHalf2x16(cov.y), u3 = unpackHalf2x16(cov.z);
    mat3 Vrk = mat3(u1.x, u1.y, u2.x, u1.y, u2.y, u3.x, u2.x, u3.x, u3.y);

    mat3 J = mat3(
        focal.x / cam.z, 0., -(focal.x * cam.x) / (cam.z * cam.z),
        0., -focal.y / cam.z, (focal.y * cam.y) / (cam.z * cam.z),
        0., 0., 0.
    );

    mat3 T = transpose(mat3(view)) * J;
    mat3 cov2d = transpose(T) * Vrk * T;

    float mid = (cov2d[0][0] + cov2d[1][1]) / 2.0;
    float radius = length(vec2((cov2d[0][0] - cov2d[1][1]) / 2.0, cov2d[0][1]));
    float lambda1 = mid + radius, lambda2 = mid - radius;

    if(lambda2 < 0.0) return;
    vec2 diagonalVector = normalize(vec2(cov2d[0][1], lambda1 - cov2d[0][0]));
    vec2 majorAxis = min(sqrt(2.0 * lambda1), 1024.0) * diagonalVector;
    vec2 minorAxis = min(sqrt(2.0 * lambda2), 1024.0) * vec2(diagonalVector.y, -diagonalVector.x);

    vColor = clamp(pos2d.z/pos2d.w+1.0, 0.0, 1.0) * vec4((cov.w) & 0xffu, (cov.w >> 8) & 0xffu, (cov.w >> 16) & 0xffu, (cov.w >> 24) & 0xffu) / 255.0;
    vPosition = position;

    vec2 vCenter = vec2(pos2d) / pos2d.w;
    gl_Position = vec4(
        vCenter
        + position.x * majorAxis / viewport
        + position.y * minorAxis / viewport, 0.0, 1.0);

}
`.trim();

const fragmentShaderSource = `
#version 300 es
precision highp float;

in vec4 vColor;
in vec2 vPosition;

out vec4 fragColor;

void main () {
    float A = -dot(vPosition, vPosition);
    if (A < -4.0) discard;
    float B = exp(A) * vColor.a;
    fragColor = vec4(B * vColor.rgb, B);
}

`.trim();

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const spinnerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const messageRef = useRef<HTMLDivElement>(null);
    const camidRef = useRef<HTMLSpanElement>(null);
    const [showSpinner, setShowSpinner] = useState(true);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [camid, setCamid] = useState('');

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Add nohf class if on huggingface
        if (window.location.host.includes('hf.space')) {
            document.body.classList.add('nohf');
        }

        let camera = cameras[0];
        const defaultViewMatrix = [
            0.47, 0.04, 0.88, 0, -0.11, 0.99, 0.02, 0, -0.88, -0.11, 0.47, 0, 0.07,
            0.03, 6.55, 1,
        ];
        let viewMatrix = defaultViewMatrix;
        let carousel = true;

        const params = new URLSearchParams(window.location.search);
        try {
            const hash = window.location.hash.slice(1);
            if (hash) {
                viewMatrix = JSON.parse(decodeURIComponent(hash));
                carousel = false;
            }
        } catch (err) {}

        const url = new URL(
            params.get("url") || process.env.NEXT_PUBLIC_MODEL!,
            process.env.NEXT_PUBLIC_HUGGINGFACE_URL,
        );

        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl2", {
            antialias: false,
        });
        if (!gl) {
            setMessage("WebGL2 not supported");
            return;
        }

        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        if (!vertexShader) return;
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
            console.error(gl.getShaderInfoLog(vertexShader));

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (!fragmentShader) return;
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
            console.error(gl.getShaderInfoLog(fragmentShader));

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
            console.error(gl.getProgramInfoLog(program));

        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(
            gl.ONE_MINUS_DST_ALPHA,
            gl.ONE,
            gl.ONE_MINUS_DST_ALPHA,
            gl.ONE,
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

        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        var u_textureLocation = gl.getUniformLocation(program, "u_texture");
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

        const worker = new Worker('/worker.js');

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
                window.innerHeight,
            );

            gl.uniform2fv(u_viewport, new Float32Array([window.innerWidth, window.innerHeight]));

            const downsample = splatData.length / rowLength > 500000 ? 1 : 1 / window.devicePixelRatio;
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
                if (e.data.save) {
                    const blob = new Blob([splatData.buffer], {
                        type: "application/octet-stream",
                    });
                    const link = document.createElement("a");
                    link.download = "model.splat";
                    link.href = URL.createObjectURL(blob);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            } else if (e.data.texdata) {
                const { texdata, texwidth, texheight } = e.data;
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texParameteri(
                    gl.TEXTURE_2D,
                    gl.TEXTURE_WRAP_S,
                    gl.CLAMP_TO_EDGE,
                );
                gl.texParameteri(
                    gl.TEXTURE_2D,
                    gl.TEXTURE_WRAP_T,
                    gl.CLAMP_TO_EDGE,
                );
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
                    texdata,
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
            carousel = false;
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
            setCamid("cam  " + currentCameraIndex);
            if (e.code == "KeyV") {
                window.location.hash =
                    "#" +
                    JSON.stringify(
                        viewMatrix.map((k) => Math.round(k * 100) / 100),
                    );
                setCamid("");
            } else if (e.code === "KeyP") {
                carousel = true;
                setCamid("");
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
            carousel = false;
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
                    0,
                );
            } else if (e.ctrlKey || e.metaKey) {
                inv = translate4(
                    inv,
                    0,
                    0,
                    (-10 * (e.deltaY * scale)) / window.innerHeight,
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

        let startX = 0, startY = 0, down = 0;

        const handleMouseDown = (e: MouseEvent) => {
            carousel = false;
            e.preventDefault();
            startX = e.clientX;
            startY = e.clientY;
            down = e.ctrlKey || e.metaKey ? 2 : 1;
        };

        const handleContextMenu = (e: MouseEvent) => {
            carousel = false;
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
                    (10 * (e.clientY - startY)) / window.innerHeight,
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

        let altX = 0, altY = 0;

        const handleTouchStart = (e: TouchEvent) => {
            e.preventDefault();
            if (e.touches.length === 1) {
                carousel = false;
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                down = 1;
            } else if (e.touches.length === 2) {
                carousel = false;
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
                        e.touches[0].clientX - e.touches[1].clientX,
                    );
                const dscale =
                    Math.hypot(startX - altX, startY - altY) /
                    Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY,
                    );
                const dx =
                    (e.touches[0].clientX +
                        e.touches[1].clientX -
                        (startX + altX)) /
                    2;
                const dy =
                    (e.touches[0].clientY +
                        e.touches[1].clientY -
                        (startY + altY)) /
                    2;
                let inv = invert4(viewMatrix);
                if (!inv) return;
                inv = rotate4(inv, dtheta, 0, 0, 1);

                inv = translate4(inv, -dx / window.innerWidth, -dy / window.innerHeight, 0);

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
        let lastFrame = 0;
        let start = 0;

        window.addEventListener("gamepadconnected", (e) => {
            const gp = navigator.getGamepads()[e.gamepad.index];
            if (gp) {
                console.log(
                    `Gamepad connected at index ${gp.index}: ${gp.id}. It has ${gp.buttons.length} buttons and ${gp.axes.length} axes.`,
                );
            }
        });
        window.addEventListener("gamepaddisconnected", (e) => {
            console.log("Gamepad disconnected");
        });

        let leftGamepadTrigger = false, rightGamepadTrigger = false;

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
            if (activeKeys.includes("ArrowLeft"))
                inv = translate4(inv, -0.03, 0, 0);
            if (activeKeys.includes("ArrowRight"))
                inv = translate4(inv, 0.03, 0, 0);
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
                    carousel = false;
                }
                if (Math.abs(gamepad.axes[1]) > axisThreshold) {
                    inv = translate4(inv, 0, 0, -moveSpeed * gamepad.axes[1]);
                    carousel = false;
                }
                if (gamepad.buttons[12].pressed || gamepad.buttons[13].pressed) {
                    inv = translate4(
                        inv,
                        0,
                        -moveSpeed *
                            ((gamepad.buttons[12].pressed ? 1 : 0) -
                                (gamepad.buttons[13].pressed ? 1 : 0)),
                        0,
                    );
                    carousel = false;
                }

                if (gamepad.buttons[14].pressed || gamepad.buttons[15].pressed) {
                    inv = translate4(
                        inv,
                        -moveSpeed *
                            ((gamepad.buttons[14].pressed ? 1 : 0) -
                                (gamepad.buttons[15].pressed ? 1 : 0)),
                        0,
                        0,
                    );
                    carousel = false;
                }

                if (Math.abs(gamepad.axes[2]) > axisThreshold) {
                    inv = rotate4(inv, rotateSpeed * gamepad.axes[2], 0, 1, 0);
                    carousel = false;
                }
                if (Math.abs(gamepad.axes[3]) > axisThreshold) {
                    inv = rotate4(inv, -rotateSpeed * gamepad.axes[3], 1, 0, 0);
                    carousel = false;
                }

                let tiltAxis = gamepad.buttons[6].value - gamepad.buttons[7].value;
                if (Math.abs(tiltAxis) > axisThreshold) {
                    inv = rotate4(inv, rotateSpeed * tiltAxis, 0, 0, 1);
                    carousel = false;
                }
                if (gamepad.buttons[4].pressed && !leftGamepadTrigger) {
                    camera =
                        cameras[(cameras.indexOf(camera) + 1) % cameras.length];
                    inv = invert4(getViewMatrix(camera));
                    if (!inv) {
                        requestAnimationFrame(frame);
                        return;
                    }
                    carousel = false;
                }
                if (gamepad.buttons[5].pressed && !rightGamepadTrigger) {
                    camera =
                        cameras[
                            (cameras.indexOf(camera) + cameras.length - 1) %
                                cameras.length
                        ];
                    inv = invert4(getViewMatrix(camera));
                    if (!inv) {
                        requestAnimationFrame(frame);
                        return;
                    }
                    carousel = false;
                }
                leftGamepadTrigger = gamepad.buttons[4].pressed;
                rightGamepadTrigger = gamepad.buttons[5].pressed;
                if (gamepad.buttons[0].pressed) {
                    isJumping = true;
                    carousel = false;
                }
                if (gamepad.buttons[3].pressed) {
                    carousel = true;
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
                    0,
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
                    0,
                );
                inv = translate4(inv, 0, 0, -d);
            }

            viewMatrix = invert4(inv) || viewMatrix;

            if (carousel) {
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
                setShowSpinner(false);
                gl.uniformMatrix4fv(u_view, false, actualViewMatrix);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, vertexCount);
            } else {
                gl.clear(gl.COLOR_BUFFER_BIT);
                setShowSpinner(true);
                start = Date.now() + 2000;
            }
            const progressValue = (100 * vertexCount) / (splatData.length / rowLength);
            if (progressValue < 100 && splatData.length > 0) {
                setProgress(progressValue);
            } else {
                setProgress(100);
            }
            if (isNaN(currentCameraIndex)) {
                setCamid("");
            }
            lastFrame = now;
            requestAnimationFrame(frame);
        };

        frame(0);

        const isPly = (data: Uint8Array) =>
            data[0] == 112 &&
            data[1] == 108 &&
            data[2] == 121 &&
            data[3] == 10;

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
                    console.log("Loaded Cameras");
                };
                fr.readAsText(file);
            } else {
                let stopLoading = false;
                fr.onload = () => {
                    splatData = new Uint8Array(fr.result as ArrayBuffer);
                    console.log("Loaded", Math.floor(splatData.length / rowLength));

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
                    carousel = false;
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

        (async () => {
            try {
                const req = await fetch(url, {
                    mode: "cors",
                    credentials: "omit",
                });
                console.log(req);
                if (req.status != 200)
                    throw new Error(req.status + " Unable to load " + req.url);

                const reader = req.body?.getReader();
                if (!reader) return;

                const contentLength = req.headers.get("content-length");
                if (!contentLength) return;

                splatData = new Uint8Array(parseInt(contentLength));

                const downsample =
                    splatData.length / rowLength > 500000 ? 1 : 1 / window.devicePixelRatio;
                console.log(splatData.length / rowLength, downsample);

                let bytesRead = 0;
                let lastVertexCount = -1;
                let stopLoading = false;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done || stopLoading) break;

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
                if (!stopLoading) {
                    if (isPly(splatData)) {
                        worker.postMessage({ ply: splatData.buffer, save: false });
                    } else {
                        worker.postMessage({
                            buffer: splatData.buffer,
                            vertexCount: Math.floor(bytesRead / rowLength),
                        });
                    }
                }
            } catch (err) {
                setShowSpinner(false);
                setMessage(err instanceof Error ? err.toString() : 'Unknown error');
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
    }, []);

    return (
        <>
            <div id="message" ref={messageRef}>
                {message}
            </div>
            {showSpinner && (
                <div className="scene" id="spinner" ref={spinnerRef}>
                    <div className="cube-wrapper">
                        <div className="cube">
                            <div className="cube-faces">
                                <div className="cube-face bottom"></div>
                                <div className="cube-face top"></div>
                                <div className="cube-face left"></div>
                                <div className="cube-face right"></div>
                                <div className="cube-face back"></div>
                                <div className="cube-face front"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <canvas id="canvas" ref={canvasRef} />
            <div id="caminfo">
                <span id="camid" ref={camidRef}>
                    {camid}
                </span>
            </div>
        </>
    );
}

