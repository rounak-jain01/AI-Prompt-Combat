import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Sparkles, ChevronRight, LayoutDashboard, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Context Import zaroori hai

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser } = useAuth(); // User ka status check karne ke liye
  const navigate = useNavigate();

  // Scroll hone par Navbar ka background change hoga
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation Links
  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/#about' },
    { name: 'Timeline', href: '/#timeline' },
    { name: 'Prizes', href: '/#prizes' },
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
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-[#8a6e15] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-wide hidden md:block group-hover:text-primary transition-colors">
                AI PROMPT COMBAT
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
            </div>

            {/* === ACTION BUTTON (Dynamic Logic) === */}
            <div className="hidden lg:block">
              {currentUser ? (
                // STATE 1: USER LOGGED IN -> Show Dashboard
                <Link to="/lobby">
                  <button className="px-6 py-2.5 rounded-xl bg-primary text-black font-bold text-sm hover:bg-white hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                    Go to Dashboard <LayoutDashboard size={16} />
                  </button>
                </Link>
              ) : (
                // STATE 2: USER LOGGED OUT -> Show Register
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
            </div>

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
            
            {/* Mobile Links */}
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
            </div>

            {/* Mobile Action Buttons */}
            <div className="w-full max-w-xs flex flex-col gap-4">
              {currentUser ? (
                <Link to="/lobby" onClick={() => setIsOpen(false)}>
                  <button className="w-full py-4 rounded-xl bg-primary text-black font-bold text-lg shadow-lg flex items-center justify-center gap-2">
                    <LayoutDashboard size={20} /> Dashboard
                  </button>
                </Link>
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
            </div>
        </div>
      )}
    </>
  );
};

export default Navbar;