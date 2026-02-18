import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Clock, Users, Trophy, Zap, Sparkles, ArrowRight, 
  Activity, Target, Award, Play, Calendar,
  CheckCircle2, AlertCircle, Info, Image, Video, Lock, ShieldAlert
} from 'lucide-react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';

// --- 1. DUMMY DATA / DEFAULT CONFIGURATION ---
// Agar database empty hai ya load ho raha hai, to ye dikhega.
const DEFAULT_SETTINGS = {
  round1Open: false, // Abhi Round 1 locked hai
  round2Open: false, // Round 2 bhi locked hai
  targetDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 Hours from now
  stats: {
    participants: 142, // Dummy count
    prizePool: "₹50K",
    rounds: 2,
    systemStatus: "Standby"
  },
  updates: [
    { text: "System Initialized. Welcome to AI Combat.", time: "Just now" },
    { text: "Waiting for Admin to start Round 1...", time: "2 mins ago" },
    { text: "Check your profile for status updates.", time: "5 mins ago" }
  ]
};

// --- VISUAL COMPONENTS ---

const AnimatedGrid = () => (
  <div className="absolute inset-0 overflow-hidden opacity-20">
    <div className="absolute inset-0" style={{
      backgroundImage: `linear-gradient(rgba(212,175,55,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.1) 1px, transparent 1px)`,
      backgroundSize: '50px 50px',
    }}>
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage: `linear-gradient(rgba(212,175,55,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  </div>
);

const FloatingParticles = () => {
  const particles = Array.from({ length: 20 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#D4AF37] rounded-full"
          initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, opacity: Math.random() * 0.5 + 0.2 }}
          animate={{ y: [null, Math.random() * window.innerHeight], x: [null, Math.random() * window.innerWidth], opacity: [null, Math.random() * 0.5 + 0.2] }}
          transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
};

// --- DYNAMIC COUNTDOWN COMPONENT ---
const EventCountdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!targetDate) return;
    
    const calculateTimeLeft = () => {
      const targetTime = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      setIsExpired(false);
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle2 className="text-[#D4AF37] w-6 h-6" />
          <h3 className="text-xl font-bold text-white">Event Live / Completed</h3>
        </div>
        <p className="text-gray-400 text-sm">Proceed to active protocols below.</p>
      </motion.div>
    );
  }

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="text-[#D4AF37] w-6 h-6" />
        <h3 className="text-xl font-bold text-white">Event Countdown</h3>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="text-center">
            <div className="bg-[#0a0a0a]/50 rounded-xl p-4 border border-[#D4AF37]/20">
              <div className="text-3xl font-bold text-[#D4AF37] tabular-nums">{String(unit.value).padStart(2, '0')}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{unit.label}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// --- HERO ROUND CARD (With Logic) ---
const HeroRoundCard = ({ roundNumber, title, description, icon: Icon, status, link, delay = 0 }) => {
  // Status logic: 'locked', 'active', 'completed', 'disqualified'
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  const isDisqualified = status === 'disqualified';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      className={`relative group h-full`}
    >
      {/* Clickable only if Active */}
      {isActive ? (
        <Link to={link} className="block h-full">
          <CardContent {...{ roundNumber, title, description, Icon, status, isActive: true }} />
        </Link>
      ) : (
        <div className="cursor-not-allowed h-full opacity-80">
           <CardContent {...{ roundNumber, title, description, Icon, status, isActive: false }} />
        </div>
      )}
    </motion.div>
  );
};

const CardContent = ({ roundNumber, title, description, Icon, status, isActive }) => {
  const isCompleted = status === 'completed';
  const isDisqualified = status === 'disqualified';

  return (
    <div className={`relative h-full overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a] border-2 rounded-3xl p-8 lg:p-10 backdrop-blur-xl transition-all duration-300 
      ${isActive ? 'border-[#D4AF37]/40 hover:border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:shadow-[0_0_40px_rgba(212,175,55,0.2)]' : 
        isCompleted ? 'border-green-500/30' : 
        isDisqualified ? 'border-red-500/30' : 'border-gray-800'}`}>
      
      {/* Status Overlay */}
      {!isActive && (
        <div className="absolute top-4 right-4 z-20">
          {isCompleted ? (
            <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold uppercase flex items-center gap-2">
              <CheckCircle2 size={12} /> Completed
            </span>
          ) : isDisqualified ? (
             <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase flex items-center gap-2">
              <ShieldAlert size={12} /> Disqualified
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-400 text-xs font-bold uppercase flex items-center gap-2">
              <Lock size={12} /> Locked
            </span>
          )}
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`absolute inset-0 rounded-2xl blur-lg ${isActive ? 'bg-[#D4AF37]/30' : 'bg-gray-800'}`} />
              <div className={`relative p-4 rounded-2xl ${isActive ? 'bg-gradient-to-br from-[#D4AF37] to-[#b8952b]' : 'bg-gray-800'}`}>
                <Icon className={`w-8 h-8 ${isActive ? 'text-black' : 'text-gray-500'}`} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-[#D4AF37]' : 'text-gray-500'}`}>
                  Round {roundNumber}
                </span>
              </div>
              <h3 className={`text-3xl lg:text-4xl font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>
                {title}
              </h3>
            </div>
          </div>
        </div>

        <p className={`text-lg mb-6 leading-relaxed ${isActive ? 'text-gray-300' : 'text-gray-600'}`}>
          {description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          {isActive ? (
            <>
              <span className="text-[#D4AF37] font-bold text-lg flex items-center gap-2">
                Start Challenge <ArrowRight className="w-5 h-5" />
              </span>
              <div className="px-4 py-2 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/30">
                <span className="text-xs font-semibold text-[#D4AF37] uppercase">Ready</span>
              </div>
            </>
          ) : (
            <span className="text-gray-600 font-bold text-sm flex items-center gap-2 uppercase tracking-widest">
              {isCompleted ? "Access Closed" : isDisqualified ? "Eliminated" : "Locked by Admin"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// --- STAT CARD ---
const StatCard = ({ icon: Icon, label, value, color = '#D4AF37' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-[#0a0a0a]/70 border border-white/10 rounded-xl p-5 backdrop-blur-xl hover:border-[#D4AF37]/30 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
    </motion.div>
  );
};

// --- MAIN LOBBY COMPONENT ---
const Lobby = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  
  // Settings State initialized with DEFAULT
  const [globalSettings, setGlobalSettings] = useState(DEFAULT_SETTINGS); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // 1. User Data Listener
        const userRef = doc(db, 'users', currentUser.uid);
        const unsubUser = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) setUserData(docSnap.data());
        });

        // 2. Global Admin Settings Listener (Real-Time)
        const settingsRef = doc(db, 'settings', 'lobby');
        const unsubSettings = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Merge Database data with Default structure to avoid crashes if fields are missing
                setGlobalSettings({
                    ...DEFAULT_SETTINGS, // Base
                    ...data,             // Overwrite with DB
                    stats: { ...DEFAULT_SETTINGS.stats, ...(data.stats || {}) },
                    updates: data.updates || DEFAULT_SETTINGS.updates
                });
            } else {
                console.log("No Lobby Settings found in DB, using Defaults.");
                // We keep DEFAULT_SETTINGS
            }
            setLoading(false);
        });

        return () => {
            unsubUser();
            unsubSettings();
        };
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  // --- LOGIC: DETERMINE ROUND STATUS ---
  const getRoundStatus = (roundKey, isGlobalOpen) => {
    // Priority 1: User Profile Status (Overrides everything)
    const userStatus = userData?.[`${roundKey}_status`] || 'pending'; // pending, started, submitted, disqualified
    
    if (userStatus === 'disqualified') return 'disqualified';
    if (userStatus === 'submitted') return 'completed';

    // Priority 2: Global Admin Lock
    if (!isGlobalOpen) return 'locked';

    // Priority 3: Ready to Start
    return 'active';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Sparkles className="text-[#D4AF37] w-12 h-12" />
        </motion.div>
        <p className="text-[#D4AF37] font-mono animate-pulse">ESTABLISHING UPLINK...</p>
      </div>
    );
  }

  const displayName = userData?.fullName || user?.email?.split('@')[0] || 'Commander';
  
  // Calculate Statuses
  const round1Status = getRoundStatus('round1', globalSettings.round1Open);
  const round2Status = getRoundStatus('round2', globalSettings.round2Open);

  return (
    <div className="min-h-screen pt-20 bg-[#050505] text-white relative overflow-hidden font-sans">
      <AnimatedGrid />
      <FloatingParticles />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-[#D4AF37]/5 pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-[#D4AF37] w-6 h-6" />
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              Welcome, <span className="text-[#D4AF37]">{displayName}</span>
            </h1>
          </div>
          <p className="text-gray-400 text-lg">System Status: <span className="text-green-400">{globalSettings.stats.systemStatus}</span></p>
        </motion.div>

        {/* Dynamic Countdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
          <EventCountdown targetDate={globalSettings.targetDate} />
        </motion.div>

        {/* --- ROUNDS SECTION --- */}
        <div className="mb-12">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              Mission <span className="text-[#D4AF37]">Protocols</span>
            </h2>
            <p className="text-gray-400">Select active sector to engage</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
            {/* Round 1 */}
            <HeroRoundCard
              roundNumber="1"
              title="Image Generation"
              description="Create stunning images using AI prompts. Showcase your creativity and prompt engineering skills."
              icon={Image}
              status={round1Status}
              link="/round-1/rules"
              delay={0.4}
            />
            {/* Round 2 */}
            <HeroRoundCard
              roundNumber="2"
              title="Video Generation"
              description="Generate videos that match reference content. Push the boundaries of AI video creation."
              icon={Video}
              status={round2Status}
              link="/round-2/rules"
              delay={0.5}
            />
          </div>
        </div>

        {/* Stats Grid (Fully Controlled via Admin) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Participants" value={globalSettings.stats.participants} color="#D4AF37" />
          <StatCard icon={Trophy} label="Prize Pool" value={globalSettings.stats.prizePool} color="#D4AF37" />
          <StatCard icon={Target} label="My XP" value={userData?.totalScore || 0} color="#D4AF37" />
          <StatCard icon={Zap} label="Status" value="Live" color="#10b981" />
        </motion.div>

        {/* Info & Activity Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          
          {/* Status Panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="lg:col-span-2">
            <div className="bg-[#0a0a0a]/70 border border-white/10 rounded-2xl p-6 backdrop-blur-xl h-full">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="text-[#D4AF37] w-5 h-5" />
                <h3 className="text-xl font-bold text-white">Access Control</h3>
              </div>
              <div className="space-y-4">
                 <StatusRow label="Round 1 (Image)" status={globalSettings.round1Open ? "UNLOCKED" : "RESTRICTED"} color={globalSettings.round1Open ? "text-green-500" : "text-gray-500"} />
                 <StatusRow label="Round 2 (Video)" status={globalSettings.round2Open ? "UNLOCKED" : "RESTRICTED"} color={globalSettings.round2Open ? "text-green-500" : "text-gray-500"} />
                 <StatusRow label="Global Leaderboard" status="ACTIVE" color="text-green-500" />
              </div>
            </div>
          </motion.div>

          {/* Activity Feed (Dynamic) */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="lg:col-span-1">
             <div className="bg-[#0a0a0a]/70 border border-white/10 rounded-2xl p-6 backdrop-blur-xl h-full">
                <div className="flex items-center gap-2 mb-4">
                    <Activity className="text-[#D4AF37] w-5 h-5" />
                    <h3 className="text-lg font-bold text-white">Live Updates</h3>
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {globalSettings.updates.map((msg, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-[#111]/50 border-l-2 border-[#D4AF37]">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-300">
                                <span className="text-[#D4AF37] font-mono mr-2">&gt;</span>
                                {msg.text}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-1">{msg.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center">
          <p className="text-gray-500 text-sm">
            Admin Communication Channel: <span className="text-green-500">CONNECTED</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// Helper for Status Rows
const StatusRow = ({ label, status, color }) => (
    <div className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
        <span className="text-gray-300">{label}</span>
        <span className={`font-mono font-bold ${color}`}>{status}</span>
    </div>
);

export default Lobby;