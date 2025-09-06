
import { X } from 'lucide-react';

const TournamentCard = () => {
  return (
    <section className="bg-black py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#131313] border border-[#333] rounded-3xl p-12 text-center text-white">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-4">Tournament</p>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Custom Tournament<br />
            Page
          </h2>
          
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Get Custom Tournament Page built for your tournament, track matches and stayed informed
          </p>
          
          <button className="bg-gradient-to-r from-[#4142f3] to-[#101043] hover:from-[#3535b3] hover:to-[#1c1c80] text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-200">
            Contact us
          </button>
        </div>
      </div>
    </section>
  );
};

export default TournamentCard;