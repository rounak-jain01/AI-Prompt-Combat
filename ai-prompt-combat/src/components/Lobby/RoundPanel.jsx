import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoundPanel = ({ 
  title, 
  subtitle, 
  status = "active", // active | locked | completed
  image, 
  link, 
  delay = 0 
}) => {
  
  const isLocked = status === "locked";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: delay, ease: "easeOut" }}
      className="relative w-full h-1/2 md:h-full md:w-1/2 overflow-hidden group border-b md:border-b-0 md:border-r border-white/10"
    >
      
      {/* === BACKGROUND IMAGE === */}
      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        {/* Dark Overlay */}
        <div className={`absolute inset-0 ${isLocked ? 'bg-black/80 grayscale' : 'bg-black/60 group-hover:bg-black/50'} transition-all duration-500`} />
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* === CONTENT === */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
        
        {/* Status Badge */}
        <div className={`
          px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-4 border
          ${isLocked 
            ? 'bg-red-500/10 border-red-500/20 text-red-500' 
            : 'bg-primary/10 border-primary/20 text-primary shadow-[0_0_15px_rgba(212,175,55,0.2)]'
          }
        `}>
          {isLocked ? "Access Denied" : "Live Now"}
        </div>

        {/* Titles */}
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 tracking-tight">
          {title}
        </h2>
        <p className="text-gray-300 text-sm md:text-base max-w-sm mb-8 font-light">
          {subtitle}
        </p>

        {/* Action Button */}
        {isLocked ? (
          <button disabled className="flex items-center gap-2 px-8 py-3 rounded-full bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed">
            <Lock size={18} />
            <span>Locked</span>
          </button>
        ) : (
          <Link to={link}>
            <button className="group relative px-8 py-3 rounded-full bg-primary text-black font-bold overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2">
                Enter Arena <Play size={18} fill="black" />
              </span>
            </button>
          </Link>
        )}

      </div>

    </motion.div>
  );
};

export default RoundPanel;