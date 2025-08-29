import { Timer, Component, TvMinimalPlay  } from 'lucide-react';

const Midsection = () => {
  
  return (
    <section className="bg-black py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-purple-400 font-medium mb-4 tracking-wide uppercase">Stream</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Why Choose Us{' '}
            <br className="hidden md:block" />
            for Success?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience seamless live streaming that captivates your{' '}
            <br className="hidden md:block" />
            audience.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              {/* Icon Placeholder  */}
              <div className="w-16 h-16  rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:shadow-lg  transition-all duration-300">
                <Timer size={30} className='text-white' />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors duration-200">
               
              </h3>
              <p className="text-gray-300 leading-relaxed">
                
              </p>
            </div>
         
        </div>
      </div>
    </section>
  );
};

export default Midsection;