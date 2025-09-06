
import Link from "next/link";

const Header = () => {

  

  return (
    <header className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto w-full text-center">
        <div className="text-white">
          {/* Brand Badge */}
          <div className="inline-flex items-center bg-[#1a1a1a] border border-[#333] rounded-full px-4 py-2 mb-6">
            <div className="w-3 h-3 bg-[#4142f3] rounded-full mr-3"></div>
            <span className="text-gray-300 text-sm font-medium">RealTime Production</span>
          </div>
          
          {/* Main Content */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Elevate Your Event With<br />
              Live Esport Streaming
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Experience the thrill of live esports tournaments with our<br />
              production services
            </p>
            
            <Link href="/Contact">
            <button className="bg-[#4142f3] hover:bg-[#4142f3] text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-200 mt-8">
              Contact us
            </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;