import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAuth } from "firebase/auth";
import { 
  Clock, Target, Zap, Lock, Play, ShieldAlert, 
  MousePointerClick, AlertTriangle, CheckCircle, X, Loader2,
  BrainCircuit, Eye, Maximize, FileWarning
} from 'lucide-react';

export default function Round1Rules() {
  const navigate = useNavigate();
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // --- HANDLE START REQUEST ---
  const handleStartRound = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        toast.error("Please login to initiate the sequence.");
        navigate("/login");
        return;
    }

    setLoading(true);
    const tId = toast.loading("Establishing secure connection...");

    try {
      const token = await user.getIdToken();

      // 1. Call Backend to Mark Round as Started
      const res = await fetch("http://127.0.0.1:5000/api/start-round", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ roundId: "round1" })
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Access Granted", { id: tId });
        
        // 2. Trigger Fullscreen (Browser Requirement)
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
                await document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
                await document.documentElement.msRequestFullscreen();
            }
        } catch (e) {
            console.warn("Fullscreen auto-trigger blocked by browser preference.");
        }

        // 3. Navigate to Game
        // Slight delay to allow fullscreen animation
        setTimeout(() => navigate('/round1'), 500); 
      } else {
         if(data.message === "Already submitted!") {
             toast.error("You have already completed this round!", { id: tId });
         } else {
             toast.error(data.message || "Initialization Failed", { id: tId });
         }
      }
    } catch (e) {
      console.error(e);
      toast.error("Server Connection Failed. Check your internet.", { id: tId });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden selection:bg-[#D4AF37] selection:text-black font-sans">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04]" 
           style={{ backgroundImage: `linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)`, backgroundSize: '50px 50px' }} 
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#D4AF37] opacity-[0.05] blur-[150px] rounded-full pointer-events-none" />

      {/* --- SECURITY AGREEMENT MODAL --- */}
      <AnimatePresence>
        {showSecurityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0f0f0f] border border-[#D4AF37] rounded-xl p-8 max-w-lg w-full shadow-[0_0_50px_rgba(212,175,55,0.15)] relative overflow-hidden"
            >
              {/* Decorative Header */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

              <button 
                onClick={() => !loading && setShowSecurityModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                disabled={loading}
              >
                <X size={24} />
              </button>

              <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#D4AF37] mb-4 border border-[#D4AF37]/20">
                    <ShieldAlert size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-wide">Security Protocol</h3>
                  <p className="text-gray-500 text-sm mt-1">Acceptance required to proceed</p>
              </div>
              
              <div className="bg-[#1a1a1a] rounded-lg p-4 space-y-3 mb-8 border border-white/5">
                <div className="flex gap-3 items-start">
                    <Eye className="text-red-500 shrink-0 mt-0.5" size={18} /> 
                    <span className="text-gray-300 text-sm"><strong>Focus Tracking:</strong> Tab switching or minimizing the window will trigger a violation warning.</span>
                </div>
                <div className="flex gap-3 items-start">
                    <FileWarning className="text-red-500 shrink-0 mt-0.5" size={18} /> 
                    <span className="text-gray-300 text-sm"><strong>Zero Tolerance:</strong> 3 warnings result in immediate disqualification and auto-submission.</span>
                </div>
                <div className="flex gap-3 items-start">
                    <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={18} /> 
                    <span className="text-gray-300 text-sm"><strong>Restrictions:</strong> Copy/Paste, Right-Click, and Developer Tools are disabled.</span>
                </div>
                <div className="flex gap-3 items-start">
                    <Maximize className="text-green-500 shrink-0 mt-0.5" size={18} /> 
                    <span className="text-gray-300 text-sm"><strong>Fullscreen:</strong> The challenge must be completed in fullscreen mode.</span>
                </div>
              </div>

              <div className="flex gap-3">
                 <button 
                  onClick={() => setShowSecurityModal(false)}
                  disabled={loading}
                  className="flex-1 py-3.5 border border-white/10 rounded-lg text-gray-400 hover:bg-white/5 font-bold transition-all disabled:opacity-50"
                >
                  Abort
                </button>
                <button 
                  onClick={handleStartRound}
                  disabled={loading}
                  className="flex-1 py-3.5 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#b8952b] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-70"
                >
                  {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} /> Initializing...
                      </>
                  ) : (
                      <>
                        <ShieldAlert size={20} /> I Agree & Start
                      </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MAIN PAGE CONTENT --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 flex flex-col gap-16">
        
        {/* HERO SECTION */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-xs font-mono tracking-widest uppercase mb-2">
                <BrainCircuit size={14} /> Round 01: Reverse Engineering
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#8B735B]">Briefing</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Decode the visual algorithm. Analyze the transformation from Input to Target and reconstruct the prompt that bridged the gap.
            </p>
        </motion.section>

        {/* RULES GRID */}
        <motion.div 
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            {/* Rule 1: Objective */}
            <motion.div variants={fadeInUp} className="bg-[#111] border border-white/10 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Target size={100} />
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20 mb-6 text-blue-400">
                    <Target size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">The Objective</h3>
                <p className="text-gray-400 leading-relaxed">
                    You will face <strong className="text-white">5 Image Pairs</strong> (Input → Target). Your goal is to write a precise prompt that explains the style, lighting, and subject transformation.
                </p>
            </motion.div>

            {/* Rule 2: Timing */}
            <motion.div variants={fadeInUp} className="bg-[#111] border border-white/10 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Clock size={100} />
                </div>
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/20 mb-6 text-red-400">
                    <Clock size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">25 Minute Limit</h3>
                <p className="text-gray-400 leading-relaxed">
                    The timer is strict. If time runs out, the system will <strong className="text-red-400">Auto-Submit</strong> your best-recorded attempts. Manage your time wisely across all 5 cases.
                </p>
            </motion.div>

            {/* Rule 3: Attempts */}
            <motion.div variants={fadeInUp} className="bg-[#111] border border-white/10 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap size={100} />
                </div>
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center border border-yellow-500/20 mb-6 text-yellow-400">
                    <Zap size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">5 Attempts / Case</h3>
                <p className="text-gray-400 leading-relaxed">
                    You have 5 tries per image. Use the <span className="text-yellow-400 font-bold">Check Accuracy</span> button to get instant AI feedback score (0-100%) before locking your answer.
                </p>
            </motion.div>

            {/* Rule 4: Logic */}
            <motion.div variants={fadeInUp} className="bg-[#111] border border-white/10 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Lock size={100} />
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/20 mb-6 text-green-400">
                    <Lock size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Strategic Locking</h3>
                <p className="text-gray-400 leading-relaxed">
                    You can choose to lock either your <strong>Current Prompt</strong> or your <strong>Best Historical Attempt</strong>. Always ensure you have a locked answer before submitting.
                </p>
            </motion.div>
        </motion.div>

        {/* CTA FOOTER */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6 pt-10 pb-20 border-t border-white/10"
        >
            <div className="flex items-center gap-2 text-gray-500 font-mono text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                SYSTEM READY FOR INITIALIZATION
            </div>
            
            <button 
                onClick={() => setShowSecurityModal(true)}
                className="group relative px-12 py-6 bg-white/5 border border-white/10 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black text-white text-xl font-bold rounded-2xl transition-all duration-300 flex items-center gap-4 shadow-2xl"
            >
                <div className="bg-black/20 p-2 rounded-lg group-hover:bg-black/10 transition-colors">
                    <MousePointerClick size={28} />
                </div>
                <span className="tracking-widest">START CHALLENGE</span>
                <Play size={20} className="group-hover:translate-x-1 transition-transform" fill="currentColor"/>
            </button>
            <p className="text-gray-600 text-xs uppercase tracking-widest">By clicking start, you agree to the monitoring protocols.</p>
        </motion.div>

      </div>
    </div>
  );
}