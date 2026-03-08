import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Gift, CheckCircle, ShieldCheck, Star, MedalIcon } from 'lucide-react';

const Prizes = () => {
  return (
    <section className="relative py-24 bg-dark overflow-hidden">
      
      {/* Background  */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-[#FFD700]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <span className="text-[#FFD700] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-2 block">
            Rewards
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white flex items-center justify-center gap-3">
            Prizes & <span className="text-[#FFD700]">Recognition</span>
          </h2>
          <p className="text-gray-400 text-sm mt-2">Total Prize Pool: <span className="text-[#FFD700] font-bold">₹10,000</span> · Entry Fee: <span className="text-white font-semibold">₹199</span></p>
        </div>

        {/* CROWN ICON  */}
        <div className="flex justify-center -mb-5 relative z-20">
             <motion.div 
               animate={{ y: [0, -5, 0] }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             >
                <Crown size={40} className="text-[#FFD700] fill-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]" />
             </motion.div>
        </div>

        {/* CARDS CONTAINER */}
        <div className="flex flex-col md:flex-row justify-center items-end gap-6 max-w-5xl mx-auto mb-16">

          {/* =======================
              2ND PLACE (Silver)
             ======================= */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="order-2 md:order-1 w-full md:w-75"
          >
            <div className="relative bg-[#111111] rounded-3xl border border-gray-800 p-8 flex flex-col items-center text-center hover:border-gray-500 transition-colors duration-300 h-100">
              {/* Icon Circle */}
              <div className="w-16 h-16 rounded-full bg-linear-to-b from-gray-300 to-gray-500 flex items-center justify-center mb-4 shadow-lg">
                <Trophy size={32} className="text-white fill-current" />
              </div>
              
              <h3 className="text-2xl font-bold text-white">2nd Place</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">Runner Up</p>
              
              <div className="text-4xl font-black text-gray-300 mb-8">₹3,000</div>
              
              <ul className="space-y-3 w-full text-left pl-4">
                <li className="flex items-center gap-2 text-gray-400 text-sm"><Star size={14} /> Trophy</li>
                <li className="flex items-center gap-2 text-gray-400 text-sm"><Star size={14} /> Certificate (Hard Copy)</li>
              </ul>
            </div>
          </motion.div>

          {/* 1ST PLACE (Gold) - Center */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="order-1 md:order-2 w-full md:w-87.5 relative z-10"
          >
            <div className="relative bg-[#0A0A0A] rounded-3xl border-2 border-[#FFD700] p-8 flex flex-col items-center text-center h-115 shadow-[0_0_30px_-10px_rgba(255,215,0,0.3)]">
              <div className="w-20 h-20 rounded-full bg-linear-to-b from-[#FFD700] to-[#B8860B] flex items-center justify-center mb-4 shadow-lg shadow-[#FFD700]/20">
                <Trophy size={40} className="text-black fill-current" />
              </div>
              <h3 className="text-3xl font-bold text-white">1st Place</h3>
              <p className="text-[#FFD700] text-sm font-bold uppercase tracking-widest mb-8">Champion</p>
              <div className="text-5xl font-black text-[#FFD700] mb-8">₹5,000</div>
              <ul className="space-y-4 w-full text-left pl-6">
                <li className="flex items-center gap-2 text-white text-sm"><Star size={16} className="text-[#FFD700] fill-[#FFD700]" /> <b>Gold Trophy</b></li>
                <li className="flex items-center gap-2 text-gray-300 text-sm"><Star size={16} className="text-[#FFD700]" /> Certificate (Hard Copy)</li>
              </ul>
            </div>
          </motion.div>

          {/* 3RD PLACE (Bronze) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="order-3 w-full md:w-75"
          >
            <div className="relative bg-[#111111] rounded-3xl border border-gray-800 p-8 flex flex-col items-center text-center hover:border-[#CD7F32] transition-colors duration-300 h-100">
              <div className="w-16 h-16 rounded-full bg-linear-to-b from-[#CD7F32] to-[#8B4513] flex items-center justify-center mb-4 shadow-lg">
                <Trophy size={32} className="text-white fill-current" />
              </div>
              <h3 className="text-2xl font-bold text-white">3rd Place</h3>
              <p className="text-[#CD7F32] text-xs font-bold uppercase tracking-widest mb-6">Second Runner Up</p>
              <div className="text-4xl font-black text-[#E8C39E] mb-8">₹2,000</div>
              <ul className="space-y-3 w-full text-left pl-4">
                <li className="flex items-center gap-2 text-gray-400 text-sm"><Star size={14} /> Trophy</li>
                <li className="flex items-center gap-2 text-gray-400 text-sm"><Star size={14} /> Certificate (Hard Copy)</li>
              </ul>
            </div>
          </motion.div>

        </div>

        {/* BOTTOM STRIP */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-[#111] border border-white/10 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20">
                <Gift className="text-[#FFD700]" size={24} />
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-white font-bold text-lg">For All Participants</h4>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Everyone is a winner</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 rounded-lg bg-black border border-white/10 text-sm text-gray-300 flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#FFD700]" /> E-Certificates for all participants
              </span>
              <span className="px-4 py-2 rounded-lg bg-black border border-white/10 text-sm text-gray-300 flex items-center gap-2">
                <Trophy size={14} className="text-[#FFD700]" /> Trophies for top 3
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Prizes;