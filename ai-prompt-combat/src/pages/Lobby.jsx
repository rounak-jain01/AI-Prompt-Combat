import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Clock, Users, Trophy, Zap, Sparkles, ArrowRight, 
  Activity, Target, Calendar, CheckCircle2, AlertCircle, 
  Image, Video, Lock, ShieldAlert
} from 'lucide-react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, collection, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';

// --- 1. DEFAULT SETTINGS ---
const DEFAULT_SETTINGS = {
  round1Open: false, 
  round2Open: false, 
  targetDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), 
  topNAllowedForRound2: 50,
  stats: { participants: 0, prizePool: "₹10K", systemStatus: "Standby" },
  updates: []
};

// --- 2. VISUAL COMPONENTS ---
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

// --- 3. DYNAMIC COUNTDOWN ---
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
          <h3 className="text-xl font-bold text-white">Event Phase Active</h3>
        </div>
        <p className="text-gray-400 text-sm">Proceed to available protocols below.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="text-[#D4AF37] w-6 h-6" />
        <h3 className="text-xl font-bold text-white">Event Countdown</h3>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Mins', value: timeLeft.minutes },
          { label: 'Secs', value: timeLeft.seconds }
        ].map((unit) => (
          <div key={unit.label} className="text-center">
            <div className="bg-[#0a0a0a]/50 rounded-xl p-4 border border-[#D4AF37]/20 shadow-[0_0_15px_rgba(212,175,55,0.05)]">
              <div className="text-2xl md:text-3xl font-bold text-[#D4AF37] tabular-nums">{String(unit.value).padStart(2, '0')}</div>
              <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider mt-1">{unit.label}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// --- 4. HERO ROUND CARD ---
const HeroRoundCard = ({ roundNumber, title, description, icon: Icon, statusInfo, link, delay = 0 }) => {
  const { status, reason } = statusInfo;
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  const isDisqualified = status === 'disqualified';

  return (
    <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay, type: "spring", stiffness: 100 }} className={`relative group h-full`}>
      {isActive ? (
        <Link to={link} className="block h-full">
          <CardContent {...{ roundNumber, title, description, Icon, status, reason, isActive: true }} />
        </Link>
      ) : (
        <div className="cursor-not-allowed h-full opacity-80">
           <CardContent {...{ roundNumber, title, description, Icon, status, reason, isActive: false }} />
        </div>
      )}
    </motion.div>
  );
};

const CardContent = ({ roundNumber, title, description, Icon, status, reason, isActive }) => {
  const isCompleted = status === 'completed';
  const isDisqualified = status === 'disqualified';

  return (
    <div className={`relative h-full overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a] border-2 rounded-3xl p-8 lg:p-10 backdrop-blur-xl transition-all duration-300 flex flex-col
      ${isActive ? 'border-[#D4AF37]/40 hover:border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:-translate-y-1' : 
        isCompleted ? 'border-green-500/30' : 
        isDisqualified ? 'border-red-500/30' : 'border-gray-800'}`}>
      
      {/* Top Right Badge */}
      {!isActive && (
        <div className="absolute top-4 right-4 z-20">
          {isCompleted ? (
            <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={12} /> Completed</span>
          ) : isDisqualified ? (
             <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><ShieldAlert size={12} /> Disqualified</span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><Lock size={12} /> Locked</span>
          )}
        </div>
      )}

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`absolute inset-0 rounded-2xl blur-lg ${isActive ? 'bg-[#D4AF37]/30' : 'bg-gray-800'}`} />
              <div className={`relative p-4 rounded-2xl ${isActive ? 'bg-gradient-to-br from-[#D4AF37] to-[#b8952b]' : 'bg-gray-800'}`}>
                <Icon className={`w-8 h-8 ${isActive ? 'text-black' : 'text-gray-500'}`} />
              </div>
            </div>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isActive ? 'text-[#D4AF37]' : 'text-gray-500'}`}>Protocol {roundNumber}</span>
              <h3 className={`text-2xl lg:text-3xl font-bold mt-1 ${isActive ? 'text-white' : 'text-gray-500'}`}>{title}</h3>
            </div>
          </div>
        </div>

        <p className={`text-sm md:text-base mb-8 leading-relaxed ${isActive ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          {isActive ? (
            <>
              <span className="text-[#D4AF37] font-bold text-sm md:text-base flex items-center gap-2 uppercase tracking-widest">
                Engage Protocol <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
            </>
          ) : (
            <span className={`font-bold text-xs flex items-center gap-2 uppercase tracking-widest ${isCompleted ? 'text-green-500' : isDisqualified ? 'text-red-500' : 'text-gray-500'}`}>
              {reason || (isCompleted ? "Artifact Secured" : isDisqualified ? "Access Revoked" : "Awaiting Authorization")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color = '#D4AF37' }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02, y: -2 }}
    className="bg-[#0a0a0a]/70 border border-white/10 rounded-xl p-5 backdrop-blur-xl hover:border-white/20 transition-all cursor-pointer">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}><Icon className="w-4 h-4" style={{ color }} /></div>
      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{label}</span>
    </div>
    <div className="text-2xl font-bold mt-1" style={{ color }}>{value}</div>
  </motion.div>
);

