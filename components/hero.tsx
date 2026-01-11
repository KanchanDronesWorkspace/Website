// "use client";

// import Link from "next/link";
// import { GL } from "@/components/gl";
// import { Button } from "./ui/button";
// import { useState } from "react";

// export function Hero() {
//   const [hovering, setHovering] = useState(false);

//   return (
//     <div id="home" className="flex flex-col h-svh justify-between">
//       {/* <GL hovering={hovering} /> */}
//       <div className="pb-16 mt-auto text-center relative z-10 bg-gradient-to-b from-muted">
//         <h1 className="text-5xl sm:text-6xl md:text-7xl font-sentient">
//           Spatial Intelligence <br />
//           <i className="font-light">Redefined</i>
//         </h1>
//         <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance mt-4 max-w-[700px] mx-auto">
//           Transform pixels into survey-grade spatial 3D models with AI insights.
//         </p>

//         <div
//           className="inline-block max-sm:hidden"
//           onMouseEnter={() => setHovering(true)}
//           onMouseLeave={() => setHovering(false)}
//         >
//           <Link href="/#contact">
//             <Button className="mt-14">Request Demo</Button>
//           </Link>
//         </div>

//         <div
//           className="inline-block sm:hidden"
//           onMouseEnter={() => setHovering(true)}
//           onMouseLeave={() => setHovering(false)}
//         >
//           <Link href="/#contact">
//             <Button size="sm" className="mt-14">
//               Request Demo
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }





"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { useState } from "react";

export function Hero() {
  const [hovering, setHovering] = useState(false);
  
  return (
    <div id="home" className="flex flex-col h-svh justify-between relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/assets/templesplat.mp4" type="video/mp4" />
          <source src="/assets/templesplat.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Optional: Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="pb-16 mt-auto text-center relative z-10 bg-gradient-to-b from-muted/80 to-transparent">
        <h1 className="text-7xl sm:text-6xl md:text-7xl font-sentient text-white">
          Spatial Intelligence <br />
          <i className="font-sentient not-italic">Redefined</i>
        </h1>
        <p className="font-mono text-sm sm:text-base text-white/80 text-balance mt-4 max-w-[700px] mx-auto">
          Transform pixels into survey-grade spatial 3D models with AI insights.
        </p>
        <div
          className="inline-block max-sm:hidden"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <Link href="/#contact">
            <Button className="mt-14">Request Demo</Button>
          </Link>
        </div>
        <div
          className="inline-block sm:hidden"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <Link href="/#contact">
            <Button size="sm" className="mt-14">
              Request Demo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}