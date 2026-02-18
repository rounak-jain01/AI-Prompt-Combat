import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Clock, Users, Trophy, Zap, Sparkles, ArrowRight, 
  Activity, Target, Award, Play, Calendar,
  CheckCircle2, AlertCircle, Info, Image, Video, Lock
} from 'lucide-react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

// Animated Background Grid Component
const AnimatedGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(212,175,55,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(212,175,55,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }}>
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundImage: `
              linear-gradient(rgba(212,175,55,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212,175,55,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
    </div>
  );
};

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 });
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#D4AF37] rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: Math.random() * 0.5 + 0.2,
          }}
          animate={{
            y: [null, Math.random() * window.innerHeight],
            x: [null, Math.random() * window.innerWidth],
            opacity: [null, Math.random() * 0.5 + 0.2],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

// Countdown Timer Component
const EventCountdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-2xl p-6 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle2 className="text-[#D4AF37] w-6 h-6" />
          <h3 className="text-xl font-bold text-white">Event Started!</h3>
        </div>
        <p className="text-gray-400 text-sm">You can now proceed to the rounds.</p>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-2xl p-6 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <Clock className="text-[#D4AF37] w-6 h-6" />
        <h3 className="text-xl font-bold text-white">Event Starts In</h3>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className="bg-[#0a0a0a]/50 rounded-xl p-4 border border-[#D4AF37]/20">
              <motion.div
                key={unit.value}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold text-[#D4AF37] tabular-nums"
              >
                {String(unit.value).padStart(2, '0')}
              </motion.div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">
                {unit.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Stat Card Component
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

// Hero Round Card Component
const HeroRoundCard = ({ round, number, title, description, icon: Icon, isLocked, link, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        scale: 1.02,
        y: -8,
        transition: { duration: 0.2 }
      }}
      className={`relative group ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {!isLocked && (
        <Link to={link} className="block">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a] border-2 border-[#D4AF37]/40 rounded-3xl p-8 lg:p-10 backdrop-blur-xl hover:border-[#D4AF37] transition-all duration-300 shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:shadow-[0_0_60px_rgba(212,175,55,0.4)]">
            {/* Animated Background Glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-[#D4AF37]/5"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Pulsing Ring Effect */}
            <motion.div
              className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] opacity-0 group-hover:opacity-20 blur-xl"
              animate={{
                opacity: [0, 0.2, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#D4AF37]/30 rounded-2xl blur-lg" />
                    <div className="relative bg-gradient-to-br from-[#D4AF37] to-[#b8952b] p-4 rounded-2xl">
                      <Icon className="w-8 h-8 text-black" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Round {number}</span>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 bg-green-400 rounded-full"
                      />
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-bold text-white">{title}</h3>
                  </div>
                </div>
                <motion.div
                  whileHover={{ rotate: 45 }}
                  className="p-3 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/30"
                >
                  <ArrowRight className="w-6 h-6 text-[#D4AF37]" />
                </motion.div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">{description}</p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Active</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4 text-[#D4AF37]" />
                  <span>15 min</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex items-center justify-between">
                <span className="text-[#D4AF37] font-bold text-lg flex items-center gap-2">
                  Start Challenge
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </span>
                <div className="px-4 py-2 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/30">
                  <span className="text-xs font-semibold text-[#D4AF37] uppercase">Ready</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {isLocked && (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a] border-2 border-gray-700/50 rounded-3xl p-8 lg:p-10 backdrop-blur-xl">
          {/* Locked Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-3xl z-20 pointer-events-none" />

          <div className="relative z-10 opacity-60">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gray-700/30 rounded-2xl blur-lg" />
                  <div className="relative bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50">
                    <Icon className="w-8 h-8 text-gray-600" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Round {number}</span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-500">{title}</h3>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gray-800/50 border border-gray-700/50">
                <Lock className="w-6 h-6 text-gray-600" />
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-500 text-lg mb-6 leading-relaxed">{description}</p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Lock className="w-4 h-4 text-gray-600" />
                <span>Locked</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="w-4 h-4 text-gray-600" />
                <span>Unlock Required</span>
              </div>
            </div>

            {/* Locked Message */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-500">
                <Award className="w-5 h-5" />
                <span className="text-sm">Complete Round 1 to unlock</span>
              </div>
              <div className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50">
                <span className="text-xs font-semibold text-gray-500 uppercase">Locked</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Activity Feed Component
const ActivityFeed = () => {
  const activities = [
    { type: 'join', user: 'Alex Chen', time: '2 min ago', icon: Users },
    { type: 'achievement', user: 'Sarah Kim', achievement: 'First Submission', time: '5 min ago', icon: Trophy },
    { type: 'info', message: 'Round 1 will begin shortly', time: '10 min ago', icon: Info },
    { type: 'join', user: 'Mike Johnson', time: '12 min ago', icon: Users },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#0a0a0a]/70 border border-white/10 rounded-2xl p-6 backdrop-blur-xl h-full"
    >
      <div className="flex items-center gap-2 mb-4">
        <Activity className="text-[#D4AF37] w-5 h-5" />
        <h3 className="text-lg font-bold text-white">Live Activity</h3>
      </div>
      <div className="space-y-3">
        <AnimatePresence>
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-[#111]/50 hover:bg-[#111]/70 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-[#D4AF37]/20">
                  <Icon className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">
                    {activity.type === 'join' && (
                      <><span className="text-[#D4AF37]">{activity.user}</span> joined the lobby</>
                    )}
                    {activity.type === 'achievement' && (
                      <><span className="text-[#D4AF37]">{activity.user}</span> unlocked <span className="text-yellow-400">{activity.achievement}</span></>
                    )}
                    {activity.type === 'info' && (
                      <span className="text-gray-300">{activity.message}</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const Lobby = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Set event start date (you can modify this)
  const eventStartDate = new Date();
  eventStartDate.setHours(eventStartDate.getHours() + 2); // Example: 2 hours from now

  useEffect(() => {
    if (!auth) {
      toast.error("Firebase not configured");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Fetch user data from Firestore
        if (db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
              setUserData(userDoc.data());
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      } else {
        // Redirect to login if not authenticated
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="text-[#D4AF37] w-8 h-8" />
        </motion.div>
      </div>
    );
  }

  const displayName = userData?.fullName || user?.email?.split('@')[0] || 'Commander';

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedGrid />
      <FloatingParticles />
      
      {/* Gradient Overlays */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-[#D4AF37]/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-[#D4AF37] w-6 h-6" />
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              Welcome, <span className="text-[#D4AF37]">{displayName}</span>
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Prepare yourself for the ultimate prompt engineering challenge</p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <EventCountdown targetDate={eventStartDate} />
        </motion.div>

        {/* Hero Rounds Section - THE MAIN FOCUS */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              Choose Your <span className="text-[#D4AF37]">Challenge</span>
            </h2>
            <p className="text-gray-400">Select a round to begin your journey</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
            <HeroRoundCard
              round="1"
              number="1"
              title="Image Generation"
              description="Create stunning images using AI prompts. Showcase your creativity and prompt engineering skills."
              icon={Image}
              isLocked={false}
              link="/round-1"
              delay={0.4}
            />
            <HeroRoundCard
              round="2"
              number="2"
              title="Video Generation"
              description="Generate videos that match reference content. Push the boundaries of AI video creation."
              icon={Video}
              isLocked={true}
              link="/round-2"
              delay={0.5}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatCard icon={Users} label="Participants" value="247" color="#D4AF37" />
          <StatCard icon={Trophy} label="Prizes" value="₹50K+" color="#D4AF37" />
          <StatCard icon={Target} label="Rounds" value="2" color="#D4AF37" />
          <StatCard icon={Zap} label="Status" value="Live" color="#10b981" />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          
          {/* Left Column - Event Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Event Information Card */}
            <div className="bg-[#0a0a0a]/70 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="text-[#D4AF37] w-5 h-5" />
                <h3 className="text-xl font-bold text-white">Event Information</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold">Registration Complete</p>
                    <p className="text-gray-400 text-sm">You're all set to participate</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-[#D4AF37] w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold">Round 1: Image Generation</p>
                    <p className="text-gray-400 text-sm">Generate images based on prompts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-[#D4AF37] w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold">Round 2: Video Generation</p>
                    <p className="text-gray-400 text-sm">Create videos matching reference content</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-1"
          >
            <ActivityFeed />
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-500 text-sm">
            Stay tuned for updates. The competition will begin shortly.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Lobby;
