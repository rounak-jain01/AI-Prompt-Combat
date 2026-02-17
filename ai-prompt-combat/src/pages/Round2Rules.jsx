import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Loader2, 
  Terminal,
  FileVideo,
  Cpu,
  AlertTriangle,
  Zap,
  MousePointer2,
  Disc,
  ShieldCheck
} from "lucide-react";
import { API_BASE_URL } from "../config";

export default function Round2Rules() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  // Scroll Progress Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleStart = async () => {
    if (!agreed) return toast.error("Acknowledge the protocols to proceed.");
    
    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        toast.error("Authentication lost. Please login.");
        setLoading(false);
        return;
    }

    // Simulate System Boot
    setTimeout(() => {
        navigate("/round-2"); 
    }, 2000);
  };

  return (
    <div className="bg-[#030303] text-white font-sans selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
      
      {/* === PROGRESS BAR (TOP) === */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#D4AF37] origin-left z-50 shadow-[0_0_10px_#D4AF37]"
        style={{ scaleX }}
      />

      {/* === BACKGROUND FX === */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#D4AF37] opacity-[0.05] blur-[150px] rounded-full pointer-events-none"></div>

      {/* ================= SECTION 1: HERO ================= */}
      <section className="min-h-screen flex flex-col items-center justify-center relative p-6">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center z-10"
        >
            <div className="inline-flex items-center gap-2 text-[#D4AF37] border border-[#D4AF37]/30 px-4 py-1 rounded-full text-xs font-mono mb-6 tracking-widest uppercase">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Classified Intel // R-02
            </div>
            
            <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tighter leading-none mb-6">
                VISIONARY <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#ffe58f] to-[#D4AF37]">
                    PROTOCOL
                </span>
            </h1>
            
            <p className="max-w-xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed mb-12">
                "Reality is merely a prompt." <br/>
                Analyze the visual data. Reconstruct the simulation.
            </p>

            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-2 text-gray-500 text-sm font-mono opacity-60"
            >
                <MousePointer2 size={16} />
                SCROLL TO DECRYPT
            </motion.div>
        </motion.div>
      </section>


      {/* ================= SECTION 2: THE OBJECTIVE ================= */}
      <section className="min-h-screen flex items-center justify-center p-6 relative">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
            
            {/* Text Content */}
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="order-2 md:order-1"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 flex items-center gap-4">
                    <span className="text-[#D4AF37] text-6xl opacity-20 font-display">01</span>
                    THE MISSION
                </h2>
                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                    You will intercept a <span className="text-white font-bold">15-second visual feed</span>. 
                    Your objective is to generate a near-perfect replica using Generative AI.
                </p>
                <ul className="space-y-4 text-gray-400">
                    <li className="flex items-center gap-3">
                        <Zap className="text-[#D4AF37]" size={20} /> Match Camera Movement (Drone/Pan/Zoom)
                    </li>
                    <li className="flex items-center gap-3">
                        <Zap className="text-[#D4AF37]" size={20} /> Replicate Lighting & Atmosphere
                    </li>
                    <li className="flex items-center gap-3">
                        <Zap className="text-[#D4AF37]" size={20} /> Maintain Subject Consistency
                    </li>
                </ul>
            </motion.div>

            {/* Visual Graphic */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="order-1 md:order-2 bg-gradient-to-br from-[#111] to-black border border-white/10 rounded-3xl p-8 aspect-square flex items-center justify-center relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[#D4AF37]/5 animate-pulse"></div>
                <Disc size={120} className="text-[#D4AF37] animate-[spin_10s_linear_infinite]" />
                <div className="absolute bottom-6 left-6 font-mono text-xs text-[#D4AF37]">TARGET_ACQUISITION_MODE</div>
            </motion.div>
        </div>
      </section>


      {/* ================= SECTION 3: PARAMETERS ================= */}
      <section className="min-h-screen flex items-center justify-center p-6 bg-[#080808]">
        <div className="max-w-5xl w-full">
            <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold mb-16 text-center"
            >
                <span className="text-[#D4AF37] block text-sm font-mono mb-2 tracking-widest">DIRECTIVES</span>
                OPERATIONAL PARAMETERS
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    viewport={{ once: true }}
                    className="bg-[#111] border border-white/10 p-8 rounded-2xl hover:border-[#D4AF37]/50 transition-colors group"
                >
                    <Clock size={40} className="text-gray-500 group-hover:text-[#D4AF37] mb-6 transition-colors" />
                    <h3 className="text-xl font-bold mb-3">Time Window</h3>
                    <p className="text-gray-400">Strict <strong className="text-white">30 Minute</strong> deadline. The portal auto-terminates upon expiration.</p>
                </motion.div>

                {/* Card 2 */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-[#111] border border-white/10 p-8 rounded-2xl hover:border-[#D4AF37]/50 transition-colors group"
                >
                    <Cpu size={40} className="text-gray-500 group-hover:text-[#D4AF37] mb-6 transition-colors" />
                    <h3 className="text-xl font-bold mb-3">Open Arsenal</h3>
                    <p className="text-gray-400">Use ANY tool: <strong className="text-white">Runway, Pika, Luma, Kling</strong>. Your prompt engineering is the key.</p>
                </motion.div>

                {/* Card 3 */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                    className="bg-[#111] border border-white/10 p-8 rounded-2xl hover:border-[#D4AF37]/50 transition-colors group"
                >
                    <FileVideo size={40} className="text-gray-500 group-hover:text-[#D4AF37] mb-6 transition-colors" />
                    <h3 className="text-xl font-bold mb-3">Output Format</h3>
                    <p className="text-gray-400">Final submission must be a <strong className="text-white">.mp4</strong> file. Max size <strong className="text-white">20MB</strong>.</p>
                </motion.div>
            </div>
        </div>
      </section>


      {/* ================= SECTION 4: CRITICAL PROTOCOL ================= */}
      <section className="min-h-[80vh] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Warning Background */}
        <div className="absolute inset-0 bg-[#D4AF37]/5 -skew-y-3 transform origin-left z-0"></div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl w-full bg-[#0a0a0a] border-2 border-[#D4AF37] rounded-3xl p-8 md:p-12 relative z-10 shadow-[0_0_100px_rgba(212,175,55,0.15)]"
        >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#030303] px-6 py-2 border border-[#D4AF37] rounded-full flex items-center gap-2">
                <AlertTriangle className="text-[#D4AF37] fill-[#D4AF37]/20" size={20} />
                <span className="text-[#D4AF37] font-bold tracking-widest text-sm">CRITICAL WARNING</span>
            </div>

            <div className="text-center mt-6">
                <h3 className="text-3xl font-bold mb-6">MANDATORY FILENAME PROTOCOL</h3>
                <p className="text-gray-400 mb-8">Files uploaded without this specific naming format will be <span className="text-red-500 font-bold">AUTO-REJECTED</span> by the server.</p>
                
                <div className="bg-black/80 border border-white/10 p-6 rounded-xl inline-block w-full max-w-xl">
                    <code className="text-[#544923] font-mono text-lg md:text-xl break-all">
                        FullName.mp4
                    </code>
                    <div className="text-gray-600 text-xs mt-3 font-mono">EXAMPLE: RahulSharma.mp4</div>
                </div>
            </div>
        </motion.div>
      </section>


      {/* ================= FOOTER: AGREEMENT ================= */}
      <section className="min-h-[50vh] flex flex-col items-center justify-center p-6 bg-gradient-to-t from-[#D4AF37]/10 to-transparent">
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
        >
            <ShieldCheck size={60} className="text-[#D4AF37] mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-8">INITIATE SEQUENCE</h2>
            
            <div className="flex flex-col items-center gap-6">
                <label className="flex items-center gap-4 cursor-pointer group select-none bg-black/50 px-6 py-4 rounded-xl border border-white/10 hover:border-[#D4AF37]/50 transition-colors">
                    <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${agreed ? "bg-[#D4AF37] border-[#D4AF37] text-black" : "border-gray-500 bg-transparent"}`}>
                        {agreed && <CheckCircle size={16} />}
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors text-lg">
                        I have read and accepted the mission directives.
                    </span>
                    <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={agreed} 
                        onChange={() => setAgreed(!agreed)} 
                    />
                </label>

                <button
                    onClick={handleStart}
                    disabled={loading || !agreed}
                    className={`group relative px-10 py-5 rounded-full font-bold text-xl tracking-widest flex items-center justify-center gap-3 transition-all overflow-hidden
                        ${loading || !agreed 
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50" 
                        : "bg-[#D4AF37] text-black hover:scale-105 shadow-[0_0_40px_rgba(212,175,55,0.4)]"
                        }`}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : <Terminal size={24} />}
                        {loading ? "SYSTEM BOOT..." : "ENTER STUDIO"}
                    </span>
                    
                    {/* Hover Effect Shine */}
                    {agreed && !loading && (
                        <div className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></div>
                    )}
                </button>
            </div>
        </motion.div>
      </section>

    </div>
  );
}