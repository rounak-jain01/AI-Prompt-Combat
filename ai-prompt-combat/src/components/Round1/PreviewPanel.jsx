import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minimize2 } from 'lucide-react';

/**
 * Slide-in panel showing "Generated Preview" mock.
 * UI only: placeholder image + loading shimmer state.
 */
export default function PreviewPanel({ isOpen, onClose, isLoading = false, isMinimized, onMinimize }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 200 }}
          className={`
            fixed top-0 right-0 z-[60] h-full
            bg-[#0a0a0a]/95 backdrop-blur-xl border-l border-white/10
            shadow-[-20px_0_60px_rgba(0,0,0,0.5)]
            flex flex-col
            ${isMinimized ? 'w-20' : 'w-full max-w-md'}
          `}
        >
          {!isMinimized ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="font-display font-bold text-lg text-primary">Generated Preview</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onMinimize}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Minimize"
                  >
                    <Minimize2 className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/15 text-primary border-2 border-primary/50 hover:bg-primary/25 hover:border-primary hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all"
                    aria-label="Close panel"
                  >
                    <X className="w-5 h-5" strokeWidth={2.5} />
                    <span className="text-sm font-bold">Close</span>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 overflow-auto">
                {isLoading ? (
                  /* Shimmer skeleton */
                  <div className="rounded-xl overflow-hidden bg-[#111] border border-white/10">
                    <div className="aspect-square w-full shimmer-box" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 w-3/4 rounded bg-white/10 animate-pulse" />
                      <div className="h-3 w-1/2 rounded bg-white/10 animate-pulse" />
                    </div>
                  </div>
                ) : (
                  /* Placeholder output mock */
                  <div className="rounded-xl overflow-hidden bg-[#111] border border-primary/20">
                    <div className="aspect-square w-full bg-[#0d0d0d] flex items-center justify-center">
                      <div className="text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500">Preview (UI mock)</p>
                        <p className="text-xs text-gray-600 mt-1">No actual generation</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-4 gap-2">
              <span className="text-xs text-primary font-semibold uppercase tracking-wider [writing-mode:vertical-rl] rotate-180">Preview</span>
              <button
                type="button"
                onClick={onMinimize}
                className="p-2 rounded-lg text-gray-400 hover:text-primary transition-colors"
                aria-label="Expand"
              >
                <Minimize2 className="w-5 h-5 rotate-90" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-xl bg-primary/15 text-primary border-2 border-primary/50 hover:bg-primary/25 hover:border-primary transition-all"
                aria-label="Close panel"
                title="Close"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
