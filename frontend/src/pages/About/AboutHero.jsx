/**
 * AboutHero.jsx
 * Hero section with dark gradient background
 * Displays main headline and subtitle
 */

const AboutHero = () => {
  return (
    <section
      className="
        /* Dark gradient background */
        bg-gradient-to-br from-[var(--color-secondary)] to-[#1a232c]
        
        /* Text styling */
        text-white
        
        /* Padding - responsive */
        py-8 md:py-12
        px-4 md:px-6
      "
    >
      {/* Centered content container */}
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Headline */}
        <h1
          className="
            /* Font size - responsive */
            text-2xl sm:text-3xl md:text-4xl lg:text-5xl
            
            /* Font weight */
            font-extrabold
            
            /* Bottom margin */
            mb-4 md:mb-6
          "
        >
          Bridging the Gap in{" "}
          {/* Accent colored word */}
          <span className="text-[var(--color-accent)]">Campus Connectivity</span>
        </h1>

        {/* Subtitle */}
        <p
          className="
            /* Font size - responsive */
            text-base md:text-lg
            
            /* Muted color */
            text-gray-300
            
            /* Line height for readability */
            leading-relaxed
          "
        >
          Discover how OUEvents is transforming the way university communities
          interact, organize, and experience academic life.
        </p>
      </div>
    </section>
  );
};

export default AboutHero;