import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import TopBar from '../components/Round1/TopBar';
import ImageCard from '../components/Round1/ImageCard';
import PromptEditor from '../components/Round1/PromptEditor';
import PreviewPanel from '../components/Round1/PreviewPanel';
import NavigationControls from '../components/Round1/NavigationControls';

const TOTAL_PAIRS = 5;

// Mock image pairs (placeholder URLs – UI only)
const IMAGE_PAIRS = Array.from({ length: TOTAL_PAIRS }, (_, i) => ({
  id: i + 1,
  input: `https://picsum.photos/seed/round1input${i + 1}/640/480`,
  target: `https://picsum.photos/seed/round1target${i + 1}/640/480`,
}));

export default function Round1() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prompts, setPrompts] = useState(() => Array(TOTAL_PAIRS).fill(''));
  const [saved, setSaved] = useState(() => Array(TOTAL_PAIRS).fill(false));
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMinimized, setPreviewMinimized] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [showAutoSave, setShowAutoSave] = useState(false);

  const pair = IMAGE_PAIRS[currentIndex];
  const currentPrompt = prompts[currentIndex] ?? '';
  const currentSaved = saved[currentIndex] ?? false;

  const setCurrentPrompt = useCallback(
    (value) => {
      setPrompts((prev) => {
        const next = [...prev];
        next[currentIndex] = value;
        return next;
      });
    },
    [currentIndex]
  );

  const handleCheckPrompt = useCallback(() => {
    setPreviewLoading(true);
    setPreviewOpen(true);
    toast.loading('Generating preview…', { id: 'preview' });
    setTimeout(() => {
      setPreviewLoading(false);
      toast.success('Preview opened (UI only)', { id: 'preview', icon: '✨' });
    }, 1500);
  }, []);

  const handleSavePrompt = useCallback(() => {
    if (!currentPrompt.trim()) return;
    setSaved((prev) => {
      const next = [...prev];
      next[currentIndex] = true;
      return next;
    });
    toast.success('Prompt saved', { icon: '✓' });
  }, [currentIndex, currentPrompt]);

  const goTo = useCallback((index) => {
    if (index === currentIndex) return;
    setShowAutoSave(true);
    const t = setTimeout(() => setShowAutoSave(false), 2000);
    setCurrentIndex(index);
    return () => clearTimeout(t);
  }, [currentIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  const handleNext = useCallback(() => {
    if (currentIndex < TOTAL_PAIRS - 1) goTo(currentIndex + 1);
  }, [currentIndex, goTo]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212,175,55,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,175,55,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      <TopBar currentPairIndex={currentIndex} totalPairs={TOTAL_PAIRS} />

      <main className="flex-1 relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8">
        {/* Image comparison section – equal height cards, smooth pair transition */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          <AnimatePresence mode="wait">
            <ImageCard
              key={`input-${currentIndex}`}
              label="Input Image"
              src={pair.input}
              isTarget={false}
              alt={`Input pair ${currentIndex + 1}`}
            />
            <ImageCard
              key={`target-${currentIndex}`}
              label="Target Output Image"
              src={pair.target}
              isTarget
              alt={`Target pair ${currentIndex + 1}`}
            />
          </AnimatePresence>
        </section>

        {/* Prompt panel – glassmorphic, clear workflow */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-white/10 bg-[#0a0a0a]/70 backdrop-blur-xl p-5 sm:p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Your prompt</p>
          <PromptEditor
            value={currentPrompt}
            onChange={setCurrentPrompt}
            onCheckPrompt={handleCheckPrompt}
            onSavePrompt={handleSavePrompt}
            isSaved={currentSaved}
          />
        </motion.section>

        {/* Navigation – fixed visual hierarchy */}
        <section className="pt-2 pb-6 sm:pb-8">
          <NavigationControls
            currentIndex={currentIndex}
            onPrev={handlePrev}
            onNext={handleNext}
            onGoTo={goTo}
            showAutoSave={showAutoSave}
          />
        </section>
      </main>

      {/* Preview side panel */}
      <PreviewPanel
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        isLoading={previewLoading}
        isMinimized={previewMinimized}
        onMinimize={() => setPreviewMinimized((v) => !v)}
      />

      {/* Backdrop: click anywhere outside panel to close (desktop + mobile) */}
      {previewOpen && (
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={() => setPreviewOpen(false)}
          aria-label="Close preview"
        />
      )}
    </div>
  );
}
