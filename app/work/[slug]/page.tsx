"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, RotateCw, Info, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GaussianSplatViewer } from "../components/GaussianSplatViewer";
import { LoadingScreen } from "../components/LoadingScreen";
import { projects, getProjectBySlug, Project } from "../data/projects";

export default function ProjectViewerPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isCarousel, setIsCarousel] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const foundProject = getProjectBySlug(slug);
    if (foundProject) {
      setProject(foundProject);
    } else {
      setError("Project not found");
    }
  }, [slug]);

  const handleProgress = useCallback((value: number) => {
    setProgress(value);
  }, []);

  const handleLoaded = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  }, []);

  const handleCarouselChange = useCallback((value: boolean) => {
    setIsCarousel(value);
  }, []);

  if (error && !project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-6xl mb-6">😕</div>
          <h1 className="text-2xl font-sentient text-white mb-2">
            Project Not Found
          </h1>
          <p className="text-white/50 mb-8">
            The requested 3D model could not be found.
          </p>
          <Link href="/work">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {isLoading && (
        <LoadingScreen progress={progress} projectName={project.name} />
      )}

      {error && project && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/90">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-medium text-white mb-2">
              Failed to Load Model
            </h3>
            <p className="text-white/50 text-sm max-w-md mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                }}
              >
                Try Again
              </Button>
              <Link href="/work">
                <Button className="bg-transparent border-white/30 hover:bg-white/5">
                  Back to Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <GaussianSplatViewer
        modelUrl={project.modelUrl}
        onProgress={handleProgress}
        onLoaded={handleLoaded}
        onError={handleError}
        isCarousel={isCarousel}
        onCarouselChange={handleCarouselChange}
      />

      {!isLoading && !error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-0 left-0 right-0 z-30 p-4 md:p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/work">
                <button className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
              </Link>

              <div className="bg-black/60 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10">
                <h1 className="text-white font-medium">{project.name}</h1>
                <p className="text-white/40 text-xs font-mono">
                  {project.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative group">
                <button className="h-10 px-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2 hover:bg-white/10 transition-colors">
                  <span className="text-white text-sm font-mono">
                    Switch Model
                  </span>
                  <svg
                    className="w-4 h-4 text-white/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div className="absolute top-full right-0 mt-2 w-64 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {projects.map((p) => (
                    <Link
                      key={p.id}
                      href={`/work/${p.slug}`}
                      className={`block px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0 ${
                        p.slug === slug
                          ? "bg-primary/10 border-l-2 border-l-primary"
                          : ""
                      }`}
                    >
                      <p className="text-white font-medium text-sm">{p.name}</p>
                      <p className="text-white/40 text-xs font-mono">
                        {p.location}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsCarousel(!isCarousel)}
                className={`w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors ${
                  isCarousel
                    ? "text-primary border-primary/30"
                    : "text-white/60"
                }`}
                title="Toggle auto-rotate"
              >
                <RotateCw className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowHelp(!showHelp)}
                className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-white/60"
                title="Show controls"
              >
                <Info className="w-5 h-5" />
              </button>

              <Link href="/">
                <button className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-white/60">
                  <Home className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {showHelp && !isLoading && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute top-20 right-4 md:right-6 z-40 w-72"
        >
          <div className="bg-black/80 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Controls</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-white/60 font-mono">
              <div>
                <p className="text-primary mb-1">Movement (Arrow Keys)</p>
                <p>↑/↓ Forward/Back • ←/→ Strafe</p>
                <p>Space to jump</p>
              </div>
              <div>
                <p className="text-primary mb-1">Camera (WASD)</p>
                <p>A/D Turn • W/S Tilt</p>
                <p>Q/E Roll • I/J/K/L Orbit</p>
              </div>
              <div>
                <p className="text-primary mb-1">Mouse/Trackpad</p>
                <p>Drag to orbit • Scroll to zoom</p>
                <p>Right-click drag to pan</p>
              </div>
              <div>
                <p className="text-primary mb-1">Other</p>
                <p>0-9 Camera presets</p>
                <p>P Resume animation</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {!isLoading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 hidden md:block"
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
      )}

      {!isLoading && !error && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-6 left-6 z-30 hidden lg:block"
        >
          <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <div className="flex gap-6 text-xs font-mono">
              <div>
                <p className="text-primary">{project.stats.images}</p>
                <p className="text-white/30">Images</p>
              </div>
              <div>
                <p className="text-primary">{project.stats.points}</p>
                <p className="text-white/30">Points</p>
              </div>
              <div>
                <p className="text-primary">{project.stats.area}</p>
                <p className="text-white/30">Area</p>
              </div>
              <div>
                <p className="text-primary">{project.stats.accuracy}</p>
                <p className="text-white/30">Accuracy</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
