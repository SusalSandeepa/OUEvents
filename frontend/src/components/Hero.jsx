const Hero = () => {
  return (
    <section className="w-full">
      {/* HERO TOP (2-column only) */}
      <div className="grid items-center grid-cols-1 gap-12 px-8 my-12 md:grid-cols-2">
        {/* Text */}
        <div>
          <h1 className="text-4xl font-extrabold leading-tight lg:text-5xl text-[#2f3e4e]">
            Discover & Join <span className="text-[#7a1d1a]">OUSL Events</span>
          </h1>

          <p className="mt-4 text-lg text-text-dark/80">
            Your central hub for all workshops, seminars, and activities
            happening at the Open University of Sri Lanka.
          </p>

          <a
            href="/events"
            className="inline-flex items-center px-6 py-3 mt-8 font-medium text-white transition-all rounded-lg shadow-md bg-[#7a1d1a] hover:bg-secondary/90"
          >
            Browse Events →
          </a>
        </div>

        {/* Image */}
        <div className="items-center justify-center hidden bg-white border-2 border-gray-300 border-dashed rounded-lg md:flex h-96">
          <p className="text-gray-500">[Hero Image Placeholder]</p>
        </div>
      </div>

      {/* UPCOMING EVENTS*/}
      <div className="w-full px-8 mt-20 mb-25">
        <h2 className="mb-10 text-3xl font-bold text-text-dark">
          Upcoming Events
        </h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Event Card */}
          <div className="overflow-hidden transition-transform duration-300 border border-gray-200 shadow-lg bg-bg-white rounded-xl hover:scale-105">
            <div className="flex items-center justify-center h-56 bg-gray-100">
              <i data-lucide="ticket" className="text-gray-400 h-14 w-14"></i>
            </div>
            <div className="p-6">
              <h3 className="mb-3 text-xl font-semibold text-text-dark">
                Tech Meetup 2025
              </h3>
              <div className="flex items-center mb-1 text-sm text-text-dark/70">
                <i data-lucide="calendar" className="w-4 h-4 mr-2" />
                Dec 05, 2025
              </div>
              <div className="flex items-center text-sm text-text-dark/70">
                <i data-lucide="map-pin" className="w-4 h-4 mr-2" />
                Main Auditorium
              </div>
            </div>
          </div>

          {/* Event Card */}
          <div className="overflow-hidden transition-transform duration-300 border border-gray-200 shadow-lg bg-bg-white rounded-xl hover:scale-105">
            <div className="flex items-center justify-center h-56 bg-gray-100">
              <i data-lucide="ticket" className="text-gray-400 h-14 w-14"></i>
            </div>
            <div className="p-6">
              <h3 className="mb-3 text-xl font-semibold text-text-dark">
                Tech Meetup 2025
              </h3>
              <div className="flex items-center mb-1 text-sm text-text-dark/70">
                <i data-lucide="calendar" className="w-4 h-4 mr-2" />
                Dec 05, 2025
              </div>
              <div className="flex items-center text-sm text-text-dark/70">
                <i data-lucide="map-pin" className="w-4 h-4 mr-2" />
                Main Auditorium
              </div>
            </div>
          </div>

          {/* Event Card */}
          <div className="overflow-hidden transition-transform duration-300 border border-gray-200 shadow-lg bg-bg-white rounded-xl hover:scale-105">
            <div className="flex items-center justify-center h-56 bg-gray-100">
              <i data-lucide="ticket" className="text-gray-400 h-14 w-14"></i>
            </div>
            <div className="p-6">
              <h3 className="mb-3 text-xl font-semibold text-text-dark">
                Tech Meetup 2025
              </h3>
              <div className="flex items-center mb-1 text-sm text-text-dark/70">
                <i data-lucide="calendar" className="w-4 h-4 mr-2" />
                Dec 05, 2025
              </div>
              <div className="flex items-center text-sm text-text-dark/70">
                <i data-lucide="map-pin" className="w-4 h-4 mr-2" />
                Main Auditorium
              </div>
            </div>
          </div>

          {/* Event Card */}
          <div className="overflow-hidden transition-transform duration-300 border border-gray-200 shadow-lg bg-bg-white rounded-xl hover:scale-105">
            <div className="flex items-center justify-center h-56 bg-gray-100">
              <i data-lucide="ticket" className="text-gray-400 h-14 w-14"></i>
            </div>
            <div className="p-6">
              <h3 className="mb-3 text-xl font-semibold text-text-dark">
                Tech Meetup 2025
              </h3>
              <div className="flex items-center mb-1 text-sm text-text-dark/70">
                <i data-lucide="calendar" className="w-4 h-4 mr-2" />
                Dec 05, 2025
              </div>
              <div className="flex items-center text-sm text-text-dark/70">
                <i data-lucide="map-pin" className="w-4 h-4 mr-2" />
                Main Auditorium
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
