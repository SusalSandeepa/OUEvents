const Hero = () => {
  return (
    <section className="grid items-center grid-cols-1 gap-12 my-8 md:grid-cols-2">
      {/* Text */}
      <div className="ml-8">
        <h1 className="text-4xl font-extrabold leading-tight lg:text-5xl text-[#2f3e4e]">
          Discover & Join <span className="text-[#7a1d1a]">OUSL Events</span>
        </h1>

        <p className="mt-4 text-lg text-text-dark/80">
          Your central hub for all workshops, seminars, and activities happening
          at the Open University of Sri Lanka.
        </p>

        <a
          href="/events"
          className="font-medium tracking-wide inline-flex items-center px-6 py-3 mt-8 font-16px text-[#FFFFFF] transition-all rounded-lg shadow-md bg-[#7a1d1a] hover:bg-secondary/90"
        >
          Browse Events →
        </a>
      </div>

      {/* Image */}
      <div className="items-center justify-center hidden mr-8 bg-white border-2 border-gray-300 border-dashed rounded-lg md:flex h-96">
        <p className="text-gray-500">[Hero Image Placeholder]</p>
      </div>
    </section>

  
  );
};

export default Hero;
