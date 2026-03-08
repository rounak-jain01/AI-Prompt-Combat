import React from "react";
import { motion } from "framer-motion";
import { Play, Film } from "lucide-react";

// Replace with your YouTube video ID (e.g. from https://www.youtube.com/watch?v=VIDEO_ID)
// or set to null to show a placeholder until you have the video
const YOUTUBE_VIDEO_ID = null; // e.g. "dQw4w9WgXcQ"

const TutorialVideo = () => {
  const embedUrl = YOUTUBE_VIDEO_ID
    ? `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0`
    : null;

  return (
    <section id="tutorial" className="relative py-24 bg-dark overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary rounded-full blur-[200px] opacity-5 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Film size={18} className="text-primary" />
            <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm">
              Watch & Learn
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-4"
          >
            How the <span className="text-primary">Competition</span> Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base md:text-lg"
          >
            Watch this short tutorial to understand the event flow, rounds, and how to participate from start to finish.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/50 shadow-[0_0_60px_-15px_rgba(212,175,55,0.15)]">
            <div className="aspect-video w-full">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title="AI Prompt Combat 2.0 – Tutorial"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] text-gray-500 p-8">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <Play size={36} className="text-primary" />
                  </div>
                  <p className="text-center font-medium text-white/80 mb-1">Tutorial video coming soon</p>
                  <p className="text-center text-sm text-gray-500 max-w-sm">
                    Add your YouTube video ID in <code className="text-primary/80">TutorialVideo.jsx</code> (YOUTUBE_VIDEO_ID) to display it here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TutorialVideo;