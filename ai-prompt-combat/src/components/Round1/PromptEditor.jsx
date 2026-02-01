import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MAX_CHARS = 2000;
const PLACEHOLDER = 'Write a detailed prompt that transforms the input image into the target image. Be specific about style, composition, colors, and key visual changes…';

/**
 * Prompt text area with character counter, focus glow, monospace feel.
 */
export default function PromptEditor({ value, onChange, onCheckPrompt, onSavePrompt, isSaved }) {
  const [focused, setFocused] = useState(false);
  const count = value?.length ?? 0;
  const nearLimit = count >= MAX_CHARS * 0.9;

  return (
    <div className="flex flex-col gap-4">
      {/* Textarea */}
      <div className="relative">
        <motion.textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={PLACEHOLDER}
          rows={5}
          className={`
            pb-10
            w-full px-4 py-3 rounded-xl resize-none
            bg-[#0a0a0a]/80 border-2
            text-white placeholder:text-gray-500
            font-mono text-sm leading-relaxed
            transition-all duration-300 outline-none
            ${focused
              ? 'border-primary shadow-[0_0_25px_-5px_rgba(212,175,55,0.3)]'
              : 'border-white/10 hover:border-white/20'
            }
          `}
        />
        {/* Character counter */}
        <div
          className={`
            absolute bottom-3 right-4 text-xs font-mono tabular-nums
            ${nearLimit ? 'text-primary' : 'text-gray-500'}
          `}
        >
          {count} / {MAX_CHARS}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <motion.button
          type="button"
          onClick={onCheckPrompt}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="
            inline-flex items-center gap-2 px-6 py-3 rounded-xl
            bg-primary text-black font-bold text-sm
            shadow-[0_0_20px_-5px_rgba(212,175,55,0.4)]
            hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.5)]
            transition-shadow duration-300
          "
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Check Prompt
        </motion.button>
        <motion.button
          type="button"
          onClick={onSavePrompt}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!value?.trim()}
          className={`
            inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm
            border-2 transition-all duration-300
            ${value?.trim()
              ? 'border-primary text-primary hover:bg-primary/10 hover:shadow-[0_0_20px_-5px_rgba(212,175,55,0.2)]'
              : 'border-white/20 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          {isSaved ? 'Saved' : 'Save Prompt'}
        </motion.button>
      </div>
    </div>
  );
}
