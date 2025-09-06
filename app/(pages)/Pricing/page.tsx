import React from 'react'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import ContactForm from '../../components/ContactForm'

const page = () => {
  return (
    <div className='bg-black'>
      <Nav />
      <ContactForm />
      <Footer />
    </div>
  )
}

export default page
