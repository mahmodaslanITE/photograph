import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import Footer from './components/Footer';

const Home = () => {
  return (
    <div className="home" dir="rtl">
      <Navbar />
      <Hero />
      <Services />
      <WhyUs />
      <Footer />
    </div>
  );
};

export default Home;