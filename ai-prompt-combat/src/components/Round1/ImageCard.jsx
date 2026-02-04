import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable image card for Input / Target display.
 * Supports label, hover zoom, border glow, skeleton loader.
 */
export default function ImageCard({ label, src, isTarget = false, alt = '' }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`
        relative flex flex-col rounded-2xl overflow-hidden h-full min-h-0
        bg-[#0a0a0a] border
        transition-all duration-300
        ${isTarget
          ? 'border-primary/40 shadow-[0_0_30px_-5px_rgba(212,175,55,0.15)] hover:border-primary/60 hover:shadow-[0_0_40px_-5px_rgba(212,175,55,0.25)]'
          : 'border-white/10 hover:border-white/20 hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.05)]'
        }
      `}
    >
      {/* Label - solid dark pill so it's always readable over any image */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className={`
            text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg
            shadow-[0_2px_12px_rgba(0,0,0,0.6)]
            ${isTarget
              ? 'bg-black/90 text-primary border border-primary/50'
              : 'bg-black/90 text-white border border-white/30'
            }
          `}
        >
          {label}
        </span>
      </div>

      {/* Image container - equal aspect, consistent height */}
      <div className="relative cursor-pointer aspect-4/3 w-full min-h-55 sm:min-h-65 flex items-center justify-center">
        {/* Skeleton loader */}
        {!loaded && (
          <div className="absolute inset-0 bg-linear-to-br from-[#111] to-[#0a0a0a] animate-pulse" />
        )}
        <motion.img
          src={src}
          alt={alt || label}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onLoad={() => setLoaded(true)}
          initial={false}
        />
      </div>
    </motion.div>
  );
}
