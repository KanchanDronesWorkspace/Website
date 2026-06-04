"use client";

import { useScrollReveal, useStaggerReveal } from "@/hooks/use-scroll-reveal";

interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export function Services() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal(0.1);
  const { containerRef, visibleItems } = useStaggerReveal(6, 0.05, 120);

  const services: Service[] = [
    {
      id: "aerial-mapping",
      icon: "",
      title: "Aerial Mapping",
      description: "Transform your aerial imagery into actionable 3D maps.",
    },
    {
      id: "construction-management",
      icon: "",
      title: "Construction Management",
      description:
        "Automate your construction site monitoring with volumetric analysis.",
    },
    {
      id: "land-surveys-inspection",
      icon: "",
      title: "Land Surveys & Inspection",
      description: "Surveying and inspection services for land and sites.",
    },
    {
      id: "real-estate-tours",
      icon: "",
      title: "Real Estate Tours",
      description: "3D tours and visuals for real estate.",
    },
    {
      id: "forensics-public-safety",
      icon: "",
      title: "Forensics & Safety",
      description: "Services supporting forensics and public safety.",
    },
    {
      id: "professional-consulting",
      icon: "",
      title: "Consulting",
      description: "Flexible consulting tailored to your problem.",
    },
  ];

  return (
    <section id="services" className="py-16 md:py-24 relative">
      <div className="container max-w-7xl relative z-10">
        <div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-20"
          ref={headerRef}
        >
          <div>
            <span
              className="editorial-number block mb-4"
              style={{
                opacity: headerVisible ? 1 : 0,
                transform: headerVisible ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              03 — SOLUTIONS
            </span>
            <h2
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-editorial uppercase tracking-tight leading-[0.9]"
              style={{
                opacity: headerVisible ? 1 : 0,
                transform: headerVisible ? "translateY(0)" : "translateY(40px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
              }}
            >
              OUR
              <br />
              <em className="italic text-primary">SOLUTION</em>
            </h2>
          </div>
          <p
            className="font-mono text-xs text-white/40 uppercase tracking-widest max-w-xs md:text-right leading-relaxed"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
            }}
          >
            End-to-end spatial intelligence across industries
          </p>
        </div>

        <div
          className="h-px bg-white/10 mb-12 md:mb-16"
          style={{
            transform: headerVisible ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          }}
        />

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-white/10"
          ref={containerRef}
        >
          {services.map((service, index) => (
            <article
              key={service.id}
              className={`group relative p-8 sm:p-10 lg:p-14 glass-card glass-card-hover
                ${index < 3 ? "lg:border-b border-white/10" : ""}
                ${index < 4 ? "sm:max-lg:border-b border-white/10" : ""}
                ${index < 5 ? "max-sm:border-b border-white/10" : ""}
                ${index % 3 !== 2 ? "lg:border-r border-white/10" : ""}
                ${index % 2 === 0 ? "sm:max-lg:border-r border-white/10" : ""}
              `}
              style={{
                opacity: visibleItems[index] ? 1 : 0,
                transform: visibleItems[index]
                  ? "translateY(0)"
                  : "translateY(30px)",
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <span className="font-mono text-xs text-white/20 uppercase tracking-widest block mb-8">
                0{index + 1}
              </span>

              <h3 className="text-xl lg:text-2xl font-editorial uppercase tracking-tight text-white group-hover:text-primary transition-colors duration-300 mb-4">
                {service.title}
              </h3>
              <p className="font-mono text-sm text-white/50 leading-relaxed">
                {service.description}
              </p>

              <div className="mt-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                <span className="font-mono text-sm text-primary tracking-widest">
                  →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