// --- 5. MAIN LOBBY COMPONENT ---
export default function Lobby() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [allUsers, setAllUsers] = useState([]); // Needed for Rank Calc
  const [globalSettings, setGlobalSettings] = useState(DEFAULT_SETTINGS); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // 1. Current User Data Listener
        const unsubUser = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
          if (docSnap.exists()) setUserData(docSnap.data());
        });

        // 2. All Users Listener (For Leaderboard Rank Logic)
        const unsubAllUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
            const usersArray = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAllUsers(usersArray);
        });

        // 3. Global Settings Listener
        const unsubSettings = onSnapshot(doc(db, 'settings', 'lobby'), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setGlobalSettings({
                    ...DEFAULT_SETTINGS, 
                    ...data,             
                    stats: { ...DEFAULT_SETTINGS.stats, ...(data.stats || {}) },
                    updates: data.updates || DEFAULT_SETTINGS.updates
                });
            }
            setLoading(false);
        });

        return () => { unsubUser(); unsubAllUsers(); unsubSettings(); };
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  // --- LOGIC: DETERMINE ROUND STATUS & RANK CHECK ---
  const getRound1Status = () => {
      if (!userData || !globalSettings) return { status: 'locked', reason: 'Loading...' };
      const status = userData.round1_status || 'pending';
      if (status === 'disqualified') return { status: 'disqualified', reason: 'Eliminated by Admin' };
      if (status === 'submitted') return { status: 'completed', reason: 'Archived' };
      if (!globalSettings.round1Open) return { status: 'locked', reason: 'Locked by Admin' };
      return { status: 'active', reason: '' };
  };

  const getRound2Status = () => {
      if (!userData || !globalSettings) return { status: 'locked', reason: 'Loading...' };
      const status = userData.round2_status || 'pending';
      
      // Personal Locks
      if (status === 'disqualified') return { status: 'disqualified', reason: 'Eliminated by Admin' };
      if (status === 'submitted') return { status: 'completed', reason: 'Archived' };
      
      // Global Lock
      if (!globalSettings.round2Open) return { status: 'locked', reason: 'Locked by Admin' };

      // 🔥 RANK QUALIFICATION LOGIC 🔥
      // 1. Get all valid players from Round 1
      let validPlayers = allUsers.filter(p => p.round1_status !== "disqualified");
      
      // 2. Sort them by Round 1 Score (Descending)
      validPlayers.sort((a, b) => (b.round1_score || 0) - (a.round1_score || 0));
      
      // 3. Find current user's rank
      const myIndex = validPlayers.findIndex(p => p.id === user.uid);
      const myRank = myIndex !== -1 ? myIndex + 1 : 999999; // If not found, assign low rank
      
      // 4. Check against Admin Limit
      const topAllowed = globalSettings.topNAllowedForRound2 || Infinity;

      if (myRank <= topAllowed) {
          return { status: 'active', reason: '' };
      } else {
          return { status: 'locked', reason: `Requires Top ${topAllowed} Rank (Your Rank: ${myRank})` };
      }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center gap-6 relative">
        <AnimatedGrid />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
          <Sparkles className="text-[#D4AF37] w-12 h-12" />
        </motion.div>
        <div className="flex flex-col items-center gap-1">
            <h2 className="font-bold text-xl tracking-widest text-white uppercase">Establishing Uplink</h2>
            <p className="text-[#D4AF37] font-mono text-xs animate-pulse">Syncing Mission Data...</p>
        </div>
      </div>
    );
  }

  const displayName = userData?.fullName || user?.email?.split('@')[0] || 'Operative';
  const round1Info = getRound1Status();
  const round2Info = getRound2Status();

  return (
    <div className="min-h-screen pt-24 bg-[#050505] text-white relative overflow-hidden font-sans pb-20">
      <AnimatedGrid />
      <FloatingParticles />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-[#D4AF37]/5 pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-6 max-w-6xl">
        
        {/* === HEADER === */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center md:text-left mb-12 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 border-b border-white/5 pb-8">
          <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                <span className="text-green-500 font-mono text-[10px] uppercase tracking-widest">Connection Stable</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white tracking-tight">
                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">{displayName}</span>
              </h1>
          </div>
          <div className="text-right">
              <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-1">Total Experience</p>
              <p className="text-3xl font-bold text-white">{(userData?.round1_score || 0) + (userData?.round2_score || 0)} <span className="text-[#D4AF37] text-xl">XP</span></p>
          </div>
        </motion.div>

        {/* === COUNTDOWN === */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
          <EventCountdown targetDate={globalSettings.targetDate} />
        </motion.div>

        {/* === PROTOCOLS (ROUNDS) === */}
        <div className="mb-12">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-6 flex items-center gap-3">
            <Target className="text-[#D4AF37] w-5 h-5" />
            <h2 className="text-xl font-bold text-white tracking-widest uppercase">Mission Protocols</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4"></div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
            <HeroRoundCard
              roundNumber="1"
              title="Image Generation"
              description="Reverse-engineer static assets. Test your prompt engineering skills against complex visual decrypts."
              icon={Image}
              statusInfo={round1Info}
              link="/round-1/rules"
              delay={0.4}
            />
            <HeroRoundCard
              roundNumber="2"
              title="Video Generation"
              description="Advanced replication. Recreate high-fidelity motion graphics using state-of-the-art AI video synthesis tools."
              icon={Video}
              statusInfo={round2Info}
              link="/round-2/rules"
              delay={0.5}
            />
          </div>
        </div>

        {/* === STATS & ACTIVITY GRID === */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          
          {/* Quick Stats */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-2 grid grid-cols-2 gap-4">
             <StatCard icon={Users} label="Global Operatives" value={allUsers.length || globalSettings.stats.participants} color="#D4AF37" />
             <StatCard icon={Trophy} label="Prize Pool" value={globalSettings.stats.prizePool} color="#10b981" />
             
             {/* Qualification Info Box */}
             <div className="col-span-2 bg-[#0a0a0a]/70 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-center">
                 <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2 uppercase tracking-widest"><Lock size={14} className="text-[#D4AF37]" /> Access Control</h3>
                 <p className="text-xs text-gray-400 leading-relaxed">
                     Round 1 is open to all registered operatives. <br/>
                     <strong className="text-[#D4AF37]">Round 2 is restricted to the Top {globalSettings.topNAllowedForRound2} players</strong> on the Global Leaderboard based on Round 1 scores. Perform optimally to secure your clearance.
                 </p>
             </div>
          </motion.div>

          {/* Live Activity Feed */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="lg:col-span-1">
             <div className="bg-[#0a0a0a]/70 border border-white/10 rounded-2xl p-6 backdrop-blur-xl h-[250px] flex flex-col">
                <div className="flex items-center gap-2 mb-4 shrink-0 border-b border-white/5 pb-4">
                    <Activity className="text-[#D4AF37] w-4 h-4 animate-pulse" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Live Transmissions</h3>
                </div>
                <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                    {globalSettings.updates && globalSettings.updates.length > 0 ? (
                        globalSettings.updates.map((msg, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-[#111]/50 border-l-2 border-[#D4AF37] hover:bg-white/5 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-300 leading-relaxed">
                                    <span className="text-[#D4AF37] font-mono mr-2">&gt;</span>{msg.text}
                                    </p>
                                    <p className="text-[9px] text-gray-500 mt-1 font-mono">{msg.time}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 text-xs italic font-mono text-center mt-10">Awaiting transmissions...</p>
                    )}
                </div>
             </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
