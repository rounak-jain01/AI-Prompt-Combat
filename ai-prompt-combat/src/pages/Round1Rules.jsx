import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, AlertTriangle, Clock, CheckCircle, ShieldAlert } from 'lucide-react';

const Round1Rules = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-5 px-6 md:px-12 flex justify-center">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        
        {/* HEADER */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold border border-[#D4AF37]/20">
              QUALIFICATION ROUND
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
            Round 01: <span className="text-gray-400">The Initialization</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Read the protocols carefully before initializing the neural link.
          </p>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          
          {/* LEFT: DETAILS */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Description */}
            <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShieldAlert className="text-[#D4AF37]" size={20} /> Mission Objective
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                You will be presented with a specific "Target Image". Your goal is to analyze the image and write a precise AI Text Prompt to replicate it. 
                The system will analyze your prompt based on keywords, style descriptors, and composition accuracy.
              </p>
            </div>

            {/* Rules List */}
            <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="text-[#D4AF37]" size={20} /> Protocols & Rules
              </h3>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex gap-3">
                  <CheckCircle className="text-green-500 shrink-0" size={18} />
                  <span>Do not mention artist names or copyrighted characters.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="text-green-500 shrink-0" size={18} />
                  <span>NSFW or explicit prompts will lead to immediate disqualification.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="text-green-500 shrink-0" size={18} />
                  <span>You have unlimited attempts within the time limit.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="text-green-500 shrink-0" size={18} />
                  <span>The similarity score must be above 85% to pass.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* RIGHT: SUMMARY CARD */}
          <div className="md:col-span-1">
            <div className="bg-[#111] p-6 rounded-2xl border border-[#D4AF37]/30 sticky top-28">
              <h3 className="text-lg font-bold mb-6 text-white">Session Info</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-gray-500 text-sm">Time Limit</span>
                  <span className="font-mono font-bold flex items-center gap-2">
                    <Clock size={14} className="text-[#D4AF37]" /> 10 Mins
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-gray-500 text-sm">Difficulty</span>
                  <span className="text-green-400 font-bold text-sm">Medium</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-gray-500 text-sm">Attempts</span>
                  <span className="text-white font-bold text-sm">Unlimited</span>
                </div>
              </div>

              <Link to="/round-1/game">
                <button className="w-full py-4 rounded-xl bg-[#D4AF37] text-black font-bold text-lg hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] flex items-center justify-center gap-2 group">
                  Start Challenge 
                  <Play size={18} fill="black" className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              
              <p className="text-xs text-center text-gray-500 mt-4">
                By clicking start, the timer will begin immediately.
              </p>
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
};

export default Round1Rules;