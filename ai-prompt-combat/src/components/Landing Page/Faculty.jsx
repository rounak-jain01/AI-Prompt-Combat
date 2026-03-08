import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Crown, Code2, Palette } from "lucide-react";

// Faculty members: HOD, Kaggle Koders coordinator, Kalasarthi coordinator
const facultyMembers = [
  {
    name: "Dr. Vasima Khan",
    role: "Head of Department",
    subtitle: "AI & Data Science Department, SISTec",
    image: "faculty/faculty/Dr. Vasima Khan.jpg",
    description:
      'A distinguished academician with over 14 years of experience in Artificial Intelligence, Machine Learning, and Natural Language Processing. With an impressive research portfolio including 20+ publications, patents, and the prestigious "Best Teacher Award," she continues to inspire innovation and academic excellence. Through her visionary leadership and mentorship, she empowers students to bridge the gap between technical expertise and creative problem-solving, fostering a culture of research, learning, and innovation.',
    icon: Crown,
    badge: "HOD",
  },
  {
    name: "Ms. Ruchi Jain",
    role: "Faculty Coordinator",
    subtitle: "Kaggle Koders, CSE–AIDS Department",
    image: "faculty/faculty/Ms. Ruchi Jain.jpeg",
    description:
      "With her strong academic guidance and dedication to student development, she plays a vital role in mentoring aspiring technologists and fostering a culture of innovation, collaboration, and continuous learning within the community.",
    icon: Code2,
    badge: "Kaggle Koders",
  },
  {
    name: "Ms. Madhuri Walia",
    role: "Faculty Coordinator",
    subtitle: "Kalasarthi, CSE–AIDS Department",
    image: "faculty/faculty/Ms. Madhuri Walia.jpeg",
    description:
      "With her dedication to creativity and student engagement, she actively mentors and guides students, encouraging artistic expression, cultural participation, and holistic development within the campus community.",
    icon: Palette,
    badge: "Kalasarthi",
  },
];

const FacultyCard = ({ member, index }) => {
  const Icon = member.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-[#080808] border border-white/[0.06] hover:border-primary/30 transition-all duration-500 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] hover:shadow-[0_0_60px_-12px_rgba(212,175,55,0.12)]"
    >
      <div className="flex flex-col lg:flex-row lg:min-h-0">
        {/* Image – full-height column, generous width */}
        <div className="relative flex-shrink-0 w-full lg:w-[420px] xl:w-[480px] h-80 sm:h-96 lg:h-[380px] xl:h-[420px] bg-[#0c0c0c]">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/80 via-transparent to-transparent lg:from-[#080808]/40 pointer-events-none" />
          <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/95 text-black text-xs font-bold uppercase tracking-wider shadow-lg">
            <Icon size={14} />
            {member.badge}
          </div>
        </div>

        {/* Content – spacious, full width */}
        <div className="flex flex-col flex-1 justify-center p-8 sm:p-10 lg:p-12 xl:p-16">
          <h3 className="text-2xl sm:text-3xl xl:text-4xl font-display font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
            {member.name}
          </h3>
          <p className="text-primary font-semibold text-sm sm:text-base uppercase tracking-widest mb-1">
            {member.role}
          </p>
          <p className="text-gray-500 text-sm mb-6">{member.subtitle}</p>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-3xl">
            {member.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Faculty = () => {
  return (
    <section className="relative py-28 sm:py-32 bg-dark overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary rounded-full blur-[200px] opacity-[0.06] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[150px] opacity-[0.04] pointer-events-none" />

      <div className="w-full max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 sm:mb-24">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap size={18} className="text-primary" />
            <span className="text-primary font-bold tracking-[0.25em] uppercase text-xs sm:text-sm">
              Our Faculty
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-display font-bold text-white mb-6">
            Guiding <span className="text-primary">Excellence</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Meet the distinguished faculty behind the AI & Data Science
            Department, guiding innovation, research, and student success at SISTec.
          </p>
        </div>

        {/* Faculty cards – full width, one after the other */}
        <div className="space-y-12 sm:space-y-16 lg:space-y-20">
          {facultyMembers.map((member, idx) => (
            <FacultyCard key={idx} member={member} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faculty;