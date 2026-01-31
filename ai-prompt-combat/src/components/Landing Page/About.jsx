import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, Lightbulb, Award } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: "Prompt Engineering",
    description: "Master the art of crafting precise, effective prompts to solve complex AI challenges."
  },
  {
    icon: Target,
    title: "Real Challenges",
    description: "Face real-world problems that test your understanding of AI model capabilities."
  },
  {
    icon: Lightbulb,
    title: "Creative Solutions",
    description: "Think outside the box and develop innovative approaches to prompt optimization."
  },
  {
    icon: Award,
    title: "Recognition",
    description: "Top performers earn prizes, certificates, and recognition from the community."
  }
];

const About = () => {
  return (
    <section id="about" className="relative py-24 bg-dark overflow-hidden">
      
      {/* Background Glow Effects (Consistent with Hero) */}
      <div className="absolute top-0 left-0 w-125 h-125 bg-primary rounded-full blur-[150px] opacity-5 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-125 h-125 bg-purple-900 rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block"
          >
            About The Event
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-6"
          >
            What is <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-[#F4CF57]">AI Prompt Combat?</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-lg leading-relaxed"
          >
            A high-stakes competition where students demonstrate their prompt engineering skills by solving complex AI challenges. Compete against the best, prove your expertise, and climb the leaderboard.
          </motion.p>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.4 }} // Staggered Animation
              className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              {/* Hover Gradient Effect */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon */}
              <div className="relative w-12 h-12 mb-6 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-primary group-hover:text-black transition-colors duration-300" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default About;