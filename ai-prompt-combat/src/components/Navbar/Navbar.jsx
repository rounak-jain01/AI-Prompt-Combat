import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Sparkles, ChevronRight, LayoutDashboard, LogIn, LogOut, Trophy } from 'lucide-react'; // Added Trophy & LogOut
import { useAuthState } from "react-firebase-hooks/auth"; 
// import { auth } from "../../context/firebase"; 
import { auth } from "../../firebase";
import { useAuth } from '../../context/AuthContext'; 
import { signOut } from "firebase/auth"; 

const Navbar = () => {
  const [user] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser } = useAuth(); 
  const navigate = useNavigate();

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logout Function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); 
      setIsOpen(false); 
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Base Navigation Links
  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/#about' },
    { name: 'Timeline', href: '/#timeline' },
    { name: 'Prizes', href: '/#prizes' },
    { name: 'Details', href: '/#details' },
    { name: 'Team', href: '/#organizers' },
  ];

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${scrolled ? "pt-2" : "pt-6"} px-4`}>
        <nav 
          className={`
            w-full max-w-6xl rounded-2xl transition-all duration-500 border backdrop-blur-xl
            ${scrolled 
              ? "bg-[#0A0A0A]/80 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3" 
              : "bg-transparent border-transparent py-4"
            }
          `}
        >
          <div className="relative flex items-center justify-between px-6">
            
            {/* === LOGO === */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl  flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <img src="logo/logo_bg.png" alt="" />
              </div>
              <span className="text-white font-bold text-lg tracking-wide hidden md:block group-hover:text-primary transition-colors">
                AI PROMPT COMBAT 2.0
              </span>
            </Link>

            {/* === DESKTOP LINKS === */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-sm font-medium text-gray-300 hover:text-primary transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
                >
                  {link.name}
                </a>
              ))}

              {/* ✅ LEADERBOARD LINK (Only if Logged In) */}
              {/* {currentUser && (
                <Link 
                    to="/leaderboard" // Make sure this route exists in App.js
                    className="flex items-center gap-2 text-sm font-medium text-[#D4AF37] hover:text-white transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all hover:after:w-full"
                >
                    <Trophy size={16} /> Leaderboard
                </Link>
              )} */}
            </div>

            {/* === ACTION BUTTONS (Desktop) === */}
            {/* <div className="hidden lg:block">
              {currentUser ? (
                <div className="flex items-center gap-4">
                    <Link to="/lobby">
                        <button className="cursor-pointer px-6 py-2.5 rounded-xl bg-primary text-black font-bold text-sm hover:bg-black hover:text-primary border-2 border-primary hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                            Dashboard <LayoutDashboard size={16} />
                        </button>
                    </Link>
                    
                    <button 
                        onClick={handleLogout}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-all cursor-pointer"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-sm font-bold text-gray-300 hover:text-white transition-colors">
                        Login
                    </Link>
                    <Link to="/register">
                        <button className="px-6 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-primary hover:text-black hover:border-primary transition-all flex items-center gap-2">
                            Register Now <ChevronRight size={16} />
                        </button>
                    </Link>
                </div>
              )}
            </div> */}

            {/* === MOBILE MENU TOGGLE === */}
            <button 
              className="lg:hidden p-2 text-white hover:text-primary transition-colors" 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* === MOBILE MENU OVERLAY === */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl pt-28 px-8 lg:hidden flex flex-col items-center animate-in fade-in slide-in-from-top-10 duration-300">
            
            <div className="flex flex-col items-center gap-8 mb-10 w-full">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-bold text-gray-300 hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
              
              {currentUser && (
                  <Link 
                    to="/leaderboard"
                    onClick={() => setIsOpen(false)}
                    className="text-2xl font-bold text-[#D4AF37] hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Trophy size={24} /> Leaderboard
                  </Link>
              )}
            </div>

            {/* <div className="w-full max-w-xs flex flex-col gap-4">
              {currentUser ? (
                <>
                    <Link to="/lobby" onClick={() => setIsOpen(false)}>
                        <button className="w-full py-4 rounded-xl bg-primary text-black font-bold text-lg shadow-lg flex items-center justify-center gap-2">
                            <LayoutDashboard size={20} /> Dashboard
                        </button>
                    </Link>
                    
                    <button 
                        onClick={handleLogout}
                        className="w-full py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-bold text-lg flex items-center justify-center gap-2 transition-all"
                    >
                        Logout <LogOut size={20} />
                    </button>
                </>
              ) : (
                <>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                        <button className="w-full py-4 rounded-xl bg-primary text-black font-bold text-lg shadow-lg flex items-center justify-center gap-2">
                            Register Now <ChevronRight size={20} />
                        </button>
                    </Link>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                        <button className="w-full py-4 rounded-xl bg-[#111] border border-white/20 text-white font-bold text-lg flex items-center justify-center gap-2">
                            Login <LogIn size={20} />
                        </button>
                    </Link>
                </>
              )}
            </div> */}
        </div>
      )}
    </>
  );
};

export default Navbar;