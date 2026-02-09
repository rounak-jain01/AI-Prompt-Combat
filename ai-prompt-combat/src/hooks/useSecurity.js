import { useEffect, useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";

export const useSecurity = (isActive, onAutoSubmit) => {
  // ✅ FIX 1: Initialize state from Session Storage (Persist on Refresh)
  const [warnings, setWarnings] = useState(() => {
    const saved = sessionStorage.getItem("r1_warnings");
    return saved ? parseInt(saved, 10) : 0;
  });

  const warningCountRef = useRef(warnings); // Ref sync with state
  const lastWarningTimeRef = useRef(0);
  const MAX_WARNINGS = 3;
  const TOAST_ID = "security-toast";

  // --- FULLSCREEN FORCE ---
  const enterFullScreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement && isActive) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen blocked");
    }
  }, [isActive]);

  // --- WARNING SYSTEM ---
  const triggerWarning = useCallback((message) => {
    const now = Date.now();
    // Cooldown check to prevent spam
    if (now - lastWarningTimeRef.current < 2000) return;

    lastWarningTimeRef.current = now;
    
    // Increment Count
    const newCount = warningCountRef.current + 1;
    warningCountRef.current = newCount;
    setWarnings(newCount);
    
    // ✅ FIX 2: Save to Session Storage immediately
    sessionStorage.setItem("r1_warnings", newCount);

    if (newCount > MAX_WARNINGS) {
      toast.dismiss(TOAST_ID);
      onAutoSubmit();
    } else {
      toast.error(`Warning ${newCount}/${MAX_WARNINGS}: ${message}`, {
        id: TOAST_ID,
        duration: 4000,
        style: { border: '2px solid #FF4500', padding: '16px', color: '#FF4500', fontWeight: 'bold', background: '#111' },
        icon: newCount === MAX_WARNINGS ? "🚨" : "⚠️",
      });
      // Try to restore fullscreen
      enterFullScreen();
    }
  }, [MAX_WARNINGS, onAutoSubmit, enterFullScreen]);

  useEffect(() => {
    if (!isActive) return;

    // --- DISABLE CONTEXT MENU & COPY/PASTE ---
    const handleContextMenu = (e) => e.preventDefault();
    const handleCopyPaste = (e) => { 
        e.preventDefault(); 
        toast.error("Action Disabled!", { id: "copy" }); 
    };

    // --- TAB SWITCH DETECT ---
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerWarning("Tab switching detected!");
      } else {
        setTimeout(() => enterFullScreen(), 100); 
      }
    };

    // --- FULLSCREEN DETECT ---
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isActive) {
         triggerWarning("Exiting fullscreen is not allowed!");
         setTimeout(() => enterFullScreen(), 100); 
      }
    };

    // ✅ FIX 3: PREVENT REFRESH / CLOSE TAB
    const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = ''; // Chrome requires this to show the prompt
        triggerWarning("Attempted to refresh/leave page!"); // Count this as a warning too
        return "";
    };

    // ✅ FIX 4: DISABLE BROWSER BACK BUTTON (History Trap)
    // Push current state to history stack so "Back" stays on same page
    window.history.pushState(null, null, window.location.href);
    const handlePopState = () => {
        window.history.pushState(null, null, window.location.href);
        triggerWarning("Back navigation is disabled!");
    };

    // Attach Listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("cut", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    
    // Attach Browser Navigation Blockers
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    // Initial Fullscreen
    enterFullScreen();

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("cut", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isActive, triggerWarning, enterFullScreen]);

  return { warnings, enterFullScreen };
};