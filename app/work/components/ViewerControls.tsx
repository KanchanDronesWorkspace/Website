"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RotateCw,
  Info,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Project } from "../data/projects";

interface ViewerControlsProps {
  project: Project;
  isCarousel: boolean;
  onToggleCarousel: () => void;
  onScreenshot?: () => void;
  onFullscreen?: () => void;
}

export function ViewerControls({
  project,
  isCarousel,
  onToggleCarousel,
}: ViewerControlsProps) {
  const [showControls, setShowControls] = useState(false);

  return (
    <>
      <motion.div
        className="absolute top-20 md:top-24 left-4 md:left-6 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 md:p-5 border border-white/10 max-w-xs md:max-w-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-lg md:text-xl font-sentient text-white leading-tight">
                {project.name}
              </h1>
              <p className="text-xs md:text-sm text-white/50 mt-1">
                {project.location} • {project.date}
              </p>
            </div>
            <span className="text-2xl">
              {getCategoryEmoji(project.category)}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 md:gap-4 mt-3 text-[10px] md:text-xs text-white/40">
            <span className="flex items-center gap-1">
              <span className="text-primary">📷</span> {project.stats.images}
            </span>
            <span className="flex items-center gap-1">
              <span className="text-primary">📐</span> {project.stats.points}
            </span>
            <span className="flex items-center gap-1">
              <span className="text-primary">📏</span> {project.stats.area}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-20 md:top-24 right-4 md:right-6 z-20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-black/60 backdrop-blur-md rounded-xl p-2 border border-white/10 flex gap-1">
          <Button
            variant="default"
            size="default"
            className={`h-9 w-9 text-white/70 hover:text-white hover:bg-white/10 ${
              isCarousel ? "text-primary bg-primary/10" : ""
            }`}
            onClick={onToggleCarousel}
            title="Toggle auto-rotate"
          >
            <RotateCw className="h-4 w-4" />
          </Button>

          <Button
            variant="default"
            size="default"
            className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => setShowControls(!showControls)}
            title="Show controls"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute top-40 right-4 md:right-6 z-20"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
          >
            <div className="bg-black/80 backdrop-blur-md rounded-xl p-4 border border-white/10 w-64">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-white">Controls</h3>
                <button
                  onClick={() => setShowControls(false)}
                  className="text-white/40 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                movement (arrow keys)
- left/right arrow keys to strafe side to side
- up/down arrow keys to move forward/back
- space to jump

camera angle (wasd)
- a/d to turn camera left/right
- w/s to tilt camera up/down
- q/e to roll camera counterclockwise/clockwise
- i/k and j/l to orbit

trackpad
- scroll up/down/left/right to orbit
- pinch to move forward/back
- ctrl key + scroll to move forward/back
- shift + scroll to move up/down or strafe

mouse
- click and drag to orbit
- right click (or ctrl/cmd key) and drag up/down to move

touch (mobile)
- one finger to orbit
- two finger pinch to move forward/back
- two finger rotate to rotate camera clockwise/counterclockwise
- two finger pan to move side-to-side and up-down

gamepad
- if you have a game controller connected it should work

other
- press 0-9 to switch to one of the pre-loaded camera views
- press '-' or '+'key to cycle loaded cameras
- press p to resume default animation
- drag and drop .ply file to convert to .splat
- drag and drop cameras.json to load cameras
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="bg-black/50 backdrop-blur-sm rounded-full px-5 py-2.5 flex items-center gap-4 text-xs text-white/60 border border-white/5">
          <span className="flex items-center gap-2">
            <span className="text-primary">🖱️</span> Drag to rotate
          </span>
          <span className="w-px h-3 bg-white/20" />
          <span className="flex items-center gap-2">
            <span className="text-primary">🔍</span> Scroll to zoom
          </span>
          <span className="w-px h-3 bg-white/20" />
          <span className="flex items-center gap-2">
            <span className="text-primary">⌨️</span> WASD to move
          </span>
        </div>
      </motion.div>
    </>
  );
}

function getCategoryEmoji(category: Project["category"]) {
  switch (category) {
    case "construction":
      return "🏗️";
    case "heritage":
      return "🏛️";
    case "landscape":
      return "🌳";
    case "infrastructure":
      return "🛤️";
    default:
      return "📦";
  }
}
