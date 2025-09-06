import React from 'react'
import AuthPage from './AuthPage'
import Image from 'next/image';
import RT from '../../../public/RT.png';

const page = () => {
  return (
    <div className=" bg-gradient-to-r from-[#3030b5] to-[#101043] flex flex-col ">
      <Image src={RT} alt="RealTime Logo" className="w-32 h-32 mx-auto mb-6 fixed right-0 top-3 left-0 md:top-28" />
      <AuthPage />
    </div>
  )
}

export default page
