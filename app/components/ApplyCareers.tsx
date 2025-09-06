'use client';
import React from 'react';

interface JobListing {
  title: string;
  id: string;
}

const CareersComponent: React.FC = () => {
  const jobListings: JobListing[] = [
    { title: 'eSports Caster', id: 'esports-caster' },
    { title: 'Graphic Designer', id: 'graphic-designer' }
  ];

  const handleApply = (jobTitle: string) => {
    console.log(`Apply button clicked for: ${jobTitle}`);
    // Add your application logic here
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-16 max-w-4xl">
        <p className="text-gray-400 text-sm mb-4 tracking-wide uppercase">
          Careers
        </p>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
          Build quality eSports Live coverage with us
        </h1>
        
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
          we are here to revolutionize the way you stream mobile eSports
        </p>
      </div>

      {/* Job Listings */}
      <div className="w-full max-w-4xl space-y-4">
        {jobListings.map((job) => (
          <div 
            key={job.id}
            className="bg-white bg-opacity-95 rounded-xl p-6 flex items-center justify-between hover:bg-opacity-100 transition-all duration-200 shadow-lg"
          >
            <h3 className="text-black text-xl font-semibold">
              {job.title}
            </h3>
            
            <button 
              onClick={() => handleApply(job.title)}
              className="bg-black text-white px-8 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Apply
            </button>
          </div>
        ))}
      </div>

      {/* Background Pattern Effect */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 120, 120, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(120, 120, 120, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 40% 80%, rgba(120, 120, 120, 0.1) 0%, transparent 50%)`
        }}>
        </div>
      </div>
    </div>
  );
};

export default CareersComponent;