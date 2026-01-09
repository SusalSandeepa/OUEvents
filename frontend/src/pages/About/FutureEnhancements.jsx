/**
 * FutureEnhancements.jsx
 * Future enhancements section with accent background
 * Shows upcoming features in a grid
 */
import { FaQrcode, FaChartPie } from 'react-icons/fa';
import { FaEnvelopeCircleCheck } from 'react-icons/fa6';

const FutureEnhancements = () => {
  // Future features data
  const futureFeatures = [
    {
      icon: <FaQrcode />,
      label: "Attendance Tracking",
    },
    {
      icon: <FaEnvelopeCircleCheck />,
      label: "Automated Email Reminders",
    },
    {
      icon: <FaChartPie />,
      label: "Advanced Analytics",
    },
  ];

  return (
    <section className="max-w-3xl mx-auto text-center py-8 md:py-12">
      {/* Section Title - Italic quote style */}
      <h2
        className="
          text-xl md:text-2xl
          font-bold
          text-[var(--color-secondary)]
          mb-4 md:mb-6
          italic
        "
      >
        "Thinking Forward"
      </h2>

      {/* Accent Colored Card */}
      <div
        className="
          bg-[var(--color-accent)]
          text-white
          p-6 md:p-8
          rounded-2xl
          shadow-lg
        "
      >
        {/* Card Heading */}
        <p
          className="
            font-semibold
            mb-4
            text-base md:text-lg
            underline underline-offset-8
          "
        >
          Future Enhancements
        </p>

        {/* Features Grid */}
        <div
          className="
            grid
            grid-cols-1 sm:grid-cols-3
            gap-4 md:gap-6
            text-sm
          "
        >
          {futureFeatures.map((feature, index) => (
            <div
              key={index}
              className="
                /* Semi-transparent background */
                bg-white/10
                
                /* Padding */
                p-4
                
                /* Rounded corners */
                rounded-xl
              "
            >
              {/* Feature Icon */}
              <div
                className={`
                  mb-2
                  text-lg md:text-xl
                  flex justify-center
                `}
              >
                {feature.icon}
              </div>

              {/* Feature Label */}
              <p>{feature.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FutureEnhancements;