/**
 * About.jsx
 * Main container component for the About page
 * Assembles all sub-components in order
 */

import AboutHero from "./AboutHero";
import Introduction from "./Introduction";
import VisionPurpose from "./VisionPurpose";
import TargetUsersFeatures from "./TargetUsersFeatures";
import TechStack from "./TechStack";
import ProjectTeam from "./ProjectTeam";
import FutureEnhancements from "./FutureEnhancements";

const About = () => {
  return (
    <div className="bg-[var(--color-primary)] text-gray-800 antialiased">
      {/* Hero Section - Dark gradient with main headline */}
      <AboutHero />

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 py-4 space-y-8">
        {/* Project Introduction with 3D image */}
        <Introduction />

        {/* Vision & Purpose - Dark card section */}
        <VisionPurpose />

        {/* Target Users & Key Features - Two column cards */}
        <TargetUsersFeatures />

        {/* Technology Stack - Icon display */}
        <TechStack />

        {/* Project Team Members */}
        <ProjectTeam />

        {/* Future Enhancements - Accent colored section */}
        <FutureEnhancements />
      </main>
    </div>
  );
};

export default About;