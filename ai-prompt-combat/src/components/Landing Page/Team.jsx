import React from "react";
import { motion } from "framer-motion";
import { Users, Crown, Hash, Sparkles } from "lucide-react";

// ==================== DATA SECTIONS ====================

// 1. TOP LEADERSHIP (President, VP, etc.)
const coreLeaders = [
  {
    name: "Vipin Tomar",
    role: "President",
    image: "/team/Kaggle Koders/Vipin_Tomar_President.jpg",
  },
  {
    name: "Priyani Rathod",
    role: "Vice President",
    image: "/team/Kaggle Koders/Priyani_Rathod_Vice-President.png",
  },
  {
    name: "Rounak Jain",
    role: "Technical Lead",
    image: "/team/Kaggle Koders/Rounak_Jain_Technical Lead.jpeg",
  },
  {
    name: "Rishu Pandey",
    role: "General Secretary",
    image: "/team/Kaggle Koders/Rishu_Pandey_General Secretary.jpg",
  },
  {
    name: "Deepika Vishwakarma",
    role: "Research Lead",
    image: "/team/Kaggle Koders/Deepika_Vishwakarma_Research_Lead.jpg",
  },
];

// 2. FIRST BATCH MEMBERS
const teamMembers1 = [
  {
    name: "Aayesh Ali",
    role: "Member",
    image: "/team/Kaggle Koders/Aayezah_Ali.jpg",
  },
  {
    name: "Aishwary Kumar",
    role: "Member",
    image: "/team/Kaggle Koders/Aishwary_kumar.jpg",
  },
  {
    name: "Anshul Soni",
    role: "Member",
    image: "/team/Kaggle Koders/Anshul_Soni.jpg",
  },
  {
    name: "Iram Khan",
    role: "Member",
    image: "/team/Kaggle Koders/Iram_khan.png",
  },
  {
    name: "Prateek Singh",
    role: "Member",
    image: "/team/Kaggle Koders/Prateek_Singh.jpg",
  },
  {
    name: "Priyanshu Kesharwani",
    role: "Member",
    image: "/team/Kaggle Koders/Priyanshu_Kesharwani.jpg",
  },
  {
    name: "Raju Meena",
    role: "Member",
    image: "/team/Kaggle Koders/Raju_meena.jpg",
  },
  {
    name: "Rishabh Vishwakarma",
    role: "Member",
    image: "/team/Kaggle Koders/Rishabh_Vishwakarma.png",
  },
  {
    name: "Rahma Aziz",
    role: "Member",
    image: "/team/Kaggle Koders/Rohma_aziz.png",
  },
  {
    name: "Tanisha Namdev",
    role: "Member",
    image: "/team/Kaggle Koders/Tanisha_Narnaware.png",
  },
  {
    name: "Ved Yadav",
    role: "Member",
    image: "/team/Kaggle Koders/Ved_Yadav.jpg",
  },
  {
    name: "Yash Vishwakarma",
    role: "Member",
    image: "/team/Kaggle Koders/Yash_Vishwakarma.png",
  },
];

// 3. DEPARTMENT LEADS
const deptLeads = [
  {
    name: "Priyanka Vishwakarma",
    role: "Decoration Lead",
    image: "/team/Kalasarthi/Priyanka Vishwakarma(Decoration & Creative).png",
  },
  {
    name: "Devansh Mishra",
    role: "Discipline Lead",
    image: "/team/Kalasarthi/Devansh_Mishra(Discipline Lead).png",
  },
  {
    name: "Hemant Mohane",
    role: "Social Media Lead",
    image: "/team/Kalasarthi/Hemant_Mohane(Social Media & Management Lead).jpg",
  },
  {
    name: "Shivam Kahar",
    role: "Anchoring Lead",
    image: "/team/Kalasarthi/Shivam Kahar(Anchoring Lead).jpg",
  },
  {
    name: "Sakshi Mishra",
    role: "Photography Lead",
    image: "/team/Kalasarthi/Sakshi Mishra (Photography Lead).png",
  },
];

