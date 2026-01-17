/**
 * ProjectTeam.jsx
 * Team members display with social links
 * Responsive grid: 1 col mobile, 3 cols desktop
 */
import { FaGithub, FaLinkedin } from "react-icons/fa";

const ProjectTeam = () => {
  // Team members data
  const teamMembers = [
    {
      initials: "KS",
      name: "K.W.S. Sandeepa",
      role: "Backend / Frontend",
      github: "https://github.com/SusalSandeepa",
      linkedin: "https://www.linkedin.com/in/susal-sandeepa-185114198/",
    },
    {
      initials: "HD",
      name: "H.M.K. Dilhara",
      role: "Frontend & UI/UX Design",
      github: "https://github.com/kavindidilhara",
      linkedin: "https://www.linkedin.com/in/kavidilhara/",
    },
    {
      initials: "RD",
      name: "R.A.S. Dilshan",
      role: "Frontend / Testing",
      github: "https://github.com/SudaraDilshan",
      linkedin: "https://www.linkedin.com/in/sudara-dilshan-0375823a4/",
    },
  ];

  return (
    <section className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl md:rounded-3xl md:p-10">
      {/* ===== SECTION HEADER ===== */}
      <div className="mb-8 text-center md:mb-12">
        {/* Label */}
        <span
          className="
            text-[var(--color-accent)]
            font-bold
            uppercase
            text-sm
          "
        >
          The Creators
        </span>

        {/* Heading */}
        <h2
          className="
            text-2xl md:text-3xl
            font-bold
            text-[var(--color-secondary)]
            mt-2
          "
        >
          Project Team: Group JK2
        </h2>

        {/* Subtitle */}
        <p className="mt-2 text-sm text-gray-500 md:text-base">
          Developed as part of EEY4189 - Software Design in Group(2025) Course
        </p>
      </div>

      {/* ===== TEAM MEMBERS GRID ===== */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="
              /* Center content */
              text-center
              
              /* Padding */
              p-6
              
              /* Rounded corners */
              rounded-2xl
              
              /* Background with hover effect */
              bg-black/5
              hover:bg-[var(--color-accent)]/10
              active:bg-[var(--color-accent)]/20
              
              /* Smooth transition */
              transition-colors duration-200
              
              /* Group for nested hover effects */
              group
            "
          >
            {/* Avatar Circle */}
            <div
              className="
                /* Size */
                w-20 h-20 md:w-24 md:h-24
                
                /* Center horizontally */
                mx-auto
                
                /* Circle shape */
                rounded-full
                
                /* Background - changes on hover */
                bg-[var(--color-secondary)]
                group-hover:bg-[var(--color-accent)]
                
                /* Center initials */
                flex items-center justify-center
                
                /* Bottom margin */
                mb-4
                
                /* Text styling */
                text-white
                text-xl md:text-2xl
                font-bold
                
                /* Smooth transition */
                transition-colors duration-200
              "
            >
              {member.initials}
            </div>

            {/* Member Name */}
            <h4
              className="
                font-bold
                text-[var(--color-accent)]/90
                text-base md:text-lg
              "
            >
              {member.name}
            </h4>

            {/* Member Role */}
            <p
              className="
                text-[var(--color-accent)]/70
                font-medium
                text-sm
              "
            >
              {member.role}
            </p>

            {/* Social Links */}
            <div className="flex justify-center gap-4 mt-4 md:gap-6">
              {/* GitHub Link */}
              <a
                href={member.github}
                className="
                  flex items-center gap-2
                  text-black
                  text-base md:text-lg
                  cursor-pointer
                  transition-colors
                  hover:text-[var(--color-accent)]
                  active:text-[var(--color-accent)]
                "
              >
                <FaGithub className="text-xl md:text-2xl" />
                <span className="text-sm font-medium">GitHub</span>
              </a>

              {/* LinkedIn Link */}
              <a
                href={member.linkedin}
                className="
                  flex items-center gap-2
                  text-black
                  text-base md:text-lg
                  cursor-pointer
                  transition-colors
                  hover:text-[var(--color-accent)]
                  active:text-[var(--color-accent)]
                "
              >
                <FaLinkedin className="text-xl md:text-2xl" />
                <span className="text-sm font-medium">LinkedIn</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectTeam;
