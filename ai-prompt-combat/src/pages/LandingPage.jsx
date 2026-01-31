import React from 'react';

// Import Components from the new 'LandingPage' folder
// Note: Ensure your file paths match exactly where you moved the files
import HeroSection from '../components/LandingPage/HeroSection';
import About from '../components/LandingPage/About';
import Timeline from '../components/LandingPage/Timeline';
import ImportantDates from '../components/LandingPage/ImportantDates';
import PastEvents from '../components/LandingPage/PastEvents';
import Prizes from '../components/LandingPage/Prizes';
import Organizers from '../components/LandingPage/Organizers';
import Team from '../components/LandingPage/Team';
import Footer from '../components/LandingPage/Footer';

const LandingPage = () => {
  return (
    <div className="flex flex-col w-full">
      <div id="home"><HeroSection /></div>
      <div id="about"><About /></div>
      <div id="format"><Timeline /></div>
      <div id="timeline"><ImportantDates /></div>
      <div id="legacy"><PastEvents /></div>
      <div id="prizes"><Prizes /></div>
      <div id="organizers"><Organizers /></div>
      <div id="team"><Team /></div>
      <div id="contact"><Footer /></div>
    </div>
  );
};

export default LandingPage;