// 4. SECOND BATCH MEMBERS
const teamMembers2 = [
  {
    name: "Aarti Keswani",
    role: "Member",
    image: "/team/Kalasarthi/Aarti_Keswani.png",
  },
  {
    name: "Alisha Khan",
    role: "Member",
    image: "/team/Kalasarthi/Alisha_Khan.jpg",
  },
  {
    name: "Anshu Malviya",
    role: "Member",
    image: "/team/Kalasarthi/Anshu_Malviya.png",
  },
  {
    name: "Archana Mehra",
    role: "Member",
    image: "/team/Kalasarthi/Archana_Mehra.png",
  },
  {
    name: "Arjit Tripathi",
    role: "Member",
    image: "/team/Kalasarthi/Arjit_tripathi.png",
  },
  {
    name: "Hifza Hasan",
    role: "Member",
    image: "/team/Kalasarthi/Hifza_hasan.png",
  },
  {
    name: "Ilya Ali",
    role: "Member",
    image: "/team/Kalasarthi/Ilya_ali.png",
  },
  {
    name: "Kahkasha Begum",
    role: "Member",
    image: "/team/Kalasarthi/Kahkasha_Begum.png",
  },
  {
    name: "Mansi Nair",
    role: "Member",
    image: "/team/Kalasarthi/Mansi_Nair.png",
  },
  {
    name: "Sameer Gupta",
    role: "Member",
    image: "/team/Kalasarthi/Sameer_Gupta.png",
  },
];

const MemberCard = ({ member, isLeader = false }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="flex flex-col items-center text-center group"
  >
    <div className="relative mb-4">
      {/* Image Container */}
      <div
        className={`
        relative overflow-hidden rounded-full border-2 transition-all duration-300
        ${isLeader ? "w-32 h-32 md:w-40 md:h-40 border-primary shadow-[0_0_20px_rgba(212,175,55,0.2)]" : "w-24 h-24 md:w-28 md:h-28 border-white/20 group-hover:border-primary/50"}
      `}
      >
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Leader Badge  */}
      {isLeader && (
        <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black shadow-lg z-10">
          <Crown size={14} fill="black" />
        </div>
      )}
    </div>

    {/* Name & Role */}
    <h3
      className={`font-bold text-white transition-colors group-hover:text-primary ${isLeader ? "text-lg md:text-xl" : "text-base md:text-lg"}`}
    >
      {member.name}
    </h3>
    <p
      className={`text-primary font-medium tracking-wide uppercase ${isLeader ? "text-xs md:text-sm mt-1" : "text-[10px] md:text-xs mt-0.5 opacity-80"}`}
    >
      {member.role}
    </p>
  </motion.div>
);

const Team = () => {
  return (
    <section className="relative py-24 bg-dark overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 right-0 w-125 h-125 bg-primary rounded-full blur-[180px] opacity-5 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* MAIN TITLE */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Users size={16} className="text-primary" />
            <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs md:text-sm">
              Our Team
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Meet Our <span className="text-primary">Team</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            The passionate individuals behind AI Prompt Combat 2.0, dedicated to
            making this event a success.
          </p>
        </div>

        {/* 1. CORE LEADERSHIP */}
        <div className="mb-20">
          <div className="flex items-center justify-center gap-2 mb-10">
            <Crown size={18} className="text-primary" />
            <h3 className="text-xl md:text-2xl font-bold text-white">
              Leadership Team
            </h3>
          </div>
          <div className="flex flex-wrap justify-center gap-10 md:gap-16">
            {coreLeaders.map((member, idx) => (
              <MemberCard key={idx} member={member} isLeader={true} />
            ))}
          </div>
        </div>

        {/* 2. TEAM MEMBERS BATCH 1 */}
        <div className="mb-20">
          <div className="flex items-center justify-center gap-2 mb-10">
            <Hash size={18} className="text-primary" />
            <h3 className="text-lg md:text-xl font-bold text-white">
              Team Members
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10 justify-items-center">
            {teamMembers1.map((member, idx) => (
              <MemberCard key={idx} member={member} />
            ))}
          </div>
        </div>

        {/* 3. DEPARTMENT LEADS */}
        <div className="mb-20">
          <div className="flex items-center justify-center gap-2 mb-10">
            <Sparkles size={18} className="text-primary" />
            <h3 className="text-xl md:text-2xl font-bold text-white">
              Leadership Team
            </h3>
          </div>
          <div className="flex flex-wrap justify-center gap-10 md:gap-16">
            {deptLeads.map((member, idx) => (
              <MemberCard key={idx} member={member} isLeader={true} />
            ))}
          </div>
        </div>

        {/* 4. TEAM MEMBERS BATCH 2 */}
        <div>
          <div className="flex items-center justify-center gap-2 mb-10">
            <Hash size={18} className="text-primary" />
            <h3 className="text-lg md:text-xl font-bold text-white">
              Team Members
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10 justify-items-center">
            {teamMembers2.map((member, idx) => (
              <MemberCard key={idx} member={member} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
