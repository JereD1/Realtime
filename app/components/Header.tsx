const Header = () => {
  return (
    <header className="min-h-screen bg-black flex items-center justify-center px-6 pt-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="bg-[#201F1F] bg-opacity-60 backdrop-blur-sm rounded-3xl p-8 md:p-16 ">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Elevate your game with{' '}
              <br className="hidden md:block" />
              live Esport Streaming
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              Experience the thrill of live esports tournaments{' '}
              <br className="hidden md:block" />
              with our production services
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
              Join
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;