import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';

const NavigationControls = ({ currentIndex, onPrev, onNext, onGoTo, totalPairs = 5, onSubmit, isSubmitting }) => {
  return (
    <div className="flex items-center justify-between gap-4 select-none">
      
      {/* PREV */}
      <button 
        onClick={onPrev} 
        disabled={currentIndex === 0}
        className="cursor-pointer px-5 py-2.5 rounded-lg bg-[#111] border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 flex items-center gap-2 text-sm font-bold"
      >
        <ChevronLeft size={16} /> Prev
      </button>

      {/* DOTS */}
      <div className="flex gap-2">
        {Array.from({ length: totalPairs }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => onGoTo(idx)}
            className={`w-3 h-3 cursor-pointer rounded-full transition-all duration-300 ${
              idx === currentIndex 
                ? 'bg-primary scale-125 shadow-[0_0_10px_#D4AF37]' 
                : 'bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* SUBMIT BUTTON (Only on Last Slide) */}
      {currentIndex === totalPairs - 1 ? (
        <button 
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-6 cursor-pointer py-2.5 rounded-lg bg-linear-to-r from-primary to-[#B8860B] text-black font-bold text-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <><CheckCircle size={16} /> Submit Round</>}
        </button>
      ) : (
        <button 
          onClick={onNext}
          className="px-5 cursor-pointer py-2.5 rounded-lg bg-primary/10 border border-primary/50 text-primary hover:bg-primary/20 transition-all flex items-center gap-2 text-sm font-bold"
        >
          Next <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
};

export default NavigationControls;