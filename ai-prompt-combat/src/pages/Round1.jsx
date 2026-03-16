import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useSecurity } from "../hooks/useSecurity"; 
import { API_BASE_URL } from "../config";
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

export default function Round1() {
  const navigate = useNavigate();
  
  // --- GATEKEEPER STATES ---
  const [checkingAccess, setCheckingAccess] = useState(true); 
  const [accessDenied, setAccessDenied] = useState(false); 

  // --- IMAGE STATES (NEW) ---
  const [imagePairs, setImagePairs] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);

  // --- GAME STATES ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
  const [prompts, setPrompts] = useState(() => Array(TOTAL_PAIRS).fill(""));
  
  // --- SECURITY STATES ---
  const [isSubmitTriggered, setIsSubmitTriggered] = useState(false); 

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

  // ==========================================
  // 🚪 GATEKEEPER & FETCH IMAGES LOGIC
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
            
            // 1. Check Access Status
            const statusRes = await fetch(`${API_BASE_URL}/api/user-status`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const statusData = await statusRes.json();

            if (statusData.success) {
                const status = statusData.round1_status;
                if (status === "submitted" || status === "disqualified") {
                    setAccessDenied(true);
                    toast.error("Access Denied: Round Completed.");
                    setTimeout(() => navigate("/lobby", { replace: true }), 3000); 
                    return;
                } else if (status !== "started") {
                    navigate("/round1-rules");
                    return;
                }
            }

            // 2. Access Granted -> Fetch Randomized Images from Backend
            const imgRes = await fetch(`${API_BASE_URL}/api/round1/images`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const imgData = await imgRes.json();
            
            if (imgData.success) {
                setImagePairs(imgData.images);
            } else {
                toast.error("Failed to load secure images.");
            }
            
            setCheckingAccess(false);
            setLoadingImages(false);

        } catch (e) {
            console.error("Access/Image Fetch Failed", e);
            setCheckingAccess(false); 
            setLoadingImages(false);
        }
    });

    return () => unsubscribe();
  }, [navigate]);

  // --- TIMER EFFECT ---
  useEffect(() => {
    if (checkingAccess || accessDenied || loadingImages) return; 
    
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    const timerId = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, checkingAccess, accessDenied, loadingImages]);

  // Safely get current pair data
  const pair = imagePairs[currentIndex] || {};
  const currentStatus = pairStatus[currentIndex] || {};
  const currentPrompt = prompts[currentIndex] || "";

  // --- CHECK PROMPT ---
  const handleCheckPrompt = useCallback(async () => {
    if (!currentPrompt.trim()) return toast.error("Prompt cannot be empty!");
    if (currentStatus.attemptsLeft <= 0) return toast.error("Attempts exhausted! Please lock answer.");

    setChecking(true);
    const toastId = toast.loading("Judging...");

    try {
      const response = await fetch(`${API_BASE_URL}/api/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentPrompt, pairId: pair.id }), // Backend will evaluate based on real pair ID
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
      else {
        toast.error(data.message || "Invalid or off-topic prompt! Score: 0", { id: toastId });
        setPairStatus((prev) => {
          const newStatus = [...prev];
          const current = { ...newStatus[currentIndex] };
          current.attemptsLeft -= 1; 
          current.lastScore = 0;
          current.feedback = ["The AI could not process this prompt. Please write a descriptive prompt."];
          newStatus[currentIndex] = current;
          return newStatus;
        });
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

      const response = await fetch(`${API_BASE_URL}/api/submit-round`, {
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

  const handleAutoSubmit = useCallback(() => {
    if (isSubmitTriggered || imagePairs.length === 0) return;
    setIsSubmitTriggered(true);
    setSubmitting(true);
    toast.dismiss(); 

    const payload = pairStatus.map((p, idx) => ({
      pairId: imagePairs[idx].id, // Send the ACTUAL pair ID, not the index
      score: p.bestScore,
      prompt: p.bestPromptText || prompts[idx],
    }));

    sendToBackend(payload, "Session Ended.", "submit-toast", true);
  }, [isSubmitTriggered, pairStatus, prompts, imagePairs]);

  const { warnings, enterFullScreen } = useSecurity(
    !checkingAccess && !accessDenied && !isSubmitTriggered && !loadingImages, 
    handleAutoSubmit
  );

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
        current.finalSelectedScore = isBestText ? current.bestScore : current.lastScore;
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
      pairId: imagePairs[idx].id, // Send the ACTUAL pair ID
      score: p.isLocked ? p.finalSelectedScore : p.bestScore,
      prompt: p.isLocked ? p.finalSelectedPrompt : p.bestPromptText || prompts[idx],
    }));

    sendToBackend(payload, "Submitted Successfully!", tId, false);
  };

  // ==========================================
  // 🖥️ RENDER LOGIC
  // ==========================================
  if (checkingAccess || loadingImages) {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-[#D4AF37]">
            <Loader2 size={48} className="animate-spin mb-4" />
            <h2 className="text-xl font-bold">Securing Environment...</h2>
        </div>
    );
  }

  if (accessDenied) {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-red-500">
            <Ban size={64} className="mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-gray-400 mb-6">You have already completed or been disqualified from this round.</p>
            <button onClick={() => navigate("/lobby")} className="cursor-pointer px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#b8952b]">Return to Lobby</button>
        </div>
    );
  }

  if (isSubmitTriggered) {
    return (
      <div className="min-h-screen bg-red-950 flex flex-col items-center justify-center p-4 text-center fixed inset-0 z-[99999]">
        <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mb-6 animate-pulse"><ShieldAlert size={48} className="text-red-500" /></div>
        <h1 className="text-4xl font-bold text-white mb-2">Disqualified!</h1>
        <p className="text-red-300 text-lg mb-8 max-w-md">Maximum security violations detected. Your session is being terminated and flagged.</p>
        <div className="flex items-center gap-3 text-[#D4AF37] bg-black/30 px-6 py-3 rounded-lg border border-[#D4AF37]/30">
          <Loader2 size={24} className="animate-spin" />
          <span className="font-mono">Submitting Data & Redirecting...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)`, backgroundSize: "48px 48px" }} />

      {/* MODALS */}
      {/* ... (Your existing modal logic remains exactly same) ... */}

      <div className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10 px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex-1"><TopBar currentPairIndex={currentIndex} totalPairs={TOTAL_PAIRS} timeLeft={timeLeft} /></div>
      </div>

      <main className="flex-1 relative z-10 w-full max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8">
        
        {/* SECURE IMAGE CARDS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <ImageCard label="Input" src={pair.input} isTarget={false} />
          <ImageCard label="Target" src={pair.target} isTarget={true} />
        </section>

        <div className="flex justify-between px-2 text-sm font-bold">
          <span className="flex items-center gap-2 text-[#D4AF37]"><AlertTriangle size={16} /> Attempts: {currentStatus.attemptsLeft}/5</span>
          {currentStatus.isLocked && <span className="flex items-center gap-2 text-gray-400"><Lock size={14} /> LOCKED</span>}
        </div>

        <motion.div key={currentIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl border bg-[#111]/80 p-6 backdrop-blur-xl ${currentStatus.isLocked ? "border-green-500/30 pointer-events-none opacity-80" : "border-white/10"}`}>
          <PromptEditor value={currentPrompt} onChange={(val) => !currentStatus.isLocked && setPrompts((p) => { const n = [...p]; n[currentIndex] = val; return n; })} />
          <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
            <button onClick={handleCheckPrompt} disabled={checking || currentStatus.isLocked || currentStatus.attemptsLeft <= 0} className="cursor-pointer px-6 py-2.5 bg-[#D4AF37] text-black font-bold rounded-lg flex gap-2 items-center hover:bg-[#b8952b] transition-all disabled:opacity-50">
              {checking ? "Checking..." : <><Sparkles size={18} /> Check Accuracy</>}
            </button>
            <button onClick={handleLockClick} disabled={currentStatus.isLocked} className="cursor-pointer px-6 py-2.5 border border-white/20 rounded-lg flex gap-2 items-center hover:bg-white/5 transition-all disabled:opacity-50">
              {currentStatus.isLocked ? <><Lock size={18} /> Locked</> : <><Save size={18} /> Lock Answer</>}
            </button>
          </div>
        </motion.div>

        <NavigationControls currentIndex={currentIndex} onPrev={() => setCurrentIndex((i) => i - 1)} onNext={() => setCurrentIndex((i) => i + 1)} onGoTo={setCurrentIndex} totalPairs={TOTAL_PAIRS} onSubmit={handleManualSubmitClick} isSubmitting={submitting} />
      </main>

      <PreviewPanel isOpen={previewOpen} onClose={() => setPreviewOpen(false)} score={currentStatus.lastScore} feedback={currentStatus.feedback} attemptsLeft={currentStatus.attemptsLeft} />
    </div>
  );
}