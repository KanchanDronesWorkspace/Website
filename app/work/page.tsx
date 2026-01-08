"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Play, ExternalLink } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { WorkBackground } from "@/components/work-background";
import { projects } from "./data/projects";

export default function WorkPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen relative">
      <WorkBackground />

      <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[120px]" />
      </div>

      <Header />

      <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 md:px-8">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-primary font-mono text-sm md:text-base uppercase tracking-wider mb-4">
              Our Portfolio
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sentient mb-6">
              Explore Our <br />
              <span className="font-light italic">3D Reconstructions</span>
            </h1>
            <p className="text-white/50 font-mono text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-10">
              Select a project below to explore interactive 3D reconstructions
              created from our aerial drone surveys. Navigate through
              high-fidelity Gaussian Splat renders with sub-centimeter accuracy.
            </p>

            <div className="relative inline-block w-full max-w-md mx-auto">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-left hover:border-primary/40 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-white font-bold">
                      {selectedProject
                        ? projects.find((p) => p.slug === selectedProject)?.name
                        : "Select a 3D Model"}
                    </p>
                    <p className="text-white/40 text-sm font-mono">
                      {selectedProject
                        ? projects.find((p) => p.slug === selectedProject)
                            ?.location
                        : "Choose from our portfolio"}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-white/60 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden z-50"
                >
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => {
                        setSelectedProject(project.slug);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0 ${
                        selectedProject === project.slug
                          ? "bg-primary/10 border-l-2 border-l-primary"
                          : ""
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-white font-medium">{project.name}</p>
                        <p className="text-white/40 text-sm font-mono">
                          {project.description.slice(0, 60)}...
                        </p>
                      </div>
                      <div className="text-right text-xs text-white/30 font-mono">
                        <p>{project.stats.points}</p>
                        <p>points</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {selectedProject && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <Link href={`/work/${selectedProject}`}>
                  <Button className="gap-2">
                    <Play className="w-4 h-4" />
                    Launch 3D Viewer
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="px-4 md:px-8 py-16 md:py-24">
        <div className="container max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-sentient text-center mb-12"
          >
            Available <span className="italic font-light">Models</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/work/${project.slug}`}>
                  <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary/30 transition-all duration-300 cursor-pointer h-full overflow-hidden">
                    <div className="relative w-full aspect-video overflow-hidden">
                      <Image
                        src={project.thumbnail}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/40 flex items-center justify-center">
                          <Play
                            className="w-6 h-6 text-primary ml-1"
                            fill="currentColor"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 md:p-8">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-white/40 text-sm font-mono mb-4">
                        {project.location}
                      </p>
                      <p className="text-white/50 text-sm leading-relaxed mb-6">
                        {project.description}
                      </p>

                      <div className="flex gap-6 text-sm font-mono">
                        <div>
                          <p className="text-primary font-bold">
                            {project.stats.images}
                          </p>
                          <p className="text-white/30 text-xs">Images</p>
                        </div>
                        <div>
                          <p className="text-primary font-bold">
                            {project.stats.points}
                          </p>
                          <p className="text-white/30 text-xs">Points</p>
                        </div>
                        <div>
                          <p className="text-primary font-bold">
                            {project.stats.accuracy}
                          </p>
                          <p className="text-white/30 text-xs">Accuracy</p>
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 py-16 md:py-24 border-t border-white/5">
        <div className="container max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-sentient mb-4">
              Ready to See Your Project in 3D?
            </h2>
            <p className="text-white/50 font-mono text-sm max-w-xl mx-auto mb-8">
              Contact us today to discuss how our aerial mapping and 3D
              reconstruction services can transform your next project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#contact">
                <Button className="w-full sm:w-auto">Get Started</Button>
              </Link>
              <Link href="/#services">
                <Button className="w-full sm:w-auto bg-transparent border-white/30 hover:bg-white/5">
                  View Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
