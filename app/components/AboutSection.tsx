const AboutSection = () => {
  return (
    <section className="bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-4">About</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Revolutionizing live eSports on<br />
            social platforms
          </h2>
          <p className="text-gray-400 text-lg">
            Shaping the future of social media content
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {/* Purpose Driven Card */}
          <div className="bg-[#131313] border border-[#333] rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-6">Purpose driven</h3>
            <p className="text-gray-400 leading-relaxed">
              we have committed ourselves to offering insight way to assit you
            </p>
          </div>

          {/* Mission Focused Card */}
          <div className="bg-[#131313] border border-[#333] rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-6">Mission focused</h3>
            <p className="text-gray-400 leading-relaxed">
              we have committed ourselves to offering insight way to assit you
            </p>
          </div>

          {/* Insights Card */}
          <div className="bg-[#131313] border border-[#333] rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-6">Insights</h3>
            <p className="text-gray-400 leading-relaxed">
              we have committed ourselves to offering insight way to assit you
            </p>
          </div>
        </div>

        {/* Our Journey Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Our journey</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Since our inception, we have been dedicated to transforming<br />
            the way we stream esport
          </p>
        </div>

        {/* Timeline Card */}
        <div className="flex justify-center">
          <div className="bg-[#131313] border border-[#333] rounded-2xl p-8 text-center max-w-sm">
            <h3 className="text-5xl font-bold mb-6">2024</h3>
            <p className="text-gray-400">Started our journey</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;