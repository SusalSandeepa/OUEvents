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
        
        /* Gap between columns */
        gap-8 md:gap-12
        
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
          
          /* Center image on mobile */
          flex justify-center
        "
      >
        {/* 
          Floating 3D Image 
          - No container/wrapper styling
          - Transparent background preserved
          - Just the raw image
        */}
        <img
          src={aboutImg}
          alt="Students illustration"
          className="
            /* Responsive sizing */
            w-full max-w-sm md:max-w-md lg:max-w-lg
            
            /* Maintain aspect ratio */
            h-auto
            
            /* No additional styling - keeps 3D floating effect */
          "
        />
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