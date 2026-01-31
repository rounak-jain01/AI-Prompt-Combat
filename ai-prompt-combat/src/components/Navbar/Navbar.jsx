import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll Detection for Glass Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Updated Links to match LandingPage.jsx IDs
  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Format", href: "#format" },
    { name: "Timeline", href: "#timeline" },
    { name: "Prizes", href: "#prizes" },
    { name: "Team", href: "#team" },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4">
        <nav
          className={`
            w-full max-w-5xl rounded-2xl transition-all duration-500 border
            ${
              scrolled
                ? "bg-black/60 border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                : "bg-white/5 border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
            }
            /* ULTRA FROSTED GLASS EFFECT */
            backdrop-blur-[10px] backdrop-saturate-150
          `}
        >
          {/* Glass Noise Texture (Optional) */}
          <div className="absolute inset-0 rounded-2xl bg-white/5 pointer-events-none" />

          <div className="relative flex items-center justify-center md:justify-between px-6 py-3 md:py-4">
            {/* LOGO */}
            <a
              href="#home"
              className="flex items-center gap-3 cursor-pointer group mr-auto md:mr-0"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-primary to-[#8a6e15] shadow-lg group-hover:shadow-primary/50 transition-shadow duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-display font-bold text-lg leading-none tracking-wide drop-shadow-lg">
                  AI PROMPT
                </span>
                <span className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase">
                  Combat
                </span>
              </div>
            </a>

            {/* DESKTOP MENU */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative group text-sm font-medium text-gray-200 hover:text-primary transition-colors duration-300 drop-shadow-md"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* CTA BUTTON */}
            <div className="hidden lg:block ml-auto md:ml-0">
              <Link to="/register">
                <button className="group relative px-7 py-2.5 overflow-hidden rounded-xl bg-primary border border-primary text-black font-bold text-sm shadow-[0_0_20px_-5px_#D4AF37] transition-all duration-300 hover:shadow-[0_0_30px_-5px_#D4AF37]">
                  {/* BLACK FILL FROM BOTTOM HOVER */}
                  <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

                  <span className="relative z-10 flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                    Register Now
                    <ChevronRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </button>
              </Link>
            </div>

            {/* MOBILE TOGGLE */}
            <button
              className="lg:hidden ml-auto p-2 text-white bg-white/10 border border-white/10 rounded-xl backdrop-blur-md hover:bg-white/20"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* MOBILE MENU - Heavy Glass */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-28 left-4 right-4 z-40 lg:hidden"
          >
            <div className="bg-[#121212]/80 backdrop-blur-[50px] backdrop-saturate-150 border border-white/10 rounded-2xl p-5 shadow-2xl">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center justify-between p-4 text-gray-200 border-b border-white/5 hover:text-primary transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="font-medium">{link.name}</span>
                    <ChevronRight size={16} />
                  </a>
                ))}
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <button className="w-full py-4 mt-4 bg-primary text-black font-bold rounded-xl active:scale-95 transition-transform">
                    Register Now
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
