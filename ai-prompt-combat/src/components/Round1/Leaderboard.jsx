import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, User, Award } from "lucide-react";

// COLORS FOR RANKS (Icons hata diye, sirf colors rakhe)
const RANK_STYLES = {
  1: {
    bg: "bg-primary/10 border-primary/40",
    text: "text-primary",
    badge: "bg-primary text-black border-primary shadow-[0_0_20px_-5px_rgba(212,175,55,0.5)]",
    glow: "shadow-[0_0_30px_-10px_rgba(212,175,55,0.2)]",
  },
  2: {
    bg: "bg-gray-400/5 border-gray-400/20",
    text: "text-gray-200",
    badge: "bg-gray-400 text-black border-gray-400",
    glow: "",
  },
  3: {
    bg: "bg-amber-800/10 border-amber-600/30",
    text: "text-amber-200",
    badge: "bg-amber-700 text-white border-amber-600",
    glow: "",
  },
};

function AnimatedScore({ value, className = "" }) {
  const num = typeof value === "number" ? value : parseInt(value, 10);
  const [display, setDisplay] = useState(isNaN(num) ? value : 0);

  useEffect(() => {
    if (isNaN(num)) { setDisplay(value); return; }
    const duration = 800;
    const start = display;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (num - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [num]);

  return <span className={className}>{isNaN(num) ? value : display}</span>;
}

export default function Leaderboard({
  currentUser = { userId: "", name: "Participant", rank: 0, score: 0 },
  leaderboard = [],
  roundLabel = "Round 1",
}) {
  
  // Sort by Score
  const sortedLeaderboard = useMemo(
    () => [...leaderboard].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 50),
    [leaderboard]
  );

  // Add Ranks
  const listWithRank = useMemo(
    () => sortedLeaderboard.map((entry, index) => ({ ...entry, rank: index + 1 })),
    [sortedLeaderboard]
  );

  const totalParticipants = leaderboard.length;
  const rankPercent = currentUser.rank && totalParticipants > 0
      ? Math.max(1, Math.round(100 - (currentUser.rank / totalParticipants) * 100))
      : null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-3 mb-6">
        <h2 className="font-display font-bold text-xl sm:text-2xl text-white flex items-center gap-2">
          <span className="text-primary">Live Standings</span>
          <span className="text-gray-500 font-normal text-base">· {roundLabel}</span>
        </h2>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Live
        </span>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <SummaryCard value={currentUser.rank ? `#${currentUser.rank}` : "—"} label="Your Rank" delay={0} icon={Award} sub={rankPercent != null ? `Top ${rankPercent}%` : null} />
        <SummaryCard value={currentUser.name || "—"} label="Participant" delay={0.05} icon={User} />
        <SummaryCard value={currentUser.score ?? "—"} label={`${roundLabel} Score`} delay={0.1} highlight icon={Zap} numeric />
      </div>

      {/* List */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-white/10 flex justify-between">
           <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Rankings</span>
           <span className="text-xs text-gray-500">{totalParticipants} participants</span>
        </div>
        
        <div className="divide-y divide-white/5">
          <AnimatePresence mode="popLayout">
            {listWithRank.map((entry, index) => (
              <LeaderboardRow
                key={entry.userId || index} // Unique Key
                rank={entry.rank}
                name={entry.name}
                score={entry.score}
                // ✅ FIX 1: ID se compare karein (Naam se nahi)
                isCurrentUser={String(entry.userId) === String(currentUser.userId)}
                delay={index * 0.05}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.section>
    </div>
  );
}

function SummaryCard({ value, label, delay = 0, highlight = false, icon: Icon, sub = null, numeric = false }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className={`group relative rounded-2xl border p-6 bg-[#0a0a0a]/80 backdrop-blur-xl border-white/10 ${highlight ? "border-primary/40 shadow-[0_0_30px_-10px_rgba(212,175,55,0.15)]" : ""}`}>
      {Icon && <div className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center ${highlight ? "text-primary/40" : "text-gray-500/50"}`}><Icon className="w-5 h-5" /></div>}
      <div>
        <p className={`font-display font-bold text-3xl truncate pr-12 ${highlight ? "text-primary" : "text-white"}`}>{numeric ? <AnimatedScore value={value} /> : value}</p>
        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-500">{label}</p>
        {sub && <p className="mt-2 text-xs text-primary font-medium">{sub}</p>}
      </div>
    </motion.div>
  );
}

function LeaderboardRow({ rank, name, score, isCurrentUser, delay = 0 }) {
  // Styles based on Rank
  const style = RANK_STYLES[rank] || {
    bg: "bg-transparent",
    text: "text-gray-300",
    badge: "bg-white/5 text-gray-500 border-white/10",
    glow: "",
  };

  return (
    <motion.div 
      layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay }}
      className={`flex items-center gap-4 px-6 py-4 border-l-2 border-transparent ${style.bg} ${isCurrentUser ? "bg-primary/5 border-l-primary" : ""} ${style.glow}`}
    >
      {/* ✅ FIX 2: Ranking Number Display */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg border ${style.badge}`}>
        #{rank}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`font-medium truncate ${style.text} ${isCurrentUser ? "text-white" : ""}`}>
          {name}
          {isCurrentUser && <span className="ml-2 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded border border-primary/30 uppercase tracking-wide">You</span>}
        </p>
      </div>

      <div className="font-display font-bold text-xl text-white tabular-nums">
        <AnimatedScore value={score} />
      </div>
    </motion.div>
  );
}