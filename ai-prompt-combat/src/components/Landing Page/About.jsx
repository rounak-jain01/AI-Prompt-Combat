import React from "react";
import { motion } from "framer-motion";
import { Brain, Target, Lightbulb, Award, Shield, Zap } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="relative py-24 bg-dark overflow-hidden">
      <div className="absolute top-0 left-0 w-125 h-125 bg-primary rounded-full blur-[150px] opacity-5 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-125 h-125 bg-purple-900 rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
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
            What is{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-[#F4CF57]">
              AI Prompt Combat 2.0?
            </span>
          </motion.h2>
        </div>

        {/* Main description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16"
        >
          <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6">
            In our daily lives, we interact with AI models more often than we realize whether it's <span className="text-white font-medium">generating images, writing content, or asking for creative ideas.</span> But did you know that writing the <span className="text-primary font-semibold"> right prompt is actually a skill?</span>
          </p>

          <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6">
            This event is designed to test and improve student's <span className="text-white font-medium">Prompt Engineering skills </span> the ability to give clear and effective instructions to AI models to generate accurate visuals and motion graphics.
          </p>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6">
            Unlike traditional coding Competition, this competition focuses on creativity, clarity, and smart prompting rather than programming.
          </p>

          <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6">
            To ensure a smooth and transparent experience, the entire event will be conducted on a <span className="text-white font-medium">custom-built web portal </span> featuring real-time updates, live leaderboards, and automated access control.
          </p>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            If you're <span className="text-primary font-semibold">curious about AI </span> and want to see <span className="text-primary font-semibold">how powerful your prompts </span> can be, this event is the perfect opportunity to experiment, compete, and showcase your skills!
          </p>
        </motion.div>

        {/* Phase cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Target,
              title: "Phase 1: AI Image Generation",
              desc: "All registered participants log into the official portal and create stunning, high-fidelity images based on complex visual prompts or reference themes. Submissions are graded by the judging panel and scores appear instantly on the Live Global Leaderboard.",
            },
            {
              icon: Shield,
              title: "Elimination Protocol",
              desc: "Phase 2 features strict automated access control. Based on Phase 1 leaderboard standings, only the Top 'N' performers (e.g., Top 20/50) automatically unlock access to the final round. The rest are restricted by the system.",
            },
            {
              icon: Zap,
              title: "Phase 2: AI Video Generation",
              desc: "Qualified finalists advance to the Video Synthesis round. Participants generate short, high-quality video artifacts matching specific reference content or complex motion prompts, and submit both the video URL and the exact text prompt via the portal.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-12 h-12 mb-6 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                <item.icon className="w-6 h-6 text-primary group-hover:text-black transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;