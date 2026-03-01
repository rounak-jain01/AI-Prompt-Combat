import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';

// PLACEHOLDER DATA
const events = [
  {
    id: 1,
    title: "AI Prompt Combat 1.0",
    date: "April 2025",
    location: "Sagar Group of Institutes",
    image: "/glimse/AI Prompt Combat 1.0.jpg",
    category: "Flagship Event"
  },
  {
    id: 2,
    title: "Abhiyanta",
    date: "2023",
    location: "Sagar Group of Institutes",
    image: "glimse/Abhiyanta 2023.heic",
    category: "Event"
  },
  {
    id: 3,
    title: "AI Matrix",
    date: "2024",
    location: "Sagar Group of Institutes",
    image: "glimse/AI Matrix 2024.heic",
    category: "Event"
  },
  {
    id: 4,
    title: "Android Workshop",
    date: "2025",
    location: "Sagar Group of Institutes",
    image: "glimse/Android Workshop 2025.png",
    category: "Workshop"
  },
  {
    id: 5,
    title: "Inaugural Ceremony",
    date: "2025",
    location: "Sagar Group of Institutes",
    image: "glimse/Kaggle Koders 2025-26.jpg",
    category: "Ceremony"
  },
  {
    id: 6,
    title: "Inaugural Ceremony",
    date: "2024",
    location: "Sagar Group of Institutes",
    image: "glimse/Kaggle Koders Badge 24-25.heic",
    category: "Ceremony"
  },
  {
    id: 7,
    title: "Inaugural Ceremony",
    date: "2023",
    location: "Sagar Group of Institutes",
    image: "glimse/Kaggle Koders First Batch.heic",
    category: "Ceremony"
  },
  {
    id: 8,
    title: "ML Model Matchup",
    date: "2024",
    location: "Sagar Group of Institutes",
    image: "glimse/ML Model Matchup.heic",
    category: "Event"
  },
  {
    id: 9,
    title: "Python Code Quest",
    date: "2025",
    location: "Sagar Group of Institutes",
    image: "glimse/Python Code Quest 2025.heic",
    category: "Competition"
  },
  
];

const PastEvents = () => {
  return (
    <section className="relative py-24 bg-dark overflow-hidden">
      
      {/* Background Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-75 bg-linear-to-t from-dark to-transparent z-10" />

      <div className="container mx-auto px-6 relative z-10 mb-12">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block"
            >
              Our Legacy
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-black text-white"
            >
              Glimpses of <span className="text-transparent bg-clip-text bg-linear-to-rrom-[#D4AF37] to-[#F4CF57]">Past Events</span>
            </motion.h2>
          </div>
        </div>
      </div>

      {/* INFINITE SCROLL CAROUSEL */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-full bg-linear-to-r from-dark to-transparent z-20" />
        <div className="absolute top-0 right-0 w-32 h-full bg-linear-to-l from-dark to-transparent z-20" />

        <motion.div 
          className="flex gap-8 w-max"
          // Animation: 
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ 
            duration: 30, 
            ease: "linear", 
            repeat: Infinity 
          }}
          whileHover={{ animationPlayState: "paused" }} 
        >
          {[...events, ...events].map((event, index) => (
            <div 
              key={`${event.id}-${index}`}
              className="relative min-w-75 h-112.5 md:min-w-100 md:h-137.5 rounded-3xl overflow-hidden group border border-white/10 bg-[#111] hover:border-primary/50 transition-colors duration-300"
            >
              {/* Image */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                
                <span className="inline-block px-3 py-1 mb-3 text-xs font-bold text-black bg-primary rounded-full">
                  {event.category}
                </span>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                  {event.title}
                </h3>

                <div className="flex items-center gap-4 text-gray-300 text-sm mt-4 opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-primary" />
                    {event.location}
                  </div>
                </div>

                <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-primary group-hover:text-black group-hover:scale-110 transition-all duration-300">
                  <ArrowUpRight size={20} />
                </div>

              </div>
            </div>
          ))}
        </motion.div>
      </div>

    </section>
  );
};

export default PastEvents;