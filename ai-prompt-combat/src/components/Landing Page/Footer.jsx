import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Linkedin,
  Twitter,
  Instagram,
  Github,
  Heart,
  ArrowUpRight,
} from "lucide-react";

// Import Logos
import logoKaggle from "../../assets/Kagglelogo.png";
import logoKalasarthi from "../../assets/kalasarthiBadge.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: "About", href: "/#about" },
    { name: "Format", href: "/#format" },
    { name: "Tutorial", href: "/#tutorial" },
    { name: "Timeline", href: "/#timeline" },
    { name: "Prizes", href: "/#prizes" },
    { name: "Event Info", href: "/#details" },
    { name: "Organizers", href: "/#organizers" },
    { name: "Faculty", href: "/#faculty" },
    { name: "Team", href: "/#team" },
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/company/kaggle-koders/",
      color: "#0077B5",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/kaggle_koders_sistec?igsh=dTkxdWljdXNqdzFx",
      color: "#E1306C",
    },
  ];

  return (
    <footer className="relative bg-[#020202] pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-primary rounded-full blur-[150px] opacity-[0.03] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* LEFT COLUMN: BRANDING  */}
          <div className="md:col-span-5">
            {/* Logo */}
            <div className="mb-6">
              <img
                src={logoKaggle}
                alt="Kaggle Koders"
                className="h-10 w-auto"
              />
              <img
                src={logoKalasarthi}
                alt="Kaggle Koders"
                className="h-10 w-auto"
              />
            </div>

            {/* Tagline */}
            <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-[#F4CF57] mb-4 italic">
              "Crack the Code, Kaggle On!"
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              A community of passionate data scientists and AI enthusiasts
              competing, learning, and growing together to foster innovation.
            </p>

            {/* CO-ORGANIZED BY */}
            <div>
              <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4 block items-center gap-2">
                <span className="w-8 h-px bg-primary"></span>
                Co-Organized By
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <img
                    src={logoKaggle}
                    alt="Kaggle Koders"
                    className="h-6 w-6 object-contain"
                  />
                  <span className="text-sm font-bold text-gray-200">
                    Kaggle Koders
                  </span>
                </div>
                <span className="text-gray-600">×</span>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <img
                    src={logoKalasarthi}
                    alt="KalaSarthi"
                    className="h-6 w-6 object-contain rounded-full"
                  />
                  <span className="text-sm font-bold text-gray-200">
                    KalaSarthi
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN: */}
          <div className="md:col-span-3 md:pl-8">
            <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="group flex items-center gap-2 text-gray-400 hover:text-primary transition-colors duration-300 w-fit"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT COLUMN: CONTACT  */}
          <div className="md:col-span-4">
            <h4 className="text-white font-bold text-lg mb-6">Get In Touch</h4>

            {/* Email Box */}
            <a
              href="mailto:contact@kagglekoders.com"
              className="group flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 mb-8"
            >
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                <Mail size={20} />
              </div>
              <div>
                <span className="block text-xs text-gray-400 uppercase tracking-wider group-hover:text-primary">
                  Email Us
                </span>
                <span className="block text-sm md:text-base font-medium text-white">
                  kagglekoders@gmail.com
                </span>
              </div>
              <ArrowUpRight
                size={18}
                className="ml-auto text-gray-500 group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300"
              />
            </a>

            {/* Social - same card style as email */}
            <div className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300">
              <span className="block text-xs text-gray-400 uppercase tracking-wider group-hover:text-primary mb-3">
                Follow us
              </span>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ "--hover-color": social.color }}
                    className="footer-social-link w-11 h-11 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center text-gray-400 hover:-translate-y-0.5 hover:border-white/20 transition-all duration-300"
                  >
                    <social.icon
                      size={20}
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} Kaggle Koders × KalaSarthi. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <p
              href="#"
              className="text-sm text-gray-500 hover:text-primary transition-colors"
            >
              Privacy Policy
            </p>
            <p
              href="#"
              className="text-sm text-gray-500 hover:text-primary transition-colors"
            >
              Terms of Service
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-600 md:flex">
            <span>Developed with</span>
            <Heart
              size={10}
              className="text-red-500 fill-red-500 animate-pulse"
            />
            <span>
              by{" "}
              <a href="https://rounakjainportfolio.vercel.app/" target="_blank" className="text-sm text-white hover:text-primary transition-colors">
                Rounak Jain
              </a>
              {" "}
              ×
              {" "}
              <a href="https://rounakjainportfolio.vercel.app/" target="_blank" className="text-sm text-white hover:text-primary transition-colors">
                Vipin Tomar
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
