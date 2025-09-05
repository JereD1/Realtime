import React from 'react';
import Navigation from './components/Nav';
import Header from './components/Header';
import Midsection from './components/MidSection';
import AboutSection from './components/AboutSection';
import TournamentCard from './components/TournamentCard';
import Footer from './components/Footer';


const Homepage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <Header />
      <Midsection />
      <AboutSection />
      <TournamentCard />
      <Footer />
      {/* Add any additional components or sections here */}
    </div>
  );
};

export default Homepage;