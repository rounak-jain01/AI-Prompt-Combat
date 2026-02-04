import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Clock } from 'lucide-react';

/**
 * Top bar: Logo (left), Title (center), Progress + Live Timer (right).
 */
export default function TopBar({ currentPairIndex, totalPairs, timeLeft }) {
  
  // Helper: Format Seconds to MM:SS
  const formatTime = (seconds) => {
    if (seconds === undefined || seconds === null) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Color Logic: Red if < 1 min, Gold otherwise
  const isUrgent = timeLeft < 60;

  return (
    <header className="sticky top-0 z-50 w-full shrink-0 border-b border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 grid grid-cols-3 items-center gap-4">
        
        {/* Left: Logo */}
        <div className="flex justify-start">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-primary transition-colors"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/30">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-sm tracking-wide hidden sm:inline">
              Kaggle Koders
            </span>
          </Link>
        </div>

        {/* Center: Title */}
        <h1 className="font-display font-bold text-sm sm:text-base text-center text-white truncate opacity-90">
          Round 1 – Prompt Challenge
        </h1>

        {/* Right: Progress + Timer */}
        <div className="flex items-center justify-end gap-3 sm:gap-6">
          {/* Pair Counter */}
          <span className="text-xs font-medium text-gray-400 whitespace-nowrap hidden sm:inline">
            Pair <span className="text-primary font-bold text-sm">{currentPairIndex + 1}</span>
            <span className="opacity-50">/</span>{totalPairs}
          </span>

          {/* Timer Badge */}
          <div 
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-3xl font-bold transition-all
              ${isUrgent 
                ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.2)]' 
                : 'bg-white/5 border-white/10 text-primary'
              }
            `}
          >
            <Clock size={40} className={isUrgent ? "animate-bounce" : ""} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

      </div>
    </header>
  );
}