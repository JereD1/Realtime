// Footer Component
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: ['About', 'Careers', 'Our Work', 'Contact'],
    Services: ['Live Streaming', 'Graphic Design', 'Real-time Graphics', 'Tournament Management'],
    Support: ['Help Center', 'Documentation', 'API Reference', 'Status'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR']
  };

  const socialLinks = [
    { name: 'Twitter', icon: '𝕏' },
    { name: 'Discord', icon: '💬' },
    { name: 'YouTube', icon: '📺' },
    { name: 'Twitch', icon: '🎮' }
  ];

  return (
    <footer className="bg-[#201F1F]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                <span className="text-black font-bold text-lg">RT</span>
              </div>
              <span className="text-white font-bold text-xl">RealTime Esports</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Elevating esports experiences with professional live streaming and broadcast solutions for tournaments worldwide.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <button
                  key={index}
                  className="w-10 h-10 bg-gray-800 hover:bg-purple-600 text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  title={social.name}
                >
                  <span className="text-sm">{social.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="lg:col-span-1">
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <button className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-12">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
            <p className="text-gray-400 mb-6">
              Get the latest updates on tournaments, new features, and esports industry news.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors duration-200"
              />
              <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

       
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} RealTime Esports. All rights reserved.
          </div>
           {/* Bottom Bar 
          <div className="flex items-center space-x-6 text-sm">
            <button className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
              Privacy Policy
            </button>
            <button className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
              Terms of Service
            </button>
            <button className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
              Cookies
            </button>
          </div>
          */}
        </div>
        
      </div>
    </footer>
  );
};
export default Footer;