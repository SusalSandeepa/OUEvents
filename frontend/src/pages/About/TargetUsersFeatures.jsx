/**
 * TargetUsersFeatures.jsx
 * Two-column layout showing Target Users and Key Features
 * Responsive: stacks vertically on mobile
 */
import {
  FaGraduationCap,
  FaCalendarPlus,
  FaUserShield,
  FaLayerGroup,
  FaCheckCircle
} from 'react-icons/fa';
import { FaUsersViewfinder } from 'react-icons/fa6';

const TargetUsersFeatures = () => {
  /* ===== DATA ===== */

  // Target users data array
  const targetUsers = [
    {
      icon: <FaGraduationCap />,
      title: "Students",
      description: "Discovering and registering for meaningful events.",
    },
    {
      icon: <FaCalendarPlus />,
      title: "Event Organizers",
      description: "Effortless management and promotion tools.",
    },
    {
      icon: <FaUserShield />,
      title: "Administrators",
      description: "Overseeing activity to ensure smooth operation.",
    },
  ];

  // Key features data array
  const keyFeatures = [
    "Manage University Events",
    "Online Registration",
    "Real-time Countdown",
    "Role-based Access Control",
    "Real-time Notifications",
    "Feedback & Ratings",
  ];

  /* ===== RENDER ===== */

  return (
    <div
      className="
        /* Two column grid on medium+ screens */
        grid md:grid-cols-2
        
        /* Gap between cards */
        gap-8 md:gap-12
      "
    >
      {/* ===== TARGET USERS CARD ===== */}
      <div
        className="
          bg-white
          p-6 md:p-8
          rounded-2xl
          shadow-sm
          border border-gray-100
        "
      >
        {/* Card Heading */}
        <h3
          className="
            text-xl md:text-2xl
            font-bold
            text-[var(--color-secondary)]
            mb-4 md:mb-6
            flex items-center gap-3
          "
        >
          {/* Icon */}
          <span className="text-[var(--color-accent)]">
            <FaUsersViewfinder />
          </span>
          Target Users
        </h3>

        {/* Users List */}
        <ul className="space-y-4">
          {targetUsers.map((user, index) => (
            <li key={index} className="flex items-start gap-4">
              {/* Icon Container */}
              <div
                className="
                  mt-1
                  bg-red-50
                  text-[var(--color-accent)]
                  p-1.5
                  rounded-full
                  text-xs
                "
              >
                {user.icon}
              </div>

              {/* Text Content */}
              <div>
                <span className="font-bold text-[var(--color-secondary)]">
                  {user.title}
                </span>
                <p className="text-sm text-gray-500 italic">
                  {user.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ===== KEY FEATURES CARD ===== */}
      <div
        className="
          bg-white
          p-6 md:p-8
          rounded-2xl
          shadow-sm
          border border-gray-100
        "
      >
        {/* Card Heading */}
        <h3
          className="
            text-xl md:text-2xl
            font-bold
            text-[var(--color-secondary)]
            mb-4 md:mb-6
            flex items-center gap-3
          "
        >
          {/* Icon */}
          <span className="text-[var(--color-accent)]">
            <FaLayerGroup />
          </span>
          Key Features
        </h3>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {keyFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-gray-600"
            >
              {/* Checkmark Icon */}
              <span className="text-[var(--color-accent)]">
                <FaCheckCircle />
              </span>
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TargetUsersFeatures;