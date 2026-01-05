"use client";

import { motion } from "motion/react";

interface LoadingScreenProps {
  progress: number;
  projectName?: string;
}

export function LoadingScreen({
  progress,
  projectName = "3D Model",
}: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <motion.p
          className="text-white/50 text-sm md:text-base mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Loading <span className="text-primary">{projectName}</span> from
          millions of Gaussian splats...
        </motion.p>

        <div className="relative">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-yellow-400 to-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <motion.p
            className="text-white/40 text-xs mt-3 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {progress.toFixed(0)}% loaded
          </motion.p>
        </div>

        <div className="flex justify-center gap-1 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary/60 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
