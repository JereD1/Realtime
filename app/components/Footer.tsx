import React from 'react'
import { Twitter } from 'lucide-react';
import Link from 'next/link';


const Footer = () => {
  return (
   <footer className="bg-black py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* RealTime Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#4142f3] to-[#101043] hover:from-[#3535b3] hover:to-[#1c1c80] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">RT</span>
            </div>
            <span className="text-white text-lg font-semibold">RealTime</span>
          </div>
          
          {/* X Icon */}
          <div className="text-white">
            <Link href="#">
            <Twitter className="w-6 h-6" />
            </Link>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            ©2024 RealTime. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer


