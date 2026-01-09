/**
 * TechStack.jsx
 * Technology stack display with hover effects
 * Shows React, Node.js, Express, MongoDB
 */
import { FaReact, FaNodeJs, FaServer, FaDatabase } from 'react-icons/fa';

const TechStack = () => {
  // Technology stack data
  const technologies = [
    {
      name: "React",
      label: "Frontend",
      icon: <FaReact />,
      color: "text-[#61DAFB]",
    },
    {
      name: "Node.js",
      label: "Backend",
      icon: <FaNodeJs />,
      color: "text-[#339933]",
    },
    {
      name: "Express",
      label: "Framework",
      icon: <FaServer />,
      color: "text-gray-700",
    },
    {
      name: "MongoDB",
      label: "Storage",
      icon: <FaDatabase />,
      color: "text-[#47A248]",
    },
  ];

  return (
    <section className="text-center">
      {/* Section Heading */}
      <h2
        className="
          text-2xl md:text-3xl
          font-bold
          text-[var(--color-secondary)]
          mb-8 md:mb-12
        "
      >
        Our Technology Stack
      </h2>

      {/* Technologies Container */}
      <div
        className="
          /* Flex layout with wrapping */
          flex flex-wrap
          
          /* Center items */
          justify-center
          
          /* Gap between items - responsive */
          gap-6 sm:gap-8 md:gap-16
        "
      >
        {technologies.map((tech, index) => (
          <div
            key={index}
            className="
              flex flex-col items-center
              
              /* Group for hover effects */
              group
            "
          >
            {/* Icon Container */}
            <div
              className="
                /* Size */
                w-16 h-16 sm:w-20 sm:h-20
                
                /* White background with shadow */
                bg-white
                rounded-2xl
                shadow-md
                
                /* Center icon */
                flex items-center justify-center
                
                /* Bottom margin */
                mb-3
                
                /* Hover: lift up effect */
                group-hover:-translate-y-2
                transition-transform duration-300
              "
            >
              {/* Technology Icon */}
              <div
                className={`
                  text-3xl sm:text-4xl
                  ${tech.color}
                `}
              >
                {tech.icon}
              </div>
            </div>

            {/* Technology Name */}
            <span className="font-bold text-[var(--color-secondary)]">
              {tech.name}
            </span>

            {/* Technology Label */}
            <span className="text-xs text-gray-400">{tech.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechStack;