import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ChevronLeft, Trophy, Loader2 } from "lucide-react";
import { getAuth } from "firebase/auth"; // Auth import
import Leaderboard from "../components/Round1/Leaderboard";
import { API_BASE_URL } from "../config";

export default function LeaderboardDashboard() {

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUserData, setCurrentUserData] = useState({
    userId: "",
    name: "You",
    rank: 0,
    score: 0,
  });
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA FUNCTION ---
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaderboard`);
      const result = await response.json();

      if (result.success) {
        const allPlayers = result.leaderboard;

        // 1. Format Data for Component
        const formattedList = allPlayers.map((p) => ({
          name: p.username || "Anonymous",
          score: p.averageScore,
          userId: p.userId, // Hidden field for matching
        }));

        setLeaderboardData(formattedList);

        // 2. Find Current User Rank
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const myIndex = formattedList.findIndex(p => p.userId === user.uid);
          if (myIndex !== -1) {
            setCurrentUserData({
              userId: user.uid,
              name: formattedList[myIndex].name,
              rank: myIndex + 1,
              score: formattedList[myIndex].score,
            });
          } else {
            // User hasn't played yet
            setCurrentUserData({
              name: user.displayName || "Participant",
              rank: 0,
              score: 0,
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- LIVE POLLING (Updates every 10 seconds) ---
  useEffect(() => {
    fetchLeaderboard(); // Initial Fetch
    const interval = setInterval(fetchLeaderboard, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      {/* Dynamic Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(212,175,55,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.2) 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }}
      />
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-0" />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 w-full shrink-0 border-b border-white/10 bg-[#050505]/85 backdrop-blur-xl"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link
            to="/lobby"
            className="flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium hidden sm:inline">
              Back to Lobby
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <span className="font-display font-bold text-lg tracking-wide text-white">
              Global Standings
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
            </span>
            LIVE
          </div>
        </div>
      </motion.header>

      <main className="flex-1 relative z-10 pt-6 pb-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#D4AF37]" />
            <p>Syncing with Satellite...</p>
          </div>
        ) : (
          <Leaderboard
          currentUser={currentUserData}
            leaderboard={leaderboardData}
            roundLabel="Round 1"
          />
        )}
      </main>
    </div>
  );
}
