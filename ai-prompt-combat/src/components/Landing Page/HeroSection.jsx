import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Trophy, Users, ArrowRight, LayoutDashboard, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import bannerImage from "../../assets/banner.jpg";
import logo from "../../assets/Kagglelogo.png";
import kalasarthiBadge from "../../assets/kalasarthiBadge.jpg";

const getEventDate = () => {
  const now = new Date();
  let year = now.getFullYear();
  const event = new Date(year, 3, 2, 11, 0, 0);
  if (now > event) year += 1;
  return new Date(year, 3, 2, 11, 0, 0);
};

// const EVENT_DATE = getEventDate();



const HeroSection = () => {
  const { currentUser } = useAuth();

  return (
    <section className="mt-5 relative min-h-screen flex items-center justify-center overflow-x-hidden bg-dark pt-16 pb-12">
      

      {/* 1. BACKGROUND BANNER ANIMATION */}
<div className="absolute inset-0 overflow-hidden z-0">
  <motion.div
    className="flex h-full w-max" // w-max ensures the container doesn't squeeze the images
    initial={{ x: 0 }}
    animate={{ x: "-50%" }} // Moves by exactly one image set
    transition={{ 
      duration: 30, // Adjusted for smoother speed
      repeat: Infinity, 
      ease: "linear" 
    }}
    style={{ willChange: "transform" }}
  >
    {/* Use h-full with w-auto to keep the 1600:270 aspect ratio */}
    <img 
      src={bannerImage} 
      alt="Background" 
      className="h-full w-auto flex-none opacity-80 object-contain" 
    />
    <img 
      src={bannerImage} 
      alt="Background" 
      className="h-full w-auto flex-none opacity-80 object-contain" 
    />
  </motion.div>
  
  {/* Darker Overlay for better text readability */}
  <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
</div>

      {/* GLOW EFFECTS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-primary rounded-full blur-[100px] opacity-15 pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-50 h-50 bg-[#FFD700] rounded-full blur-[80px] opacity-25 mix-blend-screen pointer-events-none z-0" />

      {/* FLOATING PARTICLES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            initial={{ x: Math.random() * window.innerWidth, y: window.innerHeight }}
            animate={{ y: -10, opacity: [0, 1, 0] }}
            transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: Math.random() * 5, ease: "linear" }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* LOGOS SECTION  */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <div className="glass-card p-2 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm hover:border-primary/50 transition-colors">
              <img src={logo} alt="Kaggle Koders" className="h-8 w-8 md:h-12 md:w-12 object-contain" />
            </div>
            <span className="text-xl text-primary/50 font-thin">×</span>
            <div className="glass-card p-2 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm hover:border-primary/50 transition-colors">
              <img src={kalasarthiBadge} alt="KalaSarthi" className="h-8 w-8 md:h-12 md:w-12 object-contain" />
            </div>
          </motion.div>

          {/* MAIN TITLE */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="font-display font-black uppercase tracking-tighter leading-none drop-shadow-2xl mb-2"
          >
            <span className="text-4xl md:text-6xl lg:text-7xl text-white block md:inline drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              A.I.&nbsp;
            </span>
            <span className="text-4xl md:text-6xl lg:text-7xl gold-text text-glow block md:inline drop-shadow-[0_0_30px_rgba(212,175,55,0.6)]">
               PROMPT
            </span>
            <br className="hidden md:block" />
            <span className="text-4xl md:text-6xl lg:text-7xl text-white block md:inline mt-1 md:mt-0 md:inline-flex md:items-baseline">
              COMBAT <span className="text-primary text-4xl md:text-6xl lg:text-7xl md:align-baseline ml-1 md:ml-2">2.0</span>
            </span>
          </motion.h1>

          {/* Date & Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm md:text-base text-primary font-semibold mb-1"
          >
            2nd April · 11:00 AM – 1:00 PM
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-base md:text-xl text-gray-300 mb-6 max-w-xl mx-auto font-medium tracking-wide"
          >
            Where Creativity Meets <span className="text-primary font-bold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">Precision</span>
          </motion.p>

          {/* COUNTDOWN TO EVENT */}
          {/* <Countdown /> */}

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10 px-6"
          >
            {currentUser ? (
                // IF LOGGED IN: Go to Dashboard
                <Link to="/lobby" className="px-6 py-3 bg-primary text-black font-bold text-base rounded-full shadow-[0_0_30px_rgba(212,175,55,0.3)] border border-transparent transition-all duration-300 hover:bg-black hover:text-primary hover:border-primary hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                    <LayoutDashboard size={18} /> Go to Dashboard
                </Link>
            ) : (
                // IF LOGGED OUT: Register Now
                <Link to="/login" className="px-6 py-3 bg-primary text-black font-bold text-base rounded-full shadow-[0_0_30px_rgba(212,175,55,0.3)] border border-transparent transition-all duration-300 hover:bg-black hover:text-primary hover:border-primary hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                    <Trophy size={18} /> Login
                </Link>
            )}

            {/* <a href="https://forms.gle/VrrV5esbxneoA1Ur5" target="_blank" className="px-6 py-3 bg-primary text-black font-bold text-base rounded-full shadow-[0_0_30px_rgba(212,175,55,0.3)] border border-transparent transition-all duration-300 hover:bg-black hover:text-primary hover:border-primary hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
                    <Trophy size={18} /> Register Now
                </a> */}

            <a href="#format" className="px-6 py-3 border border-primary/50 text-primary font-bold text-base rounded-full hover:bg-black hover:text-primary hover:border-primary hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all active:scale-95 flex items-center justify-center gap-2">
               View Rules <ArrowRight size={18} />
            </a>
          </motion.div>

          {/* STATS GRID  */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {[
              { icon: Trophy, value: "₹10K", label: "Prize Pool" },
              { icon: Zap, value: "2 hrs", label: "Duration" },
              { icon: Users, value: "2", label: "Rounds" },
            ].map((stat, index) => (
              <div key={index} className="p-3 md:p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm flex flex-col items-center hover:-translate-y-1 hover:border-primary/30 transition-all duration-300">
                <stat.icon className="w-5 h-5 text-primary mb-1 drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                <div className="text-xl md:text-2xl font-bold text-white mb-0">{stat.value}</div>
                <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
