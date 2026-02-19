import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ChevronLeft, Loader2 } from "lucide-react";
import { getAuth } from "firebase/auth";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase"; // Ensure firebase config is imported
import Leaderboard from "../components/Round1/Leaderboard";

export default function LeaderboardDashboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUserData, setCurrentUserData] = useState({
    userId: "",
    name: "You",
    rank: 0,
    score: 0,
  });
  const [loading, setLoading] = useState(true);

  // --- LIVE FIRESTORE LISTENER ---
  useEffect(() => {
    // We listen to the "users" collection directly.
    // You can adjust the ordering logic if you have a specific leaderboard collection.
    const q = query(collection(db, "users")); 

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      // 1. Extract and format user data
      let allPlayers = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          userId: doc.id,
          name: data.fullName || data.name || "Anonymous",
          // Calculate score based on your logic. 
          // Assuming Round 1 score for now. You can combine them if needed.
          score: (data.round1_score || 0) + (data.round2_score || 0), 
          status1: data.round1_status,
          status2: data.round2_status
        };
      });

      // 2. Filter out disqualified or completely pending users (Optional)
      // Only show users who have a score > 0 or are not disqualified.
      allPlayers = allPlayers.filter(p => p.status1 !== "disqualified" && p.status2 !== "disqualified");

      // 3. Sort by score (Descending)
      allPlayers.sort((a, b) => b.score - a.score);

      // 4. Format for the Leaderboard component
      const formattedList = allPlayers.map((p, index) => ({
        name: p.name,
        score: p.score,
        userId: p.userId,
        rank: index + 1 // Assign rank based on sorted array
      }));

      setLeaderboardData(formattedList);

      // 5. Update Current User's Specific Data
      if (currentUser) {
        const myData = formattedList.find(p => p.userId === currentUser.uid);
        if (myData) {
          setCurrentUserData({
            userId: currentUser.uid,
            name: myData.name,
            rank: myData.rank,
            score: myData.score,
          });
        } else {
          // User exists but has no score/is disqualified
          setCurrentUserData({
            userId: currentUser.uid,
            name: currentUser.displayName || "Operator",
            rank: 0,
            score: 0,
          });
        }
      }
      
      setLoading(false);
    }, (error) => {
        console.error("Error fetching live leaderboard:", error);
        setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
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
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
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
            LIVE SYNC
          </div>
        </div>
      </motion.header>

      <main className="flex-1 relative z-10 pt-6 pb-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#D4AF37]" />
            <p className="font-mono text-xs uppercase tracking-widest animate-pulse">Syncing with Mainframe...</p>
          </div>
        ) : (
          <Leaderboard
            currentUser={currentUserData}
            leaderboard={leaderboardData}
            roundLabel="Total Score" // Changed from Round 1 to reflect combined score
          />
        )}
      </main>
    </div>
  );
}