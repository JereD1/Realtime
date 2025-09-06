import React from 'react'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import ApplyCareer from '../../components/ApplyCareers'

const page = () => {
  return (
    <div className='bg-black'>
      <Nav />
      <ApplyCareer />
      <Footer />
    </div>
  )
}

export default page
