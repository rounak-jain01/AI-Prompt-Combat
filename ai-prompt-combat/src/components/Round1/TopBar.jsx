import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

/**
 * Top bar: Logo (left), Title (center), Progress + Timer (right).
 */
export default function TopBar({ currentPairIndex, totalPairs }) {
  return (
    <header className="sticky top-0 z-50 w-full shrink-0 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 grid grid-cols-3 items-center gap-4">
        {/* Left: Logo */}
        <div className="flex justify-start">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-primary transition-colors"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/20 border border-primary/30">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-sm tracking-wide hidden sm:inline">Kaggle Koders</span>
          </Link>
        </div>

        {/* Center: Title */}
        <h1 className="font-display font-bold text-sm sm:text-base text-center text-white truncate">
          Round 1 – Prompt Challenge
        </h1>

        {/* Right: Progress + Timer */}
        <div className="flex items-center justify-end gap-3 sm:gap-4">
          <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
            Pair <span className="text-primary font-bold">{currentPairIndex + 1}</span>/<span>{totalPairs}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            45:00
          </span>
        </div>
      </div>
    </header>
  );
}
