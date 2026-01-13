"use client";

import Image from "next/image";

export function AboutSection() {
  const partnerships = [
    {
      name: "IIT Delhi",
      logo: "/iitd-logo.png",
      description: "Incubated at India's premier technology institute",
    },
    {
      name: "University of Maryland",
      logo: "/umd-logo.png",
      description: "Core team expertise from UMD, USA",
    },
    {
      name: "Boeing",
      logo: "/boieng-logo.png",
      description: "Industry experience from global aerospace leader",
    },
  ];

  return (
    <section
      id="about"
      className="py-20 md:py-32 bg-gradient-to-b from-muted/20 relative z-10"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-7xl relative">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-sentient mb-6">
            About Us
          </h2>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/40 hover:bg-background/70 hover:shadow-[0_20px_60px_rgba(255,199,0,0.1)]">
          <div className="p-8 md:p-12 lg:p-14">
            <div className="relative mb-12">
              <div className="absolute -top-4 -left-4 w-12 h-12 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" />
              <p className="font-mono text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed md:leading-loose ">
                We are a{" "}
                <span className="text-primary font-semibold">
                  deep-tech startup
                </span>{" "}
                from <span className="text-foreground">IIT Delhi</span>,
                with core team from{" "}
                <span className="text-foreground">
                  IIT, UMD (University of Maryland, USA) and Boeing.
                </span>{" "}
                Our focus
                is on advancing the{" "}
                <span className="text-primary font-semibold">
                  state of the art
                </span>{" "}
                in aerial photogrammetry, powered by our proprietary AI-driven
                algorithms. By leveraging cutting-edge artificial intelligence,
                we aim to deliver precise, scalable, and innovative
                geospatial solutions.
              </p>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-r-2 border-b-2 border-primary/30 rounded-br-lg" />
            </div>

            <div className="flex items-center gap-4 mb-12">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
              {/* <span className="font-mono text-xs text-foreground/40 uppercase tracking-widest">
                Our Partners
              </span> */}
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
              {partnerships.map((partner) => (
                <div
                  key={partner.name}
                  className="group/card relative flex flex-col items-center p-6 lg:p-8 rounded-xl bg-background/30 border border-border/40 transition-all duration-300 hover:border-primary/30 hover:bg-background/50 hover:scale-[1.02]"
                >
                  <div className="relative w-28 h-28 lg:w-32 lg:h-32 mb-4 flex items-center justify-center rounded-2xl bg-white border border-border/30 transition-all duration-300 group-hover/card:border-primary/40 group-hover/card:shadow-[0_0_30px_rgba(255,199,0,0.15)]">
                    <Image
                      src={partner.logo}
                      height={100}
                      width={100}
                      alt={`${partner.name} Logo`}
                      className="object-contain w-20 h-20 lg:w-24 lg:h-24 transition-transform duration-300 group-hover/card:scale-105"
                    />
                  </div>

                  <h3 className="font-mono text-sm lg:text-base text-foreground font-medium text-center mb-2 transition-colors duration-300 group-hover/card:text-primary">
                    {partner.name}
                  </h3>

                  {/* <p className="font-mono text-xs text-foreground/50 text-center leading-relaxed">
                    {partner.description}
                  </p> */}

                  <div className="absolute inset-0 -z-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
