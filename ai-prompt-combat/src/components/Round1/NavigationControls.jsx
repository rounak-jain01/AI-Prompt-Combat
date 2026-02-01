import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TOTAL = 5;

/**
 * Quiz-style navigation: Previous / Next + dot indicators.
 */
export default function NavigationControls({ currentIndex, onPrev, onNext, onGoTo, showAutoSave }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Prev / Next + Dots */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
        <motion.button
          type="button"
          onClick={onPrev}
          disabled={currentIndex === 0}
          whileHover={{ scale: currentIndex > 0 ? 1.05 : 1 }}
          whileTap={{ scale: currentIndex > 0 ? 0.95 : 1 }}
          className={`
            inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
            border transition-all duration-300
            ${currentIndex === 0
              ? 'border-white/10 text-gray-600 cursor-not-allowed'
              : 'border-primary/50 text-primary hover:bg-primary/10 hover:shadow-[0_0_20px_-5px_rgba(212,175,55,0.2)]'
            }
          `}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </motion.button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onGoTo(i)}
              className="focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full transition-all duration-300"
              aria-label={`Go to pair ${i + 1}`}
            >
              <motion.span
                className={`block w-3 h-3 rounded-full transition-colors duration-300 ${
                  i === currentIndex ? 'bg-primary shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 'bg-white/30 hover:bg-white/50'
                }`}
                animate={i === currentIndex ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.4 }}
              />
            </button>
          ))}
        </div>

        <motion.button
          type="button"
          onClick={onNext}
          disabled={currentIndex === TOTAL - 1}
          whileHover={{ scale: currentIndex < TOTAL - 1 ? 1.05 : 1 }}
          whileTap={{ scale: currentIndex < TOTAL - 1 ? 0.95 : 1 }}
          className={`
            inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
            border transition-all duration-300
            ${currentIndex === TOTAL - 1
              ? 'border-white/10 text-gray-600 cursor-not-allowed'
              : 'border-primary/50 text-primary hover:bg-primary/10 hover:shadow-[0_0_20px_-5px_rgba(212,175,55,0.2)]'
            }
          `}
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Auto-save indicator – smooth in/out */}
      <AnimatePresence mode="wait">
        {showAutoSave && (
          <motion.p
            key="autosave"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-gray-500 flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Progress saved
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
