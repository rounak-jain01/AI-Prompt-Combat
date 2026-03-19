import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Crown, ArrowUpRight } from "lucide-react";

const sponsors = [
  {
    name: "Hotel Maruti Palace",
    logo: "/sponsor/sponsor.png",
    tier: "Gold Sponsor",
    href: "https://share.google/K5wsVpH6pbM3Yhsem",
  },
];

const tierStyles = {
  "Gold Sponsor":
    "bg-gradient-to-r from-[#D4AF37] to-[#F4CF57] text-black shadow-[0_0_25px_rgba(212,175,55,0.45)]",
  Partner: "bg-white/10 text-gray-100 border border-white/10",
};

const SponsorsSection = () => {
  return (
    <section id="sponsors" className="relative py-24 bg-[#050505] overflow-hidden">
      {/* Background FX */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-0 w-72 h-72 bg-[#D4AF37] rounded-full blur-[140px] opacity-[0.10]" />
        <div className="absolute -bottom-40 right-0 w-80 h-80 bg-[#D4AF37] rounded-full blur-[160px] opacity-[0.08]" />
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-10 left-1/4 w-px h-40 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent" />
          <div className="absolute bottom-16 right-1/5 w-px h-52 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent" />
          <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        {[...Array(16)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#D4AF37]"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
              scale: 0.4,
            }}
            animate={{
              y: [null, "-20vh"],
              opacity: [0, 0.7, 0],
              scale: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              delay: Math.random() * 4,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
            <Sparkles size={16} className="text-[#D4AF37]" />
            <span className="text-[11px] tracking-[0.25em] uppercase text-gray-300">
              Sponsors
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold mb-3 bg-gradient-to-r from-[#F5E6A5] via-[#D4AF37] to-[#F5E6A5] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(212,175,55,0.55)]">
            Our Sponsors
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            Proudly supported by our valued partners who make{" "}
            <span className="text-[#D4AF37] font-semibold">
              AI Prompt Combat 2.0
            </span>{" "}
            possible.
          </p>
        </motion.div>

        {/* Cards (always centered, wraps to 1–3 per row) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.12 },
            },
          }}
          className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto"
        >
          {sponsors.map((sponsor) => (
            <motion.a
              key={sponsor.name}
              href={sponsor.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={{
                hidden: { opacity: 0, y: 26 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -6, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="relative group w-full max-w-md"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#D4AF37]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-400 pointer-events-none" />

              <div className="relative h-full rounded-3xl bg-black/70 border border-white/10 group-hover:border-[#D4AF37]/70 shadow-[0_18px_45px_-25px_rgba(0,0,0,0.9)] overflow-hidden backdrop-blur-md transition-all duration-300">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute -left-1/3 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-120%" }}
                    whileHover={{ x: "180%" }}
                    transition={{
                      duration: 1.2,
                      ease: "easeInOut",
                    }}
                  />
                </div>

                <div className="relative flex flex-col items-center text-center px-8 py-8 md:py-9 gap-4">
                  <div className="flex items-center justify-between w-full mb-2">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.18em] ${
                        tierStyles[sponsor.tier] || tierStyles["Partner"]
                      }`}
                    >
                      {sponsor.tier === "Gold Sponsor" && (
                        <Crown size={12} className="inline-block" />
                      )}
                      <span>{sponsor.tier}</span>
                    </div>
                    <span className="hidden md:inline text-[10px] uppercase tracking-[0.2em] text-gray-500">
                      Sponsor
                    </span>
                  </div>

                  <div className="relative w-full flex items-center justify-center mb-2">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="max-h-20 md:max-h-24 w-auto object-contain drop-shadow-[0_0_22px_rgba(212,175,55,0.18)]"
                    />
                  </div>

                  <div className="space-y-1">
                    {/* <h3 className="text-white text-lg md:text-xl font-semibold tracking-wide">
                      {sponsor.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Empowering innovation, creativity & next‑gen AI talent.
                    </p> */}
                    <p className="text-xs text-gray-300 mt-3">
                      Visit for{" "}
                      <span className="text-white font-semibold">Marriage</span>,{" "}
                      <span className="text-white font-semibold">Party</span> &{" "}
                      <span className="text-white font-semibold">Function</span>{" "}
                      bookings.
                    </p>
                  </div>

                  <div className="mt-4 w-full flex items-center justify-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-white transition-all duration-300 group-hover:border-[#D4AF37]/60 group-hover:bg-[#D4AF37]/10">
                      Visit Sponsor Page <ArrowUpRight size={18} className="text-[#D4AF37]" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
          className="mt-16 flex flex-col items-center gap-4 text-center"
        >
          <p className="text-gray-400 text-sm md:text-base">
            Interested in supporting{" "}
            <span className="text-[#D4AF37] font-semibold">
              AI Prompt Combat 2.0
            </span>
            ? Let’s build something iconic together.
          </p>
          <a
            href="mailto:kagglekoders@gmail.com?subject=AI%20Prompt%20Combat%202.0%20Sponsorship"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F4CF57] to-[#D4AF37] text-black font-semibold text-sm md:text-base shadow-[0_0_35px_rgba(212,175,55,0.55)] border border-[#F5E6A5]/60 transition-all duration-300 hover:shadow-[0_0_55px_rgba(212,175,55,0.8)] hover:-translate-y-0.5"
          >
            Partner With Us
            <span className="text-lg leading-none">↗</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default SponsorsSection;

