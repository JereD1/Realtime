import React from 'react';
import Header from './components/Header';
import Midsection from './components/MidSection';
import Footer from './components/Footer';


const Homepage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <Midsection />
      <Footer />
      {/* Add any additional components or sections here */}
    </div>
  );
};

export default Homepage;