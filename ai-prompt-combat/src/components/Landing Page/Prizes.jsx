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

        {/* CARDS CONTAINER */}
        <div className="flex flex-col md:flex-row justify-center items-end gap-6 max-w-4xl mx-auto mb-16">
          {/* 1ST PLACE (Gold) - crown absolutely positioned above card */}
          <div className="order-1 md:order-1 w-full md:w-1/2 flex relative">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2"
            >
              <Crown size={44} className="text-[#FFD700] fill-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group w-full"
            >
              <div className="relative bg-[#0A0A0A] rounded-3xl border-2 border-[#FFD700] p-8 flex flex-col items-center text-center w-full shadow-[0_0_30px_-10px_rgba(255,215,0,0.3)] transition-all duration-300 ease-out group-hover:-translate-y-3 group-hover:shadow-[0_24px_60px_-20px_rgba(255,215,0,0.8)] group-hover:border-[#FFE066]">
                <div className="w-20 h-20 rounded-full bg-linear-to-b from-[#FFD700] to-[#B8860B] flex items-center justify-center mb-4 shadow-lg shadow-[#FFD700]/20 transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:scale-105">
                  <Trophy size={40} className="text-black fill-current" />
                </div>
                <h3 className="text-3xl font-bold text-white">1st Place</h3>
                <p className="text-[#FFD700] text-sm font-bold uppercase tracking-widest mb-8">Champion</p>
                <div className="text-5xl font-black text-[#FFD700] mb-8">₹6,000</div>
                <ul className="space-y-4 w-full text-left pl-6">
                  <li className="flex items-center gap-2 text-white text-sm"><Star size={16} className="text-[#FFD700] fill-[#FFD700]" /> <b>Gold Trophy</b></li>
                  <li className="flex items-center gap-2 text-gray-300 text-sm"><Star size={16} className="text-[#FFD700]" /> Certificate (Hard Copy)</li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* 2ND PLACE (Silver) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group order-2 w-full md:w-1/2 flex"
          >
            <div className="relative bg-[#111111] rounded-3xl border border-gray-800 p-7 flex flex-col items-center text-center w-full transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:border-gray-500 group-hover:shadow-[0_18px_45px_-18px_rgba(0,0,0,0.8)]">
              <div className="w-16 h-16 rounded-full bg-linear-to-b from-gray-300 to-gray-500 flex items-center justify-center mb-4 shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-3">
                <Trophy size={32} className="text-white fill-current" />
              </div>
              <h3 className="text-2xl font-bold text-white">2nd Place</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-5">Runner Up</p>
              <div className="text-4xl font-black text-gray-300 mb-7">₹4,000</div>
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
                <Trophy size={14} className="text-[#FFD700]" /> Trophies for top 2
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Prizes;
