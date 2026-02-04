import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Target, 
  Zap, 
  Brain, 
  Lock, 
  Play, 
  ShieldCheck, 
  ChevronRight,
  MousePointerClick,
  AlertTriangle
} from 'lucide-react';

export default function Round1Rules() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleStartRequest = () => setShowModal(true);
  
  const confirmStart = () => {
    navigate('/round-1/game');
  };

  // Animation variants for scroll reveal
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-dark text-white relative overflow-x-hidden selection:bg-primary selection:text-black">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)`, backgroundSize: '60px 60px' }} 
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-200 h-125 bg-primary opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />

      {/* --- CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0A0A0A] border border-primary rounded-3xl p-10 max-w-lg w-full shadow-[0_0_80px_rgba(212,175,55,0.2)] text-center relative overflow-hidden"
            >
              {/* Background Glow inside modal */}
              <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-transparent via-primary to-transparent" />
              
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 border border-primary/30 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                <Clock className="text-primary" size={40} />
              </div>
              
              <h3 className="text-3xl font-display font-bold text-white mb-3">Initiate Sequence?</h3>
              <p className="text-gray-400 text-base leading-relaxed mb-10">
                The <span className="text-primary font-bold">25-minute timer</span> begins the moment you click Launch. 
                <br/>Ensure your environment is ready.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowModal(false)}
                  className="cursor-pointer flex-1 py-4 rounded-xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 hover:text-white transition-all tracking-wider uppercase text-sm"
                >
                  Abort
                </button>
                <button 
                  onClick={confirmStart}
                  className="cursor-pointer flex-1 py-4 rounded-xl bg-primary text-black font-bold hover:bg-[#b8952b] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 tracking-wider uppercase text-sm"
                >
                  <Play size={20} fill="currentColor" /> Launch
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-24">
        
        {/* === HERO SECTION === */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-mono tracking-widest uppercase mb-4">
                <ShieldCheck size={14} /> Protocol: Round 01
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight">
                Mission <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-[#8B735B]">Briefing</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Decipher the visual code. Transform raw inputs into artistic targets using precise prompt engineering.
            </p>

            {/* BIG START BUTTON (Front & Center) */}
            <div className="pt-8">
                <button 
                    onClick={handleStartRequest}
                    className="cursor-pointer group relative inline-flex items-center gap-4 px-10 py-5 bg-primary text-black text-xl font-bold rounded-2xl overflow-hidden hover:scale-105 transition-transform shadow-[0_0_40px_rgba(212,175,55,0.3)]"
                >
                    <div className="absolute inset-0 bg-black/40 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <Play size={28} fill="currentColor" />
                    <span className="relative">ENTER THE ARENA</span>
                </button>
                <p className="mt-4 text-xs text-gray-500 font-mono">PRESS TO BEGIN TIMER</p>
            </div>
        </motion.section>


        {/* === RULE ROWS === */}
        <div className="space-y-8">
            
            {/* Row 1: The Objective */}
            <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 hover:border-primary/30 transition-colors group"
            >
                <div className="shrink-0 w-24 h-24 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                    <Target className="text-blue-400" size={48} />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-white mb-4">The Objective</h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        You will be presented with <strong className="text-white">5 Image Pairs</strong> (Input → Target). 
                        Your goal is to write a prompt that explains how the Input image transformed into the Target.
                        <br/><span className="text-blue-400 text-sm mt-2 block">Tip: Describe style, lighting, texture, and mood.</span>
                    </p>
                </div>
            </motion.div>

            {/* Row 2: The Tools (Attempts) */}
            <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row-reverse items-center gap-10 hover:border-primary/30 transition-colors group"
            >
                <div className="shrink-0 w-24 h-24 rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group-hover:scale-110 transition-transform duration-500">
                    <Zap className="text-yellow-400" size={48} />
                </div>
                <div className="flex-1 text-center md:text-right">
                    <h2 className="text-3xl font-bold text-white mb-4">5 Attempts per Case</h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Precision takes practice. You have <strong className="text-white">5 tries</strong> for each image pair. 
                        Use the <span className="inline-block px-2 py-0.5 rounded border border-yellow-500/30 text-yellow-500 text-sm font-bold bg-yellow-500/10">Check Accuracy</span> button to get instant AI feedback score (0-100%) before locking your final answer.
                    </p>
                </div>
            </motion.div>

            {/* Row 3: The Judge (Locking) */}
            <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 hover:border-primary/30 transition-colors group"
            >
                <div className="shrink-0 w-24 h-24 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20 group-hover:scale-110 transition-transform duration-500">
                    <Lock className="text-green-400" size={48} />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-white mb-4">Lock Best Answer</h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Got a high score on Attempt 3 but messed up Attempt 4? Don't worry. 
                        When you click <strong className="text-white">Lock Answer</strong>, the system lets you choose your <span className="text-green-400 font-bold">Best Score</span> from history.
                    </p>
                </div>
            </motion.div>

            {/* Row 4: The Clock */}
            <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                className="bg-linear-to-r from-red-900/10 to-transparent border border-red-500/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 hover:border-red-500/40 transition-colors"
            >
                <div className="shrink-0 w-24 h-24 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 animate-pulse">
                    <Clock className="text-red-500" size={48} />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-white mb-4">25 Minute Hard Limit</h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Time is your enemy. The clock starts immediately. If time runs out, the system will <strong className="text-red-400">Auto-Submit</strong> your best-recorded scores for all cases. Don't panic, but don't dawdle.
                    </p>
                </div>
            </motion.div>

        </div>


        {/* === FOOTER === */}
        <motion.div 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center pt-10 pb-20"
        >
            <p className="text-gray-500 mb-8 font-mono text-sm">SYSTEM STATUS: WAITING FOR USER INPUT...</p>
            <button 
                onClick={handleStartRequest}
                className="cursor-pointer group inline-flex items-center gap-3 px-12 py-6 bg-white/5 border border-white/10 text-white text-xl font-bold rounded-2xl hover:bg-primary hover:text-black hover:border-transition-all duration-300"
            >
                <MousePointerClick size={24} />
                <span>START CHALLENGE</span>
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </motion.div>

      </div>
    </div>
  );
}