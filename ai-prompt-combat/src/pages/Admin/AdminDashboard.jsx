import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { 
  Users, Activity, CheckCircle, ShieldAlert, 
  Search, RefreshCw, RotateCcw, Filter, LogOut 
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, active: 0, submitted: 0, disqualified: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // --- FETCH DATA ---
  const fetchData = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return navigate("/login");

    try {
      setLoading(true);
      const token = await user.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Get Stats
      const statsRes = await fetch("http://127.0.0.1:5000/api/admin/stats", { headers });
      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.stats);

      // 2. Get Users
      const usersRes = await fetch("http://127.0.0.1:5000/api/admin/users", { headers });
      const usersData = await usersRes.json();
      if (usersData.success) setUsers(usersData.users);

    } catch (e) {
      console.error(e);
      toast.error("Failed to load Admin Data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- RESET USER ACTION ---
  const handleResetUser = async (targetUserId, name) => {
    if (!window.confirm(`⚠️ Are you sure you want to RESET ${name}? \nThis will delete their score and allow them to start Round 1 again.`)) {
      return;
    }

    const tId = toast.loading("Resetting User...");
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();

      const res = await fetch("http://127.0.0.1:5000/api/admin/reset-user", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ targetUserId })
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`${name} access restored!`, { id: tId });
        fetchData(); // Refresh table
      } else {
        toast.error(data.detail || "Failed", { id: tId });
      }
    } catch (e) {
      toast.error("Server Error", { id: tId });
    }
  };

  // --- FILTER LOGIC ---
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" ? true : u.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <ShieldAlert className="text-[#D4AF37]" size={32} /> 
                Admin Command Center
            </h1>
            <p className="text-gray-500 mt-1">Manage users, monitor progress, and enforce rules.</p>
        </div>
        <div className="flex gap-3">
            <button onClick={fetchData} className="p-3 bg-[#111] border border-white/10 rounded-lg hover:border-[#D4AF37] text-[#D4AF37] transition-all">
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
            <button onClick={() => navigate("/lobby")} className="px-5 py-3 bg-[#111] border border-white/10 rounded-lg text-gray-400 hover:text-white flex items-center gap-2 hover:bg-white/5 transition-all">
                <LogOut size={18} /> Exit
            </button>
        </div>
      </header>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<Users />} label="Total Registrations" value={stats.total} color="blue" />
        <StatCard icon={<Activity />} label="Active Players" value={stats.active} color="yellow" />
        <StatCard icon={<CheckCircle />} label="Submitted" value={stats.submitted} color="green" />
        <StatCard icon={<ShieldAlert />} label="Disqualified" value={stats.disqualified} color="red" />
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center bg-[#111] p-4 rounded-xl border border-white/5">
        <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
                type="text" 
                placeholder="Search by Name or Email..." 
                className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-[#D4AF37] focus:outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
            {['all', 'started', 'submitted', 'disqualified'].map((status) => (
                <button 
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all border ${
                        filterStatus === status 
                        ? "bg-[#D4AF37] text-black border-[#D4AF37]" 
                        : "bg-transparent text-gray-400 border-white/10 hover:border-white/30"
                    }`}
                >
                    {status}
                </button>
            ))}
        </div>
      </div>

      {/* USER TABLE */}
      <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider">
                        <th className="p-5 font-medium">User</th>
                        <th className="p-5 font-medium">Status</th>
                        <th className="p-5 font-medium">Score</th>
                        <th className="p-5 font-medium">Role</th>
                        <th className="p-5 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {loading ? (
                        <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading Data...</td></tr>
                    ) : filteredUsers.length === 0 ? (
                        <tr><td colSpan="5" className="p-8 text-center text-gray-500">No users found.</td></tr>
                    ) : (
                        filteredUsers.map((user) => (
                            <tr key={user.userId} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="p-5">
                                    <div className="font-bold text-white">{user.name}</div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                </td>
                                <td className="p-5">
                                    <StatusBadge status={user.status} />
                                    {user.isFlagged && <span className="ml-2 text-[10px] bg-red-900/50 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30">FLAGGED</span>}
                                </td>
                                <td className="p-5 font-mono text-[#D4AF37]">{user.score > 0 ? `${user.score}%` : "-"}</td>
                                <td className="p-5 text-xs text-gray-500 uppercase">{user.role}</td>
                                <td className="p-5 text-right">
                                    <button 
                                        onClick={() => handleResetUser(user.userId, user.name)}
                                        className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                                        title="Reset User Round"
                                    >
                                        <RotateCcw size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

const StatCard = ({ icon, label, value, color }) => {
    const colors = {
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        green: "text-green-400 bg-green-500/10 border-green-500/20",
        yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
        red: "text-red-400 bg-red-500/10 border-red-500/20",
    };
    return (
        <motion.div whileHover={{ y: -2 }} className={`p-6 rounded-xl border ${colors[color]} flex flex-col gap-2`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]} border-none bg-opacity-20`}>
                {icon}
            </div>
            <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
            <p className="text-sm text-gray-400 uppercase tracking-wider">{label}</p>
        </motion.div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        pending: "bg-gray-800 text-gray-300 border-gray-600",
        started: "bg-yellow-900/30 text-yellow-400 border-yellow-600/50",
        submitted: "bg-green-900/30 text-green-400 border-green-600/50",
        disqualified: "bg-red-900/30 text-red-400 border-red-600/50",
    };
    
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${styles[status] || styles.pending}`}>
            {status}
        </span>
    );
};