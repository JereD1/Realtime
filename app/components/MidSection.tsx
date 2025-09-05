'use client';
import { useEffect, useRef, useState } from 'react';

const ServicesSection = () => {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const services = [
    { title: 'Graphic Design', description: 'Creative designs for your projects' },
    { title: 'Multi-Streaming', description: 'Stream to multiple platforms simultaneously' },
    { title: 'Talent Sourcing', description: 'Find the right talent for your needs' },
  ];

  useEffect(() => {
    const onScrollOrResize = () => {
      const el = sectionRef.current;
      if (!el) return;

      const sectionTop = el.offsetTop;
      const sectionHeight = el.offsetHeight;
      const viewportH = window.innerHeight;

      const start = sectionTop - viewportH * 1;
      const end = sectionTop + sectionHeight - viewportH * 1;

      const y = window.scrollY;
      const raw = (y - start) / Math.max(1, (end - start));
      const clamped = Math.max(0, Math.min(1, raw));
      setScrollProgress(clamped);
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    
    // Initial calculation
    onScrollOrResize();

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  const getCardStyle = (i) => {
    const total = services.length;
    const animatedCards = total - 1; 
    const segment = 1 / animatedCards;

    const cardProgress = i === 0
      ? 0
      : Math.max(0, Math.min(1, (scrollProgress - (i - 1) * segment) / segment));

    const baseY = i * 140; 
    const finalY = (total - 1 - i) * 20;

    const translateY = baseY + (finalY - baseY) * cardProgress;
    const scale = 1 - cardProgress * 0.05;
    const opacity = i === total - 1 ? 1 : 1 - cardProgress * 0.4;

    return {
      transform: `translateY(${translateY}px) scale(${scale})`,
      opacity,
      zIndex: 10 + i,
      willChange: 'transform, opacity',
      transition: 'transform 0.25s ease-out, opacity 0.25s ease-out',
    };
  };

  return (
    <section ref={sectionRef} className="bg-black text-white py-32" style={{ height: '200vh' }}>
      <div className="max-w-7xl mx-auto px-6 sticky top-0 h-screen flex items-center">
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

          <div className="relative h-[520px]">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="absolute inset-0 bg-[#1a1a1a] border border-[#333] rounded-3xl p-8"
                style={getCardStyle(index)}
              >
                <div className="h-full flex flex-col justify-center">
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