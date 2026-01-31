import React from 'react';
import { motion } from 'framer-motion';
import { Users, Filter, Trophy, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    id: "01",
    title: "Round 1: Open Competition",
    subtitle: "Open for All",
    description: "All registered participants compete in the initial challenge. Demonstrate your prompt engineering skills and climb the leaderboard.",
    icon: Users,
    points: [
      "Open to all registered participants",
      "Timed submission window",
      "Automated scoring system",
      "Live leaderboard updates"
    ]
  },
  {
    id: "02",
    title: "Round 2: Shortlisted Finals",
    subtitle: "Top Performers Only",
    description: "Top performers from Round 1 advance to face more complex challenges with higher stakes and manual evaluation.",
    icon: Filter,
    points: [
      "Top performers only",
      "Advanced challenges",
      "Manual + automated evaluation",
      "Higher weight scoring"
    ]
  },
  {
    id: "03",
    title: "Winner Announcement",
    subtitle: "Grand Finale",
    description: "Champions are crowned and rewarded for their exceptional prompt engineering abilities.",
    icon: Trophy,
    points: [
      "Cash prizes & Goodies",
      "Certificates of excellence",
      "Community recognition",
      "Exclusive opportunities"
    ]
  }
];

const Timeline = () => {
  return (
    <section className="relative py-24 bg-dark overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-100 bg-primary rounded-full blur-[180px] opacity-5 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block"
          >
            Competition Format
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-6"
          >
            How It <span className="text-primary">Works</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-lg"
          >
            A two-round elimination format designed to identify the most skilled prompt engineers.
          </motion.p>
        </div>

        {/* CARDS CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          
          {/* CONNECTING LINE (Desktop Only) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-primary/30 to-transparent -z-10" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              {/* STEP NUMBER BADGE */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-dark border-2 border-primary flex items-center justify-center text-primary font-bold z-10 shadow-[0_0_20px_rgba(212,175,55,0.3)] group-hover:scale-110 transition-transform duration-300">
                {step.id}
              </div>

              {/* MAIN CARD */}
              <div className="h-full mt-6 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 group-hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                
                {/* ICON & TITLE */}
                <div className="text-center mb-6">
                  <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                    <step.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{step.title}</h3>
                  <span className="text-xs font-bold text-primary tracking-widest uppercase">{step.subtitle}</span>
                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-400 text-sm text-center mb-8 leading-relaxed">
                  {step.description}
                </p>

                {/* BULLET POINTS */}
                <ul className="space-y-3">
                  {step.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Timeline;