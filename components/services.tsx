"use client"

import { useState, useCallback } from "react"

interface ServiceFeature {
  title: string
  icon: string
  description?: string
}

interface Service {
  id: string
  icon: string
  title: string
  description: string
  detailedDescription: string
  features: ServiceFeature[]
  graphic: string
  useCase: string
}

export function Services() {
  const [selectedService, setSelectedService] = useState(0)

  const handleServiceSelect = useCallback((index: number) => {
    setSelectedService(index)
  }, [])

  const services: Service[] = [
    {
      id: "3d-reconstruction",
      icon: "🏗️",
      title: "3D Reconstruction",
      description:
        "We build incredibly detailed 3D models from your aerial imagery. Perfect for keeping track of construction progress, measuring stockpiles, or creating stunning visualizations of your project.",
      detailedDescription: "Our 3D reconstruction service transforms your aerial photos into precise digital twins of real-world structures and terrain.",
      useCase: "Ideal for construction monitoring, stockpile management, and site documentation.",
      features: [
        {
          title: "Sub-centimeter accuracy",
          icon: "📏",
          description: "Measure with confidence down to the millimeter"
        },
        {
          title: "Progress tracking",
          icon: "📊",
          description: "Compare changes over time with automated reporting"
        },
        {
          title: "Volume calculations",
          icon: "📦",
          description: "Accurate stockpile and excavation measurements"
        },
        {
          title: "Interactive models",
          icon: "🎮",
          description: "View and share your 3D models in any web browser"
        }
      ],
      graphic: "🏗️"
    },
    {
      id: "aerial-mapping",
      icon: "🗺️",
      title: "Aerial Mapping",
      description:
        "Get comprehensive maps of your area with our orthomosaic and topographic survey services. We've mapped everything from small construction sites to entire city blocks with incredible detail.",
      detailedDescription: "High-resolution orthomosaic mapping and topographic surveys that give you the complete picture of your project area.",
      useCase: "Perfect for land development, environmental studies, and urban planning projects.",
      features: [
        {
          title: "Large area coverage",
          icon: "🌍",
          description: "Map areas up to 1000+ hectares in a single flight"
        },
        {
          title: "1cm ground resolution",
          icon: "📷",
          description: "See every detail with ultra-high resolution imagery"
        },
        {
          title: "CAD-ready deliverables",
          icon: "📐",
          description: "Get your data in DWG, DXF, or other industry formats"
        },
        {
          title: "Real-time processing",
          icon: "⚡",
          description: "Turnaround times as fast as 24 hours"
        }
      ],
      graphic: "🗺️"
    },
    {
      id: "photogrammetry",
      icon: "📊",
      title: "Photogrammetry",
      description:
        "Extract precise measurements and dimensional data from your aerial photographs. We've helped clients measure everything from building heights to material volumes with incredible accuracy.",
      detailedDescription: "Advanced photogrammetric analysis that turns your aerial images into precise measurement data and 3D point clouds.",
      useCase: "Essential for surveying, engineering, and any project requiring precise measurements.",
      features: [
        {
          title: "Point cloud generation",
          icon: "☁️",
          description: "Dense 3D point clouds with millions of data points"
        },
        {
          title: "Precise measurements",
          icon: "📐",
          description: "Measure distances, areas, and volumes with survey-grade accuracy"
        },
        {
          title: "Digital surface models",
          icon: "🏔️",
          description: "Detailed terrain models for engineering applications"
        },
        {
          title: "Multi-temporal analysis",
          icon: "📅",
          description: "Track changes and deformation over time"
        }
      ],
      graphic: "📊"
    },
    {
      id: "data-analysis",
      icon: "📈",
      title: "Data Analysis",
      description:
        "We don't just collect data – we make it meaningful. Our analysis services turn your aerial data into actionable insights that help you make better decisions faster.",
      detailedDescription: "Transform raw aerial data into clear, actionable insights with comprehensive analysis and professional reporting.",
      useCase: "Critical for project management, compliance reporting, and strategic decision-making.",
      features: [
        {
          title: "Custom analytics",
          icon: "🔍",
          description: "Tailored analysis for your specific project needs"
        },
        {
          title: "Automated reporting",
          icon: "📋",
          description: "Generate professional reports automatically"
        },
        {
          title: "Trend analysis",
          icon: "📈",
          description: "Identify patterns and predict future changes"
        },
        {
          title: "GIS integration",
          icon: "🗂️",
          description: "Seamlessly integrate with your existing GIS workflows"
        }
      ],
      graphic: "📈"
    },
  ]

  const currentService = services[selectedService]

  return (
    <section id="services" className="py-20 md:py-32 relative bg-background">
      <div className="container max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Service Cards Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {services.map((service, index) => (
              <button
                key={service.id}
                onClick={() => handleServiceSelect(index)}
                className={`text-left cursor-pointer bg-background/40 backdrop-blur-sm border p-6 lg:p-8 rounded-2xl transition-all duration-500 group focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background ${
                  selectedService === index
                    ? "border-primary/50 bg-background/60 shadow-[0_0_30px_rgba(255,199,0,0.2)]"
                    : "border-border/50 hover:border-primary/30 hover:bg-background/60 hover:shadow-[0_0_30px_rgba(255,199,0,0.1)]"
                }`}
                aria-pressed={selectedService === index}
                aria-describedby={`service-${service.id}-description`}
              >
                <div className="text-3xl lg:text-4xl mb-4 transition-transform duration-300 group-hover:scale-110 group-focus:scale-110">
                  {service.icon}
                </div>
                <h3 className={`text-xl lg:text-2xl font-mono mb-3 transition-colors duration-300 ${
                  selectedService === index ? "text-primary" : "group-hover:text-primary/90"
                }`}>
                  {service.title}
                </h3>
                <p 
                  id={`service-${service.id}-description`}
                  className="font-mono text-xs lg:text-sm text-foreground/60 leading-relaxed transition-colors duration-300 group-hover:text-foreground/80"
                >
                  {service.description}
                </p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-1">
            <article className="bg-background/40 backdrop-blur-sm border border-border/50 p-6 lg:p-8 rounded-2xl h-full">
              <div className="flex flex-col h-full">
                <header className="mb-4">
                  <h2 className="text-2xl lg:text-3xl font-mono mb-2 text-primary">
                    {currentService.title}
                  </h2>
                  <p className="font-mono text-sm lg:text-base text-foreground/80 leading-relaxed mb-3">
                    {currentService.detailedDescription}
                  </p>
                  <p className="font-mono text-xs text-foreground/60 italic">
                    {currentService.useCase}
                  </p>
                </header>

                <div className="flex-1 flex items-center justify-center mb-6 min-h-[120px]">
                  <div 
                    className="text-6xl lg:text-8xl opacity-60 transition-all duration-500 hover:opacity-80 hover:scale-110"
                    role="img"
                    aria-label={`${currentService.title} service illustration`}
                  >
                    {currentService.graphic}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-mono text-sm font-semibold text-foreground/90 uppercase tracking-wide">
                    Key Features
                  </h3>
                  <ul className="space-y-3">
                    {currentService.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div 
                          className="text-lg opacity-70 mt-0.5 flex-shrink-0"
                          role="img"
                          aria-label={`${feature.title} icon`}
                        >
                          {feature.icon}
                        </div>
                        <div>
                          <span className="font-mono text-sm lg:text-base text-foreground/80 font-medium">
                            {feature.title}
                          </span>
                          {feature.description && (
                            <p className="font-mono text-xs text-foreground/60 mt-1 leading-relaxed">
                              {feature.description}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
