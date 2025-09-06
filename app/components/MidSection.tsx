import React from 'react';

const ServicesSection = () => {
  const services = [
    { title: 'Graphic Design', description: 'Creative designs for your projects' },
    { title: 'Multi-Streaming', description: 'Stream to multiple platforms simultaneously' },
    { title: 'Talent Sourcing', description: 'Find the right talent for your needs' },
  ];

  return (
    <section className="bg-black text-white py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
          <div className="space-y-6">
            <p className="text-gray-400 text-sm uppercase tracking-wider">Services</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Take Your<br />Broadcast to New<br />Heights
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              Experience seamless live streaming<br />that captivates your audience.
            </p>
          </div>

          <div className="space-y-6 ">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="bg-[#1a1a1a] border border-[#333] rounded-3xl p-8"
              >
                <div className="flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-400 text-lg">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;