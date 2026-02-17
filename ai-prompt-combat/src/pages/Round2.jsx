import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; 
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // ✅ For Redirect
import { 
  Clock, 
  UploadCloud, 
  FileVideo, 
  Play, 
  Pause,
  RotateCcw,
  Maximize2, 
  Lock,
  Cpu,
  Zap,
  Activity,
  Loader2,
  CheckCircle2,
  WifiOff,
  RotateCw,
  ScanLine,
  Terminal,
  AlertTriangle,
  Server,
  ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../config";

// --- CONFIGURATION ---
const TOTAL_TIME = 900; // 15 Minutes
const REFERENCE_VIDEO_URL = "https://www.w3schools.com/html/mov_bbb.mp4"; 

// 👇 CLOUDINARY CONFIG
const CLOUD_NAME = "drfjs718u"; 
const UPLOAD_PRESET = "r5zxmuix"; 

export default function Round2() {
  const navigate = useNavigate(); // ✅ Navigation Hook
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  
  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, verifying, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const videoRef = useRef(null);
  const timerRef = useRef(null); // ✅ Ref for Timer

  // ✅ Defined isReady here
  const isReady = file && prompt.trim().length > 0;

  // --- TIMER LOGIC (Auto-Stop on Upload) ---
  useEffect(() => {
    if (!isUploading && timeLeft > 0) {
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleAutoSubmit(); // ⚡ Auto Submit on 00:00
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    } else {
        clearInterval(timerRef.current); // Pause timer during upload
    }
    return () => clearInterval(timerRef.current);
  }, [isUploading, timeLeft]); // Re-run when upload state changes

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // --- AUTO SUBMIT HANDLER ---
  const handleAutoSubmit = () => {
      if (file && prompt.trim().length > 0) {
          toast("TIME UP! Auto-Submitting...", { icon: "⏳" });
          handleSubmit();
      } else {
          toast.error("TIME UP! No artifact to submit.");
          // Optional: Force redirect or disqualify
      }
  };

  // --- VIDEO CONTROLS ---
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration || 1;
      setVideoProgress((current / duration) * 100);
    }
  };

  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = (e.nativeEvent.offsetX / progressBar.clientWidth);
    if (videoRef.current) {
        videoRef.current.currentTime = clickPosition * videoRef.current.duration;
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
        if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
        else if (videoRef.current.webkitRequestFullscreen) videoRef.current.webkitRequestFullscreen();
    }
  };

  // --- FILE HANDLING ---
  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      if (selectedFile.size > 80 * 1024 * 1024) return toast.error("MAX_SIZE_EXCEEDED: 80MB");
      if (!selectedFile.type.startsWith("video/")) return toast.error("INVALID_FORMAT: .MP4 ONLY");
      setFile(selectedFile);
    }
  };

  // --- ROBUST UPLOAD LOGIC ---
  const uploadToCloudinaryWithRetry = async (formData, retries = 3) => {
    try {
      return await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
          timeout: 60000 
        }
      );
    } catch (error) {
      if (retries > 0) {
        console.warn(`Retry... (${retries} attempts left)`);
        await new Promise(res => setTimeout(res, 2000));
        return uploadToCloudinaryWithRetry(formData, retries - 1);
      } else {
        throw error;
      }
    }
  };

  const handleSubmit = async () => {
    if (!isReady) return;

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
        toast.error("Auth Error: Please Login");
        return;
    }

    setIsUploading(true);
    setUploadStatus("uploading");
    setUploadProgress(0);
    setErrorMessage("");
    
    // Timer automatically pauses due to useEffect dependency on isUploading

    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET); 
        formData.append("resource_type", "video"); 

        // 1. Upload Video
        const uploadRes = await uploadToCloudinaryWithRetry(formData);
        const videoUrl = uploadRes.data.secure_url;
        
        setUploadStatus("verifying");
        
        // 2. Save to Database
        const token = await user.getIdToken();
        const backendRes = await fetch(`${API_BASE_URL}/api/round2/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                videoUrl: videoUrl,
                prompt: prompt
            })
        });

        if (backendRes.ok) {
            setUploadStatus("success");
            // 3. Redirect after delay
            setTimeout(() => {
                toast.success("ARTIFACT SECURED. REDIRECTING...");
                navigate("/lobby"); // ✅ Redirect to Lobby
            }, 2000);
        } else {
            throw new Error("Server rejected submission");
        }

    } catch (error) {
        console.error("Upload Error:", error);
        setUploadStatus("error");
        setErrorMessage(error.message || "Network Error");
    }
  };

  const handleRetry = () => handleSubmit();
  const handleCancelUpload = () => { setIsUploading(false); setUploadStatus("idle"); };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans p-4 md:p-8 flex flex-col selection:bg-[#D4AF37] selection:text-black overflow-hidden relative">
      
      {/* AMBIENT BACKGROUND */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#050505] to-black pointer-events-none"></div>
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* ================= STREAMLINED UPLOAD MODAL ================= */}
      {isUploading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
              <div className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-2xl p-0 shadow-[0_0_80px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col">
                  
                  {/* Header */}
                  <div className="p-6 border-b border-white/5 bg-[#0F0F0F] flex justify-between items-center">
                      <div className="flex items-center gap-3">
                          <Activity className={`text-[#D4AF37] ${uploadStatus === 'uploading' ? 'animate-pulse' : ''}`} size={20} />
                          <h2 className="text-sm font-bold font-mono tracking-widest text-white uppercase">
                              DATA UPLINK PROTOCOL
                          </h2>
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono">SECURE CHANNEL</div>
                  </div>

                  {/* Body */}
                  <div className="p-10 flex flex-col items-center justify-center min-h-[250px] relative">
                      
                      {/* --- STAGE 1: UPLOADING --- */}
                      {uploadStatus === 'uploading' && (
                          <div className="w-full flex flex-col items-center animate-in zoom-in duration-300">
                              <div className="relative w-32 h-32 mb-8">
                                  <svg className="w-full h-full transform -rotate-90">
                                      <circle cx="64" cy="64" r="60" stroke="#222" strokeWidth="8" fill="none" />
                                      <circle 
                                          cx="64" cy="64" r="60" 
                                          stroke="#D4AF37" strokeWidth="8" fill="none" 
                                          strokeDasharray="377" 
                                          strokeDashoffset={377 - (377 * uploadProgress) / 100}
                                          className="transition-all duration-300 ease-out"
                                      />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                                      <span className="text-3xl font-bold font-mono">{uploadProgress}%</span>
                                      <span className="text-[9px] text-gray-500 uppercase tracking-widest">Sent</span>
                                  </div>
                              </div>
                              <p className="text-[#D4AF37] text-sm font-mono animate-pulse">TRANSMITTING LARGE PACKET...</p>
                              <p className="text-gray-500 text-xs mt-2">Timer Paused. Do not close.</p>
                          </div>
                      )}

                      {/* --- STAGE 2: VERIFYING --- */}
                      {uploadStatus === 'verifying' && (
                          <div className="w-full flex flex-col items-center animate-in slide-in-from-bottom-4 duration-300">
                              <div className="w-24 h-24 bg-[#D4AF37]/5 rounded-full flex items-center justify-center mb-6 relative">
                                  <div className="absolute inset-0 border border-[#D4AF37]/30 rounded-full animate-ping"></div>
                                  <Server size={40} className="text-[#D4AF37] animate-pulse" />
                              </div>
                              <h3 className="text-lg font-bold text-white mb-1">SYNCING DATABASE</h3>
                              <p className="text-gray-400 text-xs font-mono">Verifying checksums with HQ...</p>
                          </div>
                      )}

                      {/* --- STAGE 3: SUCCESS --- */}
                      {uploadStatus === 'success' && (
                          <div className="w-full flex flex-col items-center animate-in zoom-in duration-300">
                              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                                  <ShieldCheck size={48} className="text-green-500" />
                              </div>
                              <h3 className="text-xl font-bold text-white mb-1">UPLOAD COMPLETE</h3>
                              <p className="text-green-500 text-xs font-mono tracking-widest uppercase mb-6">Redirecting to Lobby...</p>
                              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-green-500 animate-[loading_2s_ease-in-out_infinite]"></div>
                              </div>
                          </div>
                      )}

                      {/* --- STAGE 4: ERROR --- */}
                      {uploadStatus === 'error' && (
                          <div className="w-full flex flex-col items-center animate-in shake duration-300">
                              <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                                  <WifiOff size={40} className="text-red-500" />
                              </div>
                              <h3 className="text-lg font-bold text-white mb-2">CONNECTION SEVERED</h3>
                              <p className="text-red-400 text-xs font-mono bg-red-500/10 px-3 py-2 rounded border border-red-500/20 mb-8 max-w-full text-center">
                                  {errorMessage}
                              </p>
                              <div className="flex gap-4 w-full">
                                  <button onClick={handleCancelUpload} className="flex-1 py-3 bg-[#1A1A1A] hover:bg-[#252525] border border-white/10 rounded text-xs font-bold uppercase text-gray-400">Cancel</button>
                                  <button onClick={handleRetry} className="flex-1 py-3 bg-[#D4AF37] hover:bg-[#b8952b] text-black rounded text-xs font-bold uppercase flex items-center justify-center gap-2"><RotateCw size={14} /> Retry Uplink</button>
                              </div>
                          </div>
                      )}

                  </div>
                  
                  {/* Footer Decoration */}
                  <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
              </div>
          </div>
      )}

      {/* ================= HEADER ================= */}
      <header className="relative z-10 flex flex-col md:flex-row justify-between items-center mb-8 gap-4 w-full max-w-[1400px] mx-auto border-b border-white/5 pb-6">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
             <span className="text-[10px] font-mono text-green-500 tracking-[0.2em] uppercase">Secure Uplink Established</span>
           </div>
           <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white font-display">
             VISIONARY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">PROTOCOL</span>
           </h1>
        </div>

        {/* COMPACT TIMER HUD */}
        <div className={`flex items-center gap-4 bg-[#0A0A0A]/50 backdrop-blur-sm border px-6 py-3 rounded-full transition-all duration-300
            ${timeLeft < 300 ? "border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.2)]" : "border-white/10"}`}>
            
            <div className="flex flex-col items-end">
                <span className={`text-2xl font-mono font-bold leading-none ${timeLeft < 300 ? "text-red-500" : "text-white"}`}>
                    {formatTime(timeLeft)}
                </span>
                <span className="text-[9px] text-gray-500 font-mono tracking-widest uppercase">
                    {isUploading ? "TIMER PAUSED" : "Time Remaining"}
                </span>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 relative
                 ${timeLeft < 300 ? "border-red-500 bg-red-500/10" : "border-[#D4AF37] bg-[#D4AF37]/10"}`}>
                <Clock size={18} className={timeLeft < 300 ? "text-red-500" : "text-[#D4AF37]"} />
                {isUploading && <div className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-30"></div>}
            </div>
        </div>
      </header>

      {/* ================= MAIN GRID ================= */}
      <main className="relative z-10 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">

        {/* --- LEFT: SURVEILLANCE FEED (VIDEO) --- */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden relative group shadow-2xl flex flex-col">
            {/* Top HUD Strip */}
            <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-black/90 to-transparent z-20 flex justify-between items-center px-4">
                 <div className="flex items-center gap-2">
                    <Activity size={12} className="text-red-500" />
                    <span className="text-[10px] font-mono font-bold text-red-500 tracking-widest uppercase">Live_Feed_01</span>
                 </div>
                 <button onClick={toggleFullScreen} className="text-gray-400 hover:text-white transition-colors"><Maximize2 size={14} /></button>
            </div>
            
            {/* Scanner Animation */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(212,175,55,0.05)_50%,transparent_100%)] bg-[length:100%_200%] animate-[scan_4s_linear_infinite] pointer-events-none z-10"></div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
               <video 
                 ref={videoRef}
                 src={REFERENCE_VIDEO_URL} 
                 autoPlay loop muted playsInline
                 onTimeUpdate={handleTimeUpdate}
                 className="w-full h-full object-contain"
               />
               
               {/* Floating Controls */}
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[1px]">
                   <div className="flex gap-4">
                      <button onClick={togglePlay} className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform shadow-[0_0_15px_#D4AF37]">
                          {isPlaying ? <Pause fill="black" size={20} /> : <Play fill="black" size={20} className="ml-1" />}
                      </button>
                      <button onClick={restartVideo} className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-md">
                          <RotateCcw size={20} />
                      </button>
                   </div>
               </div>

               {/* Progress Line */}
               <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 cursor-pointer" onClick={handleSeek}>
                  <div className="h-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]" style={{ width: `${videoProgress}%` }}></div>
               </div>
            </div>
          </div>

          {/* MISSION PROTOCOL CHECKLIST */}
          <div className="flex-1 bg-[#0A0A0A]/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
             <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                <ScanLine size={16} className="text-[#D4AF37]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Replication Protocol</h3>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                {[
                    { label: "Camera Motion", value: "Match Drone/Pan" },
                    { label: "Lighting", value: "High Contrast / Neon" },
                    { label: "Atmosphere", value: "Cinematic Fog" },
                    { label: "Resolution", value: "1920x1080 (16:9)" }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-mono uppercase">{item.label}</span>
                        <span className="text-xs text-gray-300 font-medium">{item.value}</span>
                    </div>
                ))}
             </div>
             <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                 <AlertTriangle size={14} className="text-yellow-500" />
                 <p className="text-[10px] text-gray-400 leading-relaxed">
                    Ensure subject consistency throughout the clip. Glitches or warping will result in score deduction.
                 </p>
             </div>
          </div>

        </div>

        {/* --- RIGHT: DATA UPLINK (INPUT) --- */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-1 flex flex-col h-full relative overflow-hidden shadow-2xl">
            
            {/* Top Decor */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>

            <div className="p-6 md:p-8 flex-1 flex flex-col gap-6">
              
              <div className="flex justify-between items-end">
                 <div>
                   <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                      <Terminal size={18} className="text-[#D4AF37]" /> Data Uplink
                   </h2>
                   <p className="text-[10px] text-gray-500 font-mono mt-1">SECURE CONNECTION READY</p>
                 </div>
                 <div className="px-2 py-1 rounded border border-white/10 bg-white/5 text-[10px] font-mono text-gray-400">
                    MP4 ONLY
                 </div>
              </div>

              {/* UPLOAD ZONE */}
              <div className="flex-1 min-h-[200px] relative group transition-all">
                <input 
                  type="file" 
                  accept="video/mp4" 
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer disabled:cursor-not-allowed"
                  disabled={isUploading}
                />
                
                <div className={`h-full border border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden
                  ${file ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-white/10 hover:border-white/20 bg-black/40"}`}
                >
                   {/* Animated Grid Background for Dropzone */}
                   <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                   {file ? (
                     <div className="text-center animate-in zoom-in p-4 w-full z-10">
                       <div className="w-14 h-14 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                         <FileVideo size={28} className="text-black" />
                       </div>
                       <p className="text-white font-bold text-sm truncate px-4">{file.name}</p>
                       <p className="text-[#D4AF37] text-[10px] mt-1 font-mono tracking-widest uppercase">Ready for transmission</p>
                       
                       {!isUploading && (
                           <button onClick={(e) => {e.stopPropagation(); setFile(null);}} className="mt-4 text-[10px] text-red-500 hover:text-white transition-colors border-b border-red-500/30 hover:border-white pb-0.5 z-30 relative">
                             REMOVE ARTIFACT
                           </button>
                       )}
                     </div>
                   ) : (
                     <div className="text-center p-6 z-10">
                       <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37] text-gray-500">
                         <UploadCloud size={28} />
                       </div>
                       <p className="text-gray-300 font-bold text-sm">Drag & Drop Video</p>
                       <p className="text-gray-600 text-[10px] mt-1 uppercase tracking-widest">Max Size: 80MB</p>
                     </div>
                   )}
                </div>
              </div>

              {/* PROMPT TERMINAL */}
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest pl-1">Generation Prompt Data</label>
                 <textarea 
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   placeholder="// Paste your exact prompt here..."
                   disabled={isUploading}
                   className="w-full h-32 bg-[#050505] border border-white/10 rounded-xl p-4 text-xs text-gray-300 focus:border-[#D4AF37] focus:text-white outline-none font-mono placeholder:text-gray-700 transition-colors resize-none disabled:opacity-50 shadow-inner"
                 />
              </div>

            </div>

            {/* SUBMIT BUTTON */}
            <div className="p-6 border-t border-white/5 bg-[#080808] relative">
                <button 
                  onClick={handleSubmit}
                  disabled={!file || prompt.trim().length === 0 || isUploading}
                  className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group
                    ${isReady && !isUploading
                      ? "bg-[#D4AF37] text-black hover:bg-[#b8952b] shadow-[0_0_30px_rgba(212,175,55,0.2)]" 
                      : "bg-[#151515] text-gray-600 border border-white/5 cursor-not-allowed"}`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                      {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                      {isUploading ? "TRANSMITTING..." : "INITIATE UPLINK"}
                  </span>
                  
                  {/* Hover Shine Effect */}
                  {!isUploading && isReady && (
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] skew-x-12 group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  )}
                </button>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}