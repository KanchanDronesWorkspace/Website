"use client";

import {} from "react";

interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  detailedDescription: string;
  graphic: string;
  useCase: string;
}

export function Services() {
  const services: Service[] = [
    {
      id: "aerial-mapping",
      icon: "🗺️",
      title: "Aerial Mapping",
      description: "High-resolution aerial mapping services.",
      detailedDescription: "Aerial Mapping",
      useCase: "",
      graphic: "🗺️",
    },
    {
      id: "construction-management",
      icon: "🏗️",
      title: "Construction Management",
      description: "Support for construction planning and oversight.",
      detailedDescription: "Construction Management",
      useCase: "",
      graphic: "🏗️",
    },
    {
      id: "land-surveys-inspection",
      icon: "📐",
      title: "Land Surveys and Inspection",
      description: "Surveying and inspection services for land and sites.",
      detailedDescription: "Land Surveys and Inspection",
      useCase: "",
      graphic: "🧭",
    },
    {
      id: "real-estate-tours",
      icon: "🏠",
      title: "Real Estate Tours and guide",
      description: "Guided tours and visuals for real estate.",
      detailedDescription: "Real Estate Tours and guide",
      useCase: "",
      graphic: "🏠",
    },
    {
      id: "forensics-public-safety",
      icon: "🛡️",
      title: "Forensics and Public safety",
      description: "Services supporting forensics and public safety.",
      detailedDescription: "Forensics and Public safety",
      useCase: "",
      graphic: "🛡️",
    },
    {
      id: "professional-consulting",
      icon: "💼",
      title: "Professional Consulting - Whatever you need!",
      description: "Flexible consulting tailored to your needs.",
      detailedDescription: "Professional Consulting - Whatever you need!",
      useCase: "",
      graphic: "💼",
    },
  ];

  return (
    <section id="services" className="py-20 md:py-32 relative bg-background">
      <div className="container max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
          {services.map((service) => (
            <article
              key={service.id}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-background/70 hover:shadow-[0_10px_40px_rgba(255,199,0,0.08)]"
            >
              <div className="p-6 lg:p-7">
                <div className="flex items-center justify-between"></div>
                <h3 className="mt-4 text-xl lg:text-2xl font-mono text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="mt-2 font-mono text-xs lg:text-sm text-foreground/70 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-primary/10 blur-2xl" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
