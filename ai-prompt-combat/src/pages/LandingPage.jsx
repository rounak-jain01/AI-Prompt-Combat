import React from 'react';

// Import Components from the new 'LandingPage' folder
// Note: Ensure your file paths match exactly where you moved the files
import HeroSection from '../components/Landing Page/HeroSection';
import About from '../components/Landing Page/About';
import Timeline from '../components/Landing Page/Timeline';
import ImportantDates from '../components/Landing Page/ImportantDates';
import PastEvents from '../components/Landing Page/PastEvents';
import Prizes from '../components/Landing Page/Prizes';
import Organizers from '../components/Landing Page/Organizers';
import Team from '../components/Landing Page/Team';
import Footer from '../components/Landing Page/Footer';
import TutorialVideo from '../components/Landing Page/TutorialVideo';
import EventDetails from '../components/Landing Page/EventDetails';
import Faculty from '../components/Landing Page/Faculty';

const LandingPage = () => {
  return (
    <div className="flex flex-col w-full">
      <div id="home"><HeroSection /></div>
      <div id="about"><About /></div>
      <div id="format"><Timeline /></div>
      <div id="tutorial"><TutorialVideo /></div>
      <div id="timeline"><ImportantDates /></div>
      <div id="legacy"><PastEvents /></div>
      <div id="prizes"><Prizes /></div>
      <div id="details"><EventDetails /></div>
      <div id="organizers"><Organizers /></div>
      <div id="faculty"><Faculty /></div>
      <div id="team"><Team /></div>
      <div id="contact"><Footer /></div>
    </div>
  );
};

export default LandingPage;