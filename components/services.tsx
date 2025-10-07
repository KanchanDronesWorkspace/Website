export function Services() {
  const services = [
    {
      icon: "📐",
      title: "3D Reconstruction",
      description:
        "Create detailed 3D models from aerial imagery with millimeter precision. Perfect for construction monitoring, progress tracking, and site analysis.",
    },
    {
      icon: "🗺️",
      title: "Aerial Mapping",
      description:
        "Comprehensive topographic surveys and orthomosaic mapping for land development, urban planning, and environmental monitoring.",
    },
    {
      icon: "📊",
      title: "Photogrammetry",
      description:
        "Advanced photogrammetric processing to extract precise measurements, volumes, and dimensional data from aerial photographs.",
    },
    {
      icon: "📈",
      title: "Data Analysis",
      description:
        "Transform raw aerial data into actionable insights with our comprehensive analysis and reporting services.",
    },
  ]

  return (
    <section id="services" className="py-20 md:py-32 relative bg-background">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-background/40 backdrop-blur-sm border border-border/50 p-8 md:p-10 rounded-2xl hover:border-primary/30 hover:bg-background/60 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,199,0,0.1)] group"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-mono mb-4 group-hover:text-primary/90 transition-colors duration-300">{service.title}</h3>
              <p className="font-mono text-sm text-foreground/60 leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
