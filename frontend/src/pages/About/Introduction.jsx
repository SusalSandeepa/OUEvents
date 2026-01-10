/**
 * Introduction.jsx
 * Project introduction section
 * Features floating 3D students image (no container/frame)
 */

import aboutImg from "../../assets/aboutImage.png";

const Introduction = () => {
  return (
    <section
      className="
        /* Two column grid on medium+ screens */
        grid md:grid-cols-2
        
        /* Compact gap between columns */
        gap-4 md:gap-8
        
        /* Vertical alignment */
        items-center
      "
    >
      {/* 
        3D Image Container
        - Order changes on mobile (image on top)
        - No background, border, shadow, or frame
      */}
      <div
        className="
          /* Order: first on mobile, second on desktop */
          order-1 md:order-2
          
          /* Center content */
          flex justify-center items-center
          
          /* Stacking & Visibility */
          isolate
          relative
          overflow-visible
          
          /* Balanced vertical space - top padding for mobile, tight for desktop */
          pt-12 md:pt-0
          pb-0
          px-4
        "
      >
        {/* Creative Layered Background */}
        <div className="absolute inset-0 flex justify-center items-center -z-10 pointer-events-none">
          {/* Main Organic Shape (Primary Glow) */}
          <div
            className="
              absolute 
              w-full h-full 
              max-w-[320px] max-h-[320px] 
              bg-[radial-gradient(circle,var(--color-accent)_0%,transparent_70%)] 
              opacity-[0.15] 
              blur-[60px] 
              animate-organic-pulse
            "
          />

          {/* Creative SVG Mesh/Blob */}
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="
              absolute 
              w-full h-full 
              max-w-[300px] 
              opacity-[0.25] 
              animate-organic-pulse 
              delay-[2000ms]
              scale-90 md:scale-105
            "
          >
            <path
              fill="var(--color-accent)"
              d="M38.1,-65.4C49.1,-58.5,57.6,-47.9,64.2,-36.3C70.8,-24.8,75.4,-12.4,76.5,0.6C77.5,13.6,74.9,27.1,68.2,38.6C61.5,50,50.7,59.3,38.2,65.8C25.7,72.3,12.8,75.9,-0.6,76.9C-14,78,-27.9,76.5,-40.1,70.5C-52.3,64.5,-62.7,54,-69.5,41.4C-76.3,28.8,-79.5,14.4,-78.9,0.4C-78.2,-13.6,-73.7,-27.2,-65.8,-38.7C-57.9,-50.2,-46.6,-59.5,-34.5,-65.8C-22.3,-72,-11.2,-75.2,0.5,-76.1C12.1,-77,24.2,-75.5,38.1,-65.4Z"
              transform="translate(100 100)"
            />
          </svg>

          {/* Contrast Aura (Darker center for visibility) */}
          <div
            className="
              absolute 
              w-56 h-56 
              bg-[var(--color-secondary)] 
              opacity-[0.3] 
              blur-[80px] 
              rounded-full
            "
          />
        </div>

        {/* Floating Illustration & Dynamic Shadow */}
        <div className="flex flex-col items-center animate-ultimate-entrance">
          {/* Image Container with Floating Anim */}
          <div className="animate-high-end-float relative z-10">
            <img
              src={aboutImg}
              alt="Discover OUEvents"
              className="
                /* Responsive sizing - expanded for better mobile visibility */
                w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg
                h-auto
                
                /* Depth & Separation */
                drop-shadow-[0_20px_40px_rgba(47,62,78,0.25)]
                
                /* Interaction */
                cursor-default
              "
            />
          </div>

          {/* 
            Synchronized Contact Shadow 
            - Naturally tied to the floating physics
          */}
          <div
            className="
              w-40 h-5 
              bg-[var(--color-secondary)] 
              rounded-[100%] 
              mt-4
              animate-high-end-shadow
            "
          />
        </div>
      </div>

      {/* Text Content */}
      <div className="order-2 md:order-1 text-center md:text-left">
        {/* Section Label */}
        <span
          className="
            text-[var(--color-accent)]
            font-bold
            tracking-widest
            uppercase
            text-sm
          "
        >
          Introduction
        </span>

        {/* Section Heading */}
        <h2
          className="
            text-2xl md:text-3xl
            font-bold
            text-[var(--color-secondary)]
            mt-2
            mb-4 md:mb-6
          "
        >
          What is OUEvents?
        </h2>

        {/* Description Paragraph */}
        <p
          className="
            text-gray-600
            leading-relaxed
            text-base md:text-lg
          "
        >
          OUEvents is a web-based event management system designed to help
          university students and staff easily discover, organize, and manage
          academic and social events. The platform provides a centralized space
          for publishing events, registering participants, and managing
          event-related activities.
        </p>
      </div>
    </section>
  );
};

export default Introduction;