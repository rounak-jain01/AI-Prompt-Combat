import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useSecurity } from "../hooks/useSecurity"; // ✅ Security Hook
import {
  AlertTriangle,
  Lock,
  Save,
  Sparkles,
  X,
  CheckCircle,
  ShieldAlert,
  Loader2,
  Ban
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import TopBar from "../components/Round1/TopBar";
import ImageCard from "../components/Round1/ImageCard";
import PromptEditor from "../components/Round1/PromptEditor";
import PreviewPanel from "../components/Round1/PreviewPanel";
import NavigationControls from "../components/Round1/NavigationControls";

const TOTAL_PAIRS = 5;
const TIME_LIMIT_SECONDS = 25 * 60; // 25 Minutes

const IMAGE_PAIRS = [
  { id: 1, input: "/Round1Images/Case1/input.png", target: "/Round1Images/Case1/target.png" },
  { id: 2, input: "/Round1Images/Case2/input.png", target: "/Round1Images/Case2/target.png" },
  { id: 3, input: "/Round1Images/Case3/input.png", target: "/Round1Images/Case3/target.png" },
  { id: 4, input: "/Round1Images/Case4/input.png", target: "/Round1Images/Case4/target.png" },
  { id: 5, input: "/Round1Images/Case5/input.png", target: "/Round1Images/Case5/target.png" },
];

export default function Round1() {
  const navigate = useNavigate();
  
  // --- GATEKEEPER STATES ---
  const [checkingAccess, setCheckingAccess] = useState(true); 
  const [accessDenied, setAccessDenied] = useState(false); 

  // --- GAME STATES ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
  const [prompts, setPrompts] = useState(() => Array(TOTAL_PAIRS).fill(""));
  
  // --- SECURITY STATES ---
  const [isSubmitTriggered, setIsSubmitTriggered] = useState(false); // Controls Disqualification Screen

  const [pairStatus, setPairStatus] = useState(() =>
    Array.from({ length: TOTAL_PAIRS }, () => ({
      attemptsLeft: 5,
      lastScore: 0,
      bestScore: 0,
      bestPromptText: "",
      feedback: [],
      isLocked: false,
      finalSelectedPrompt: "",
      finalSelectedScore: 0,
    }))
  );

  const [previewOpen, setPreviewOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- MODAL STATES ---
  const [showLockModal, setShowLockModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitModalContent, setSubmitModalContent] = useState({ title: "", message: "", isWarning: false });

  const pair = IMAGE_PAIRS[currentIndex];
  const currentStatus = pairStatus[currentIndex];
  const currentPrompt = prompts[currentIndex] || "";

  // ==========================================
  // 🚪 GATEKEEPER LOGIC (CHECK STATUS ON LOAD)
  // ==========================================
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            const token = await user.getIdToken();
            const res = await fetch("http://127.0.0.1:5000/api/user-status", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                const status = data.round1_status;
                
                if (status === "submitted" || status === "disqualified") {
                    setAccessDenied(true);
                    toast.error("Access Denied: Round Completed.");
                    setTimeout(() => navigate("/lobby", { replace: true }), 3000); 
                } else if (status === "started") {
                    // ✅ Valid Access
                    setCheckingAccess(false);
                } else {
                    // Status is "pending" -> Redirect to Rules Page
                    navigate("/round1-rules");
                }
            } else {
                // Fallback (Allow if error, backend will catch submission)
                setCheckingAccess(false); 
            }
        } catch (e) {
            console.error("Access Check Failed", e);
            setCheckingAccess(false); 
        }
    });

    return () => unsubscribe();
  }, [navigate]);

  // --- TIMER EFFECT ---
  useEffect(() => {
    if (checkingAccess || accessDenied) return; 
    
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    const timerId = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, checkingAccess, accessDenied]);

  // --- CHECK PROMPT ---
  const handleCheckPrompt = useCallback(async () => {
    if (!currentPrompt.trim()) return toast.error("Prompt cannot be empty!");
    if (currentStatus.attemptsLeft <= 0) return toast.error("Attempts exhausted! Please lock answer.");

    setChecking(true);
    const toastId = toast.loading("Judging...");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentPrompt, pairId: pair.id }),
      });

      const data = await response.json();
      if (data.success) {
        setPairStatus((prev) => {
          const newStatus = [...prev];
          const current = { ...newStatus[currentIndex] };

          current.attemptsLeft -= 1;
          current.lastScore = data.score;
          current.feedback = data.feedback;

          if (data.score >= current.bestScore) {
            current.bestScore = data.score;
            current.bestPromptText = currentPrompt;
          }

          newStatus[currentIndex] = current;
          return newStatus;
        });
        toast.success(`Score: ${data.score}%`, { id: toastId });
        setPreviewOpen(true);
      }
    } catch (error) {
      toast.error("Backend Error", { id: toastId });
    } finally {
      setChecking(false);
    }
  }, [currentPrompt, currentIndex, pair, currentStatus]);

  // --- SUBMIT LOGIC ---
  const sendToBackend = async (dataPayload, message, toastId, isCheating = false) => {
    const total = dataPayload.reduce((acc, item) => acc + item.score, 0);
    const avg = (total / TOTAL_PAIRS).toFixed(2);

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        toast.error("Session Invalid!", { id: toastId });
        setSubmitting(false);
        return;
      }

      const token = await user.getIdToken();
      const userName = user.displayName || user.email.split("@")[0] || "Unknown Agent";

      const response = await fetch("http://127.0.0.1:5000/api/submit-round", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          averageScore: parseFloat(avg),
          totalPairs: TOTAL_PAIRS,
          breakdown: dataPayload,
          username: userName,
          isCheating: isCheating, 
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        // ✅ NEW: Clear Security Storage on Success/Disqualify
        sessionStorage.removeItem("r1_warnings"); 

        toast.success(message, { id: toastId });
        setTimeout(() => navigate("/lobby", { replace: true }), 3000);
      }
    } catch (e) {
      console.error(e);
      toast.error("Submission Failed", { id: toastId });
      setSubmitting(false);
    }
  };

  // --- AUTO SUBMIT (For Timer & Disqualification) ---
  const handleAutoSubmit = useCallback(() => {
    if (isSubmitTriggered) return;
    setIsSubmitTriggered(true);
    setSubmitting(true);

    toast.dismiss(); 

    const payload = pairStatus.map((p, idx) => ({
      pairId: idx + 1,
      score: p.bestScore,
      prompt: p.bestPromptText || prompts[idx],
    }));

    sendToBackend(payload, "Session Ended.", "submit-toast", true);
  }, [isSubmitTriggered, pairStatus, prompts]);

  // --- 🛡️ SECURITY HOOK ---
  const { warnings, enterFullScreen } = useSecurity(
    !checkingAccess && !accessDenied && !isSubmitTriggered, 
    handleAutoSubmit
  );

  // --- MANUAL LOCK & SUBMIT HANDLERS ---
  const handleLockClick = () => {
    if (!currentPrompt.trim() && !currentStatus.bestPromptText) {
      return toast.error("Write something first!");
    }
    if (currentStatus.bestScore > 0) {
      setShowLockModal(true);
    } else {
      confirmLock("current");
    }
  };

  const confirmLock = (choice) => {
    setPairStatus((prev) => {
      const newStatus = [...prev];
      const current = { ...newStatus[currentIndex] };

      if (choice === "best") {
        current.finalSelectedPrompt = current.bestPromptText;
        current.finalSelectedScore = current.bestScore;
        setPrompts((p) => {
          const n = [...p];
          n[currentIndex] = current.bestPromptText;
          return n;
        });
      } else {
        current.finalSelectedPrompt = prompts[currentIndex];
        const isBestText = prompts[currentIndex] === current.bestPromptText;
        current.finalSelectedScore = isBestText
          ? current.bestScore
          : current.lastScore;
      }

      current.isLocked = true;
      newStatus[currentIndex] = current;
      return newStatus;
    });

    setShowLockModal(false);
    toast.success("Locked!", { icon: "🔒" });
  };

  const handleManualSubmitClick = () => {
    const allLocked = pairStatus.every((p) => p.isLocked);
    setSubmitModalContent({
        title: allLocked ? "Confirm Submission" : "Incomplete Submission",
        message: allLocked ? "Are you sure you want to submit your final answers?" : "Some answers are unlocked. Submit anyway?",
        isWarning: !allLocked
    });
    setShowSubmitModal(true);
  };

  const executeSubmit = () => {
    setShowSubmitModal(false);
    if (isSubmitTriggered) return;
    setSubmitting(true);
    const tId = toast.loading("Securely Submitting...");

    const payload = pairStatus.map((p, idx) => ({
      pairId: idx + 1,
      score: p.isLocked ? p.finalSelectedScore : p.bestScore,
      prompt: p.isLocked ? p.finalSelectedPrompt : p.bestPromptText || prompts[idx],
    }));

    sendToBackend(payload, "Submitted Successfully!", tId, false);
  };

  // ==========================================
  // 🖥️ RENDER LOGIC
  // ==========================================

  // 1. CHECKING ACCESS (Loading Screen)
  if (checkingAccess) {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-[#D4AF37]">
            <Loader2 size={48} className="animate-spin mb-4" />
            <h2 className="text-xl font-bold">Verifying Access...</h2>
        </div>
    );
  }

  // 2. ACCESS DENIED SCREEN
  if (accessDenied) {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-red-500">
            <Ban size={64} className="mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-gray-400 mb-6">You have already completed or been disqualified from this round.</p>
            <button 
                onClick={() => navigate("/lobby")}
                className="cursor-pointer px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#b8952b]"
            >
                Return to Lobby
            </button>
        </div>
    );
  }

  // 3. DISQUALIFIED SCREEN
  if (isSubmitTriggered) {
    return (
      <div className="min-h-screen bg-red-950 flex flex-col items-center justify-center p-4 text-center fixed inset-0 z-[99999]">
        <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <ShieldAlert size={48} className="text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Disqualified!</h1>
        <p className="text-red-300 text-lg mb-8 max-w-md">
          Maximum security violations detected. Your session is being terminated and flagged.
        </p>
        <div className="flex items-center gap-3 text-[#D4AF37] bg-black/30 px-6 py-3 rounded-lg border border-[#D4AF37]/30">
          <Loader2 size={24} className="animate-spin" />
          <span className="font-mono">Submitting Data & Redirecting...</span>
        </div>
      </div>
    );
  }

  // 4. MAIN GAME UI
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      {/* Background Ambience */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* WARNING OVERLAY */}
      {/* <AnimatePresence>
        {warnings > 0 && warnings <= 3 && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-red-600/90 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 backdrop-blur-md"
          >
            <AlertTriangle size={20} className="animate-pulse" />
            Warning {warnings}/3: Focus on the screen!
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* === LOCK MODAL === */}
      <AnimatePresence>
        {showLockModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111] border border-[#D4AF37] rounded-xl p-6 w-full max-w-lg relative shadow-[0_0_50px_rgba(212,175,55,0.15)]"
            >
              <button
                onClick={() => setShowLockModal(false)}
                className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-white"
              >
                <X />
              </button>
              <h3 className="text-xl font-bold text-[#D4AF37] mb-4 flex gap-2 items-center">
                <Lock size={20} /> Select Answer to Lock
              </h3>

              <div className="space-y-4">
                <button
                  onClick={() => confirmLock("best")}
                  className="cursor-pointer w-full text-left p-4 rounded-lg bg-gradient-to-r from-green-900/20 to-transparent border border-green-500/50 hover:border-green-400 transition-all group"
                >
                  <div className="flex justify-between items-center font-bold text-green-400 mb-1">
                    <span className="flex items-center gap-2">
                      <TrophyIcon size={16} /> Best Attempt
                    </span>
                    <span className="bg-green-500/20 px-2 py-0.5 rounded text-sm border border-green-500/50">
                      {currentStatus.bestScore}%
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs italic line-clamp-2 border-t border-green-500/20 pt-2 mt-2 group-hover:text-green-200">
                    {currentStatus.bestPromptText}
                  </p>
                </button>

                <button
                  onClick={() => confirmLock("current")}
                  className="cursor-pointer w-full text-left p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 transition-all group"
                >
                  <div className="flex justify-between items-center font-bold text-white mb-1">
                    <span className="flex items-center gap-2">
                      <Sparkles size={16} /> Current Editor Text
                    </span>
                    <span className="text-gray-500 text-xs border border-white/10 px-2 py-0.5 rounded">
                      Unchecked
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs italic line-clamp-2 border-t border-white/10 pt-2 mt-2 group-hover:text-gray-300">
                    {currentPrompt}
                  </p>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* === SUBMIT CONFIRM MODAL === */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`bg-[#0a0a0a] border rounded-xl p-8 w-full max-w-md relative shadow-2xl ${
                submitModalContent.isWarning
                  ? "border-red-500/50"
                  : "border-[#D4AF37]/50"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  submitModalContent.isWarning
                    ? "bg-red-500/10 text-red-500"
                    : "bg-[#D4AF37]/10 text-[#D4AF37]"
                }`}
              >
                {submitModalContent.isWarning ? (
                  <AlertTriangle size={32} />
                ) : (
                  <CheckCircle size={32} />
                )}
              </div>

              <h3 className="text-2xl font-bold text-white text-center mb-2">
                {submitModalContent.title}
              </h3>
              <p className="text-gray-400 text-center text-sm leading-relaxed mb-8">
                {submitModalContent.message}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="cursor-pointer flex-1 py-3 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={executeSubmit}
                  className={`cursor-pointer flex-1 py-3 rounded-lg font-bold text-black transition-all ${
                    submitModalContent.isWarning
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-[#D4AF37] hover:bg-[#b8952b]"
                  }`}
                >
                  Confirm Submit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* === TOP BAR === */}
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10 px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex-1">
          <TopBar
            currentPairIndex={currentIndex}
            totalPairs={TOTAL_PAIRS}
            timeLeft={timeLeft}
          />
        </div>
      </div>

      {/* === GAME AREA === */}
      <main className="flex-1 relative z-10 w-full max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <ImageCard label="Input" src={pair.input} isTarget={false} />
          <ImageCard label="Target" src={pair.target} isTarget={true} />
        </section>

        <div className="flex justify-between px-2 text-sm font-bold">
          <span className="flex items-center gap-2 text-[#D4AF37]">
            <AlertTriangle size={16} /> Attempts: {currentStatus.attemptsLeft}/5
          </span>
          {currentStatus.isLocked && (
            <span className="flex items-center gap-2 text-gray-400">
              <Lock size={14} /> LOCKED
            </span>
          )}
        </div>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border bg-[#111]/80 p-6 backdrop-blur-xl ${
            currentStatus.isLocked
              ? "border-green-500/30 pointer-events-none opacity-80"
              : "border-white/10"
          }`}
        >
          <PromptEditor
            value={currentPrompt}
            onChange={(val) =>
              !currentStatus.isLocked &&
              setPrompts((p) => {
                const n = [...p];
                n[currentIndex] = val;
                return n;
              })
            }
          />
          <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
            <button
              onClick={handleCheckPrompt}
              disabled={
                checking ||
                currentStatus.isLocked ||
                currentStatus.attemptsLeft <= 0
              }
              className="cursor-pointer px-6 py-2.5 bg-[#D4AF37] text-black font-bold rounded-lg flex gap-2 items-center hover:bg-[#b8952b] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-50 transition-all"
            >
              {checking ? (
                "Checking..."
              ) : (
                <>
                  <Sparkles size={18} /> Check Accuracy
                </>
              )}
            </button>
            <button
              onClick={handleLockClick}
              disabled={currentStatus.isLocked}
              className="cursor-pointer px-6 py-2.5 border border-white/20 rounded-lg flex gap-2 items-center hover:bg-white/5 disabled:opacity-50 transition-all"
            >
              {currentStatus.isLocked ? (
                <>
                  <Lock size={18} /> Locked
                </>
              ) : (
                <>
                  <Save size={18} /> Lock Answer
                </>
              )}
            </button>
          </div>
        </motion.div>

        <NavigationControls
          currentIndex={currentIndex}
          onPrev={() => setCurrentIndex((i) => i - 1)}
          onNext={() => setCurrentIndex((i) => i + 1)}
          onGoTo={setCurrentIndex}
          totalPairs={TOTAL_PAIRS}
          onSubmit={handleManualSubmitClick}
          isSubmitting={submitting}
        />
      </main>

      <PreviewPanel
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        score={currentStatus.lastScore}
        feedback={currentStatus.feedback}
        attemptsLeft={currentStatus.attemptsLeft}
      />
    </div>
  );
}

const TrophyIcon = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);