'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const Navigation = () => {
  const [activeItem, setActiveItem] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Careers', path: '/Careers' },
    { name: 'Our Work', path: '/Our-work' },
    { name: 'Pricing', path: '/Pricing' },
    { name: 'Tournaments', path: '/Tournaments' },
  ];

  return (
    <nav className="relative z-50">
      <div className="w-full max-w-6xl mx-auto px-4 py-6 fixed top-4 left-0 right-0">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between bg-[#131313] backdrop-blur-sm rounded-2xl px-8 py-4 border border-gray-700/50">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-[#4142f3] to-[#101043] hover:from-[#3535b3] hover:to-[#1c1c80] text-white rounded-full flex items-center justify-center">
              <span className="font-bold">RT</span>
            </div>
          </div>

          {/* Nav Items */}
          <div className="flex items-center space-x-8">
            {navItems.map(({ name, path }) => (
              <Link
                key={name}
                href={path}
                onClick={() => setActiveItem(name)}
                className={`text-gray-300 font-medium hover:text-white transition-colors duration-200 ${
                  activeItem === name ? 'text-white' : ''
                }`}
              >
                {name}
              </Link>
            ))}
          </div>

          {/* Contact Button */}
          
          <button className="bg-gradient-to-r from-[#4142f3] to-[#101043] hover:from-[#3535b3] hover:to-[#1c1c80] text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
            Contact Us
          </button>
        
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-2xl px-6 py-4 border border-gray-700/50">
          <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center">
            <span className="font-bold">RT</span>
          </div>

          <button
            className="text-white z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#131313] bg-opacity-95 z-40 flex flex-col items-center justify-center p-6 md:hidden">
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-white text-2xl"
            onClick={() => setMobileMenuOpen(false)}
          >
            &times;
          </button>

          {/* Nav Links */}
          {navItems.map(({ name, path }) => (
            <Link
              key={name}
              href={path}
              onClick={() => {
                setActiveItem(name);
                setMobileMenuOpen(false);
              }}
              className={`text-white text-xl font-medium hover:text-blue-600 transition-colors duration-200 ${
                activeItem === name ? 'text-blue-700' : ''
              }`}
            >
              {name}
            </Link>
          ))}

          {/* Contact Button */}
          <button className="mt-6 w-48 bg-gradient-to-r from-[#4142f3] to-[#101043] hover:from-[#3535b3] hover:to-[#4142f3] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
            Contact Us
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
