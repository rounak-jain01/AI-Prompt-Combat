import React from 'react';
import { motion } from 'framer-motion';
import { Users, Sparkles } from 'lucide-react';

// Import logos (Make sure these paths are correct for your project)
import logoKaggle from '../../assets/Kagglelogo.png'; 
import logoKalasarthi from '../../assets/kalasarthiBadge.jpg';

const Organizers = () => {
  return (
    <section className="relative py-24 bg-[#050505] overflow-hidden">
      
      {/* Background Glow (Subtle) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#D4AF37] rounded-full blur-[150px] opacity-5 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* HEADER */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users size={16} className="text-[#FFD700]" />
            <span className="text-[#FFD700] font-bold tracking-[0.2em] uppercase text-xs md:text-sm">
              Event Organizers
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
            Organized by <span className="text-[#FFD700]">Kaggle Koders × KalaSarthi</span>
          </h2>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A collaborative effort between two vibrant communities dedicated to fostering innovation, creativity, and excellence in AI and prompt engineering.
          </p>
        </div>

        {/* ORGANIZER CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          
          {/* CARD 1: KAGGLE KODERS */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative p-8 rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-[#FFD700]/30 transition-all duration-300"
          >
            {/* Logo Container with Glow */}
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32 rounded-3xl bg-[#111] border border-white/5 flex items-center justify-center group-hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.15)] transition-shadow duration-300">
                <img src={logoKaggle} alt="Kaggle Koders" className="w-20 h-20 object-contain" />
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles size={14} className="text-[#FFD700]" />
                <span className="text-[#FFD700] text-xs font-bold uppercase tracking-widest">Co-Organizer</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Kaggle Koders</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                A community of passionate data scientists and AI enthusiasts competing, learning, and growing together.
              </p>
            </div>
          </motion.div>

          {/* CARD 2: KALASARTHI */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative p-8 rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-[#FFD700]/30 transition-all duration-300"
          >
            {/* Logo Container with Glow */}
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32 rounded-3xl bg-[#111] border border-white/5 flex items-center justify-center group-hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.15)] transition-shadow duration-300">
                <img src={logoKalasarthi} alt="KalaSarthi" className="w-20 h-20 object-contain rounded-xl" />
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles size={14} className="text-[#FFD700]" />
                <span className="text-[#FFD700] text-xs font-bold uppercase tracking-widest">Co-Organizer</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">KalaSarthi</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                A vibrant community dedicated to fostering creativity, innovation, and collaboration in the arts and technology.
              </p>
            </div>
          </motion.div>

        </div>

        {/* BOTTOM MESSAGE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="py-6 px-8 rounded-2xl bg-[#111] border border-white/10 text-center">
            <p className="text-gray-300 font-medium">
              Together, we're empowering the next generation of AI enthusiasts and prompt engineers to excel in their journey.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Organizers;