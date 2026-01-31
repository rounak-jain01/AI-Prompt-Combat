import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, UserPlus, Swords, Filter, Trophy } from 'lucide-react';

const events = [
  {
    date: "Jan 15 - Jan 25",
    title: "Registration Opens",
    description: "Sign up and prepare for the ultimate prompt engineering challenge.",
    icon: UserPlus,
    color: "#D4AF37"
  },
  {
    date: "Jan 28",
    title: "Round 1 Begins",
    description: "All participants compete in the initial prompt engineering challenge.",
    icon: Swords,
    color: "#F4CF57"
  },
  {
    date: "Jan 30",
    title: "Shortlisting",
    description: "Top performers are selected to advance to the final round.",
    icon: Filter,
    color: "#D4AF37"
  },
  {
    date: "Feb 2",
    title: "Round 2 Finals",
    description: "Elite competitors face advanced challenges in the final showdown.",
    icon: Swords,
    color: "#F4CF57"
  },
  {
    date: "Feb 5",
    title: "Winners Announced",
    description: "Champions are crowned and prizes distributed.",
    icon: Trophy,
    color: "#FFD700"
  }
];

const ImportantDates = () => {
  return (
    <section className="relative py-24 bg-[#050505] overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[800px] bg-[#D4AF37] rounded-full blur-[200px] opacity-5 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-sm mb-4 block"
          >
            Event Timeline
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-6"
          >
            Important <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4CF57]">Dates</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-lg"
          >
            Mark your calendar and don't miss any key milestones in the competition.
          </motion.p>
        </div>

        {/* TIMELINE CONTAINER */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* VERTICAL GLOWING LINE (Center for Desktop, Left for Mobile) */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 md:-ml-0.5 bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent shadow-[0_0_15px_#D4AF37]" />

          <div className="space-y-12">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                
                {/* 1. CONTENT CARD */}
                <div className="w-full md:w-[calc(50%-40px)] pl-20 md:pl-0">
                  <div className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(212,175,55,0.2)] backdrop-blur-sm overflow-hidden">
                    
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                      {/* Date Badge */}
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold mb-4">
                        <Calendar size={12} />
                        {event.date}
                      </div>

                      {/* Title & Icon */}
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                          {event.title}
                        </h3>
                        <event.icon className="w-6 h-6 text-gray-500 group-hover:text-[#D4AF37] transition-colors" />
                      </div>

                      <p className="text-gray-400 text-sm leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. CENTER NODE (Dot) */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-[#050505] border-2 border-[#D4AF37] shadow-[0_0_15px_#D4AF37] z-20">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
                </div>

                {/* 3. EMPTY SPACE (For layout balance) */}
                <div className="hidden md:block w-[calc(50%-40px)]" />
                
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ImportantDates;