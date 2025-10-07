import CountUp from "./ui/Countup"

export function WhyChoose() {
  const features = [
    {
      stat: 99,
      suffix: "%",
      title: "Accuracy Rate",
      description: "Millimeter-precision mapping and reconstruction with industry-leading accuracy standards.",
    },
    {
      stat: 24,
      suffix: "",
      title: "Support",
      description: "Round-the-clock technical support and project consultation for all your aerial mapping needs.",
    },
    {
      stat: 48,
      suffix: "hr",
      title: "Turnaround",
      description: "Fast project delivery without compromising quality, keeping your projects on schedule.",
    },
  ]

  return (
    <section
      id="features"
      className="py-20 md:py-32 relative bg-gradient-to-b from-muted/20 to-background"
    >
      <div className="container">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-sentient mb-6">Why Choose Kanchan Drones</h2>
          <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance max-w-[700px] mx-auto">
            Industry-leading technology and expertise delivering exceptional results for every project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl sm:text-6xl md:text-7xl font-sentient text-foreground/70 mb-6">
                <CountUp 
                  to={feature.stat} 
                  duration={2}
                  delay={index * 0.1}
                  className="inline"
                />
                {feature.suffix}
              </div>
              <h3 className="text-xl sm:text-2xl font-mono mb-4">{feature.title}</h3>
              <p className="font-mono text-sm text-foreground/60 text-balance">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
