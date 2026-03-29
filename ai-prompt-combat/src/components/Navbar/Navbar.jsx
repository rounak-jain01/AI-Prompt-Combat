import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Trophy } from 'lucide-react'; // Hataye gaye: LayoutDashboard, LogIn
import { useAuthState } from "react-firebase-hooks/auth"; 
import { auth } from "../../firebase";
import { useAuth } from '../../context/AuthContext'; 
import { signOut } from "firebase/auth"; 

const Navbar = () => {
  const [user] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); 
      setIsOpen(false); 
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

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
            
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <img src="logo/logo_bg.png" alt="AI Prompt Combat Logo" />
              </div>
              <span className="text-white font-bold text-lg tracking-wide hidden md:block group-hover:text-[#D4AF37] transition-colors">
                AI PROMPT COMBAT 2.0
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-sm font-medium text-gray-300 hover:text-[#D4AF37] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#D4AF37] after:transition-all hover:after:w-full"
                >
                  {link.name}
                </a>
              ))}

              {currentUser && (
                <Link 
                    to="/leaderboard" 
                    className="flex items-center gap-2 text-sm font-medium text-[#D4AF37] hover:text-white transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all hover:after:w-full"
                >
                    <Trophy size={16} /> Leaderboard
                </Link>
              )}
            </div>

            <div className="hidden lg:block">
              {/* ✅ SIRF LOGOUT DIKHEGA AGAR USER LOGIN HAI TAHI */}
              {currentUser && (
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-sm hover:bg-red-500/20 transition-all cursor-pointer"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
              )}
            </div>
            
            <button 
              className="lg:hidden p-2 text-white hover:text-[#D4AF37] transition-colors cursor-pointer" 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* === MOBILE MENU (FIXED) === */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-[#050505] flex flex-col items-center justify-center px-6 lg:hidden h-screen overflow-y-auto">
            
            <div className="flex flex-col items-center gap-6 mb-12 w-full mt-16">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-bold text-gray-300 hover:text-[#D4AF37] transition-colors"
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

            <div className="w-full max-w-xs flex flex-col gap-4 pb-8">
              {/* ✅ SIRF LOGOUT DIKHEGA AGAR USER LOGIN HAI */}
              {currentUser && (
                <button 
                    onClick={handleLogout}
                    className="w-full py-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500/20 font-bold text-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                    <LogOut size={20} /> Logout
                </button>
              )}
            </div>
        </div>
      )}
    </>
  );
};

export default Navbar;