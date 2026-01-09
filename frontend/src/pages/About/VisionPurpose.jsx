/**
 * VisionPurpose.jsx
 * Vision & Purpose section
 * Dark themed card with clean design (no decorative icons)
 */

const VisionPurpose = () => {
  return (
    <section
      className="
        /* Dark background */
        bg-[var(--color-secondary)]
        
        /* White text */
        text-white
        
        /* Rounded corners */
        rounded-2xl md:rounded-3xl
        
        /* Padding - responsive */
        p-6 md:p-8 lg:p-12
        
        /* Shadow for depth */
        shadow-2xl
      "
    >
      {/* Content container - limits text width for readability */}
      <div className="max-w-2xl mx-auto text-center">
        {/* Section Heading */}
        <h2
          className="
            text-2xl md:text-3xl
            font-bold
            mb-4 md:mb-6
          "
        >
          Vision & Purpose
        </h2>

        {/* Description */}
        <p
          className="
            /* Muted white color */
            text-gray-300
            
            /* Font size - responsive */
            text-base md:text-lg
            
            /* Line height for readability */
            leading-relaxed
          "
        >
          The purpose of OUEvents is to replace manual and scattered event
          announcements with a unified digital platform that improves
          communication, participation, and event organization within the
          university community. We aim to foster a vibrant campus culture where
          no opportunity is missed.
        </p>
      </div>
    </section>
  );
};

export default VisionPurpose;