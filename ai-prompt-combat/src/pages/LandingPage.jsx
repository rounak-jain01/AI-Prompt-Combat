import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "../components/Landing Page/HeroSection";
import About from "../components/Landing Page/About";
import Timeline from "../components/Landing Page/Timeline";
import TutorialVideo from "../components/Landing Page/TutorialVideo";
import ImportantDates from "../components/Landing Page/ImportantDates";
import PastEvents from "../components/Landing Page/PastEvents";
import Prizes from "../components/Landing Page/Prizes";
import EventDetails from "../components/Landing Page/EventDetails";
import Organizers from "../components/Landing Page/Organizers";
import Faculty from "../components/Landing Page/Faculty";
import Team from "../components/Landing Page/Team";
import SponsorsSection from "../components/Landing Page/SponsorsSection";
import Footer from "../components/Landing Page/Footer";

const LandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash || window.location.hash;
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="flex flex-col w-full">
      <div id="home">
        <HeroSection />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="format">
        <Timeline />
      </div>
      <div id="tutorial">
        <TutorialVideo />
      </div>
      <div id="timeline">
        <ImportantDates />
      </div>
      <div id="legacy">
        <PastEvents />
      </div>
      <div id="prizes">
        <Prizes />
      </div>
      <div id="details">
        <EventDetails />
      </div>
      <div id="organizers">
        <Organizers />
      </div>
      <div id="faculty">
        <Faculty />
      </div>
      <div id="team">
        <Team />
      </div>
      <div id="sponsors">
        <SponsorsSection />
      </div>
      <div id="contact">
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
