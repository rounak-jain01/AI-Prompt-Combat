import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, AlertCircle } from "lucide-react";

export default function PreviewPanel({
  isOpen,
  onClose,
  score,
  feedback,
  attemptsLeft,
}) {
  // Score Color Logic
  const getColor = (s) =>
    s >= 80 ? "text-green-500" : s >= 50 ? "text-[#D4AF37]" : "text-red-500";
  const getBorder = (s) =>
    s >= 80
      ? "border-green-500"
      : s >= 50
        ? "border-[#D4AF37]"
        : "border-red-500";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[#0a0a0a]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl p-6 flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="text-primary" /> Analysis Report
            </h3>
            <button
              onClick={onClose}
              className="p-2 cursor-pointer bg-white/5 rounded-lg hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          {/* SCORE CIRCLE */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div
              className={`w-32 h-32 rounded-full border-4 ${getBorder(score)} flex items-center justify-center bg-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)]`}
            >
              <span
                className={`text-4xl font-bold font-mono ${getColor(score)}`}
              >
                {score}%
              </span>
            </div>
            <p className="mt-4 text-gray-400 text-sm uppercase tracking-widest">
              Accuracy Score
            </p>
          </div>

          {/* INSIGHTS */}
          <div className="flex-1 bg-[#111] rounded-xl p-5 border border-white/10">
            <h4 className="text-primary font-bold mb-4 flex items-center gap-2">
              <AlertCircle size={16} /> AI Insights
            </h4>
            <ul className="space-y-3">
              {feedback.map((tip, index) => (
                <li key={index} className="text-sm text-gray-300 flex gap-2">
                  <span className="text-primary">•</span> {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* FOOTER */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-500 text-sm">
              Attempts Remaining:{" "}
              <span className="text-white font-bold">{attemptsLeft}/5</span>
            </p>
            <button
              onClick={onClose}
              className=" cursor-pointer mt-4 w-full py-3 bg-primary text-black font-bold rounded-lg hover:bg-[#b8952b]"
            >
              Improve Prompt & Try Again
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
