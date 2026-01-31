import React from 'react';
import { motion } from 'framer-motion';
import { Users, Crown, Hash, Sparkles } from 'lucide-react';

// ==================== DATA SECTIONS ====================

// 1. TOP LEADERSHIP (President, VP, etc.)
const coreLeaders = [
  { name: "Vipin Tomar", role: "President", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?fit=crop&w=300&h=300" },
  { name: "Priyani Rathod", role: "Vice President", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=300&h=300" },
  { name: "Rishu Pandey", role: "General Secretary", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?fit=crop&w=300&h=300" },
  { name: "Deepika Vishwakarma", role: "Research Lead", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fit=crop&w=300&h=300" },
  { name: "Rounak Jain", role: "Technical Lead", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=300&h=300" },
];

// 2. FIRST BATCH MEMBERS
const teamMembers1 = [
  { name: "Aayesh Ali", role: "Member" },
  { name: "Aishwary Kumar", role: "Member" },
  { name: "Anshul Soni", role: "Member" },
  { name: "Iram Khan", role: "Member" },
  { name: "Prateek Singh", role: "Member" },
  { name: "Priyanshu Kesharwani", role: "Member" },
  { name: "Raju Meena", role: "Member" },
  { name: "Rishabh Vishwakarma", role: "Member" },
  { name: "Rahma Aziz", role: "Member" },
  { name: "Tanisha Namdev", role: "Member" },
  { name: "Ved Yadav", role: "Member" },
];

// 3. DEPARTMENT LEADS
const deptLeads = [
  { name: "Devansh Mishra", role: "Discipline Lead", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=300&h=300" },
  { name: "Hemant Mohane", role: "Social Media Lead", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&h=300" },
  { name: "Priyanka Vishwakarma", role: "Decoration Lead", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fit=crop&w=300&h=300" },
  { name: "Sakshi Mishra", role: "Photography Lead", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=300&h=300" },
  { name: "Shivam Kahar", role: "Anchoring Lead", image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?fit=crop&w=300&h=300" },
];

// 4. SECOND BATCH MEMBERS
const teamMembers2 = [
  { name: "Aarti Keswani", role: "Member" },
  { name: "Alisha Khan", role: "Member" },
  { name: "Anshu Malviya", role: "Member" },
  { name: "Archana Mehra", role: "Member" },
  { name: "Arjit Tripathi", role: "Member" },
  { name: "Hiba Hasan", role: "Member" },
  { name: "Jiya Ali", role: "Member" },
  { name: "Kahkasha Begum", role: "Member" },
  { name: "Mansi Nair", role: "Member" },
  { name: "Sameer Gupta", role: "Member" },
];

// Helper Component for Cards
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
      <div className={`
        relative overflow-hidden rounded-full border-2 transition-all duration-300
        ${isLeader ? 'w-32 h-32 md:w-40 md:h-40 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'w-24 h-24 md:w-28 md:h-28 border-white/20 group-hover:border-[#D4AF37]/50'}
      `}>
        <img 
          src={member.image || `https://ui-avatars.com/api/?name=${member.name}&background=111&color=fff`} 
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Leader Badge (Gold Circle Icon) */}
      {isLeader && (
        <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-black shadow-lg z-10">
          <Crown size={14} fill="black" />
        </div>
      )}
    </div>

    {/* Name & Role */}
    <h3 className={`font-bold text-white transition-colors group-hover:text-[#D4AF37] ${isLeader ? 'text-lg md:text-xl' : 'text-base md:text-lg'}`}>
      {member.name}
    </h3>
    <p className={`text-[#D4AF37] font-medium tracking-wide uppercase ${isLeader ? 'text-xs md:text-sm mt-1' : 'text-[10px] md:text-xs mt-0.5 opacity-80'}`}>
      {member.role}
    </p>
  </motion.div>
);

const Team = () => {
  return (
    <section className="relative py-24 bg-[#050505] overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#D4AF37] rounded-full blur-[180px] opacity-5 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* MAIN TITLE */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Users size={16} className="text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs md:text-sm">
              Our Team
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Meet Our <span className="text-[#D4AF37]">Team</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            The passionate individuals behind AI Prompt Combat, dedicated to making this event a success.
          </p>
        </div>

        {/* 1. CORE LEADERSHIP */}
        <div className="mb-20">
          <div className="flex items-center justify-center gap-2 mb-10">
            <Crown size={18} className="text-[#D4AF37]" />
            <h3 className="text-xl md:text-2xl font-bold text-white">Leadership Team</h3>
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
            <Hash size={18} className="text-[#D4AF37]" />
            <h3 className="text-lg md:text-xl font-bold text-white">Team Members</h3>
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
            <Sparkles size={18} className="text-[#D4AF37]" />
            <h3 className="text-xl md:text-2xl font-bold text-white">Leadership Team</h3>
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
            <Hash size={18} className="text-[#D4AF37]" />
            <h3 className="text-lg md:text-xl font-bold text-white">Team Members</h3>
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