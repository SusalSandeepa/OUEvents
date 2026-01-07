import { useState, useEffect } from "react";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if user is near the bottom of the page
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      setIsVisible(isBottom);
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer 
      className={`bg-[var(--color-accent)] text-white/90 transition-all duration-500 ease-in-out transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">


        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">

          {/* Brand */}
          <div>
            <h3 className="mb-2 text-2xl font-bold text-white">
              OUEvents
            </h3>
            <p className="text-sm leading-relaxed text-white/75">
              Seamlessly connecting the OUSL community through organized and collaborative events.
            </p>
          </div>

          {/* Middle Info */}
          <div className="flex flex-col items-center justify-center text-sm text-white/80">
            <p className="opacity-90">"Engage • Participate • Grow"</p>
            <div className="mt-3 h-[1px] w-20 bg-white/25"></div>
            <p className="mt-3">Open University of Sri Lanka</p>
          </div>

          {/* Contact */}
          <div className="space-y-1 text-sm text-white/80 md:text-right">
            <p className="font-semibold text-white">Contact</p>
            <p>Nawala, Nugegoda</p>
            <a
              href="mailto:info@ousl.ac.lk"
              className="transition hover:text-white hover:underline"
            >
              info@ousl.ac.lk
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/15 pt-6 text-center">
          <p className="text-xs tracking-wide text-white/60">
            © 2025 OUEvents — Open University of Sri Lanka
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
