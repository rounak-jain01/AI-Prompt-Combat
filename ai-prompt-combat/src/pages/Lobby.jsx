import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; 
import { LogOut, Play, Lock, User, Terminal, Video } from 'lucide-react'; // Video icon added
import toast from 'react-hot-toast';

const Lobby = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-dark text-white p-6 md:p-12">
      
      {/* HEADER SECTION */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Combat <span className="text-primary">Lobby</span>
          </h1>
          <p className="text-gray-400">Select an active round to begin the challenge.</p>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#111] border border-white/10 hover:border-red-500/50 hover:text-red-500 transition-colors text-sm"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* ROUNDS GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* ROUND 1 CARD (Completed/Active) */}
        <div className="group relative bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300">
          <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> LIVE
          </div>
          
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
            <Terminal size={28} />
          </div>

          <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Round 1: The Initialization</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Basic prompt engineering challenges. Decrypt the images and generate the correct prompts to unlock the next level.
          </p>

          <Link to="/round-1/rules">
            <button className="w-full py-3 rounded-xl bg-primary text-black font-bold hover:bg-white transition-colors flex items-center justify-center gap-2">
              Enter Arena <Play size={18} fill="black" />
            </button>
          </Link>
        </div>

        {/* ROUND 2 CARD (✅ NOW UNLOCKED) */}
        <div className="group relative bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-300">
          <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold border border-[#D4AF37]/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span> OPEN
          </div>
          
          <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mb-6 text-[#D4AF37]">
            <Video size={28} />
          </div>

          <h2 className="text-2xl font-bold mb-3 group-hover:text-[#D4AF37] transition-colors">Round 2: The Visionary</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Advanced video replication challenge. Analyze the reference and recreate the motion using AI tools.
          </p>

          <Link to="/round-2/rules">
            <button className="w-full py-3 rounded-xl bg-[#D4AF37] text-black font-bold hover:bg-white transition-colors flex items-center justify-center gap-2">
              Enter Studio <Play size={18} fill="black" />
            </button>
          </Link>
        </div>

      </div>

    </div>
  );
};

export default Lobby;