import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { collection, doc, updateDoc, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; 
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../config"; 
// import { collection, doc, updateDoc, onSnapshot, getDocs } from "firebase/firestore";
import * as XLSX from "xlsx"; // ✅ NAYI EXCEL LIBRARY
import { 
  ShieldAlert, LogOut, Play, FileVideo, Terminal,
  Calendar, MessageSquare, Trash2, Edit3, X, Save, 
  UserPlus, Search, RotateCcw, Ban, RefreshCw, Wifi, 
  Link as LinkIcon, Copy, Check, AlertTriangle, Users, Download
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview"); 
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // --- DATA STATES ---
  // 🟢 Yahan onSnapshot laga hai, isliye data hamesha real-time rahega
  const [users, setUsers] = useState([]);
  const [globalSettings, setGlobalSettings] = useState({
    round1Open: false, 
    round2Open: false, 
    targetDate: "", 
    updates: [],
    topNAllowedForRound2: 50,
    stats: { participants: 0, prizePool: "₹10K", systemStatus: "Standby" }
  });
  const [newMessage, setNewMessage] = useState("");
  const [topNInput, setTopNInput] = useState(50);

  // --- MODAL STATES ---
  const [selectedUser, setSelectedUser] = useState(null); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ fullName: "", email: "", role: "student" }); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState(""); 
  const [isCopied, setIsCopied] = useState(false);

  // --- FILTER & SEARCH ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const unsubSettingsRef = useRef(null);
  const unsubUsersRef = useRef(null);

  // ==========================================
  // 1. SETUP LIVE LISTENERS
  // ==========================================
  const setupListeners = () => {
    const auth = getAuth();
    if (!auth.currentUser) return navigate("/login");
    setIsRefreshing(true);
    
    if (unsubSettingsRef.current) unsubSettingsRef.current();
    if (unsubUsersRef.current) unsubUsersRef.current();

    unsubSettingsRef.current = onSnapshot(doc(db, "settings", "lobby"), (docSnap) => {
      if (docSnap.exists()) {
          const data = docSnap.data();
          setGlobalSettings(data);
          if(data.topNAllowedForRound2) setTopNInput(data.topNAllowedForRound2);
      }
    });

    unsubUsersRef.current = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ userId: doc.id, ...doc.data() })));
      setIsRefreshing(false);
    });
  };

  useEffect(() => { 
    setupListeners(); 
    return () => { 
      if(unsubSettingsRef.current) unsubSettingsRef.current(); 
      if(unsubUsersRef.current) unsubUsersRef.current(); 
    }; 
  }, []);

  const handleForceRefresh = () => { 
    toast.loading("Syncing Data...", { duration: 1000 }); 
    setupListeners(); 
  };

  // ==========================================
  // 2. USER MANAGEMENT ACTIONS (UNTOUCHED)
  // ==========================================
  const handleCreateUser = async () => {
      if(!newUser.fullName || !newUser.email) return toast.error("Name & Email required");
      const auth = getAuth();
      const tId = toast.loading("Creating Account...");
      try {
          const token = await auth.currentUser.getIdToken();
          const res = await fetch(`${API_BASE_URL}/api/admin/add-user`, {
              method: "POST",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
              body: JSON.stringify(newUser)
          });
          const data = await res.json();
          if (res.ok && data.success) {
              toast.success("User Created!", { id: tId });
              setInviteLink(data.inviteLink); 
          } else throw new Error(data.detail);
      } catch (e) { toast.error(e.message, { id: tId }); }
  };

  const handleDeleteUser = async (userId) => {
      if(!window.confirm("⚠️ DANGER: This will permanently delete the user from Authentication and Database. Proceed?")) return;
      const tId = toast.loading("Obliterating User...");
      try {
          const token = await getAuth().currentUser.getIdToken();
          const res = await fetch(`${API_BASE_URL}/api/admin/delete-user/${userId}`, {
              method: "DELETE",
              headers: { "Authorization": `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok && data.success) {
              toast.success("User completely deleted!", { id: tId });
              setIsEditModalOpen(false);
          } else throw new Error(data.detail);
      } catch (e) { toast.error(e.message || "Delete Failed", { id: tId }); }
  };

  const handleSaveUser = async () => {
      if (!selectedUser) return;
      const tId = toast.loading("Saving...");
      try {
          const { userId, ...data } = selectedUser;
          await updateDoc(doc(db, "users", selectedUser.userId), data);
          toast.success("Profile Updated", { id: tId });
          setIsEditModalOpen(false);
      } catch (e) { toast.error("Update Failed", { id: tId }); }
  };

  const quickUpdateStatus = (round, status) => setSelectedUser(prev => ({ ...prev, [`${round}_status`]: status }));

  // ==========================================
  // 3. GLOBAL SETTINGS ACTIONS (UNTOUCHED)
  // ==========================================
  const updateGlobalSetting = async (field, value) => {
      await updateDoc(doc(db, "settings", "lobby"), { [field]: value });
      toast.success(`Updated ${field}`);
  };
  
  const handleSaveTopN = () => {
      updateGlobalSetting("topNAllowedForRound2", Number(topNInput));
  };

  const handleAddUpdate = async () => {
      if(!newMessage) return;
      const newUpdates = [{ text: newMessage, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }, ...globalSettings.updates];
      await updateGlobalSetting("updates", newUpdates);
      setNewMessage("");
  };

  const handleDateChange = (e) => {
      if(!e.target.value) return;
      updateGlobalSetting("targetDate", new Date(e.target.value).toISOString());
  };

  const formatDateForInput = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const local = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return local.toISOString().slice(0, 16);
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(inviteLink);
      setIsCopied(true); toast.success("Copied!"); setTimeout(() => setIsCopied(false), 2000);
  };

  // ==========================================
  // 4. HELPERS
  // ==========================================
  const filteredUsers = users.filter(user => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = (user.fullName || "").toLowerCase().includes(term) || (user.email || "").toLowerCase().includes(term);
      
      if (!matchesSearch) return false;

      if (filterStatus === "all") return true;
      if (filterStatus === "r1_started") return user.round1_status === "started";
      if (filterStatus === "r1_submitted") return user.round1_status === "submitted";
      if (filterStatus === "r2_submitted") return user.round2_status === "submitted";
      if (filterStatus === "disqualified") return user.round1_status === "disqualified" || user.round2_status === "disqualified";
      
      return true;
  });

  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'r1_started', label: 'R1 Active' },
    { id: 'r1_submitted', label: 'R1 Submitted' },
    { id: 'r2_submitted', label: 'R2 Submitted' },
    { id: 'disqualified', label: 'Flagged' }
  ];

  const StatBox = ({ label, value, color }) => (
    <div className={`p-4 rounded-xl border border-white/10 bg-[#111] flex flex-col items-center justify-center relative overflow-hidden group`}>
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${color.replace('text', 'from')} to-transparent transition-all duration-500`}></div>
        <span className="text-3xl font-bold text-white z-10">{value}</span>
        <span className={`text-[10px] uppercase tracking-widest ${color} z-10 font-bold mt-1`}>{label}</span>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const styles = {
        pending: "bg-gray-800 text-gray-400 border-gray-600",
        started: "bg-yellow-900/30 text-yellow-400 border-yellow-600/50",
        submitted: "bg-green-900/30 text-green-400 border-green-600/50",
        disqualified: "bg-red-900/30 text-red-400 border-red-600/50",
    };
    return <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${styles[status] || styles.pending}`}>{status || "Pending"}</span>;
  };


  // ==========================================
  // 5. EXPORT TO PROPER EXCEL (DIRECT FROM FIREBASE)
  // ==========================================
  const exportToExcel = async () => {
    const toastId = toast.loading("Fetching live data from database...");
    
    try {
      // 1. DIRECT FIREBASE CALL: Button dabte hi sabse fresh data mango
      const querySnapshot = await getDocs(collection(db, "users"));
      console.log(querySnapshot)
      const freshUsers = querySnapshot.docs.map(doc => ({ userId: doc.id, ...doc.data() }));

      // 2. Admin accounts filter karo
      const validUsers = freshUsers.filter(u => u.role !== 'admin'); 
      
      // 3. Sort Logic (Highest Total Score first)
      const sortedUsers = [...validUsers].sort((a, b) => {
          const scoreA = (a.round2_score || 0) + (a.round1_score || 0);
          const scoreB = (b.round2_score || 0) + (b.round1_score || 0);
          return scoreB - scoreA;
      });
      console.log(sortedUsers)

      // 4. Prepare data in JSON format for the Excel library
      const excelData = sortedUsers.map((u, index) => {
        const isFlagged = (u.round1_status === 'disqualified' || u.round2_status === 'disqualified') ? "YES" : "NO";
        const totalScore = (u.round1_score || 0) + (u.round2_score || 0);

        return {
          "Rank": index + 1,
          "Full Name": u.fullName || "Unknown",
          "Email Address": u.email || "N/A",
          "Round 1 Status": (u.round1_status || "pending").toUpperCase(),
          "Round 1 Score": u.round1_score || 0,
          "Round 2 Status": (u.round2_status || "pending").toUpperCase(),
          "Round 2 Score": u.round2_score || 0,
          "Total Score": totalScore,
          "Video Link": u.round2_video_link || "N/A",
          "Flagged (Cheating)": isFlagged
        };
      });

      // 5. Create a new Workbook and add the JSON data as a Worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Make columns wider for Excel
      worksheet["!cols"] = [
          { wch: 6 }, { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 12 }, 
          { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 40 }, { wch: 18 }
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Live Results");

      // 6. Trigger proper .xlsx file download
      const fileName = `AIPromptCombat_Live_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      toast.success("Excel Sheet Downloaded Successfully!", { id: toastId });
    } catch (error) {
      console.error("Export Error:", error);
      toast.error("Failed to fetch live data.", { id: toastId });
    }
  };

  // ==========================================
  // RENDER UI
  // ==========================================
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black relative">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 p-4 md:px-8 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                <ShieldAlert className="text-red-500" />
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    ADMIN <span className="text-[#D4AF37]">NEXUS</span>
                    <span className="flex h-2 w-2 relative ml-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                </h1>
            </div>
        </div>
        <div className="flex gap-3">
            <button onClick={handleForceRefresh} className={`p-2 rounded-lg border border-white/10 hover:text-white ${isRefreshing ? "animate-spin text-[#D4AF37]" : "text-gray-400"}`}><RefreshCw size={18} /></button>
            <button onClick={() => navigate("/lobby")} className="text-gray-400 hover:text-white text-sm flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg"><LogOut size={16} /> Exit</button>
        </div>
      </header>

      {/* TABS */}
      <div className="flex border-b border-white/5 bg-[#080808]">
          {['overview', 'users', 'lobby'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === tab ? "text-[#D4AF37] border-b-2 border-[#D4AF37] bg-[#D4AF37]/5" : "text-gray-500 hover:text-white"}`}>{tab}</button>
          ))}
      </div>

      <main className="p-6 md:p-8 max-w-7xl mx-auto">
        
        {/* ==================== TAB 1: OVERVIEW ==================== */}
        {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-2xl border transition-all ${globalSettings.round1Open ? "bg-emerald-900/10 border-emerald-500/50" : "bg-[#111] border-white/10"}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-white"><Terminal size={20}/> R1 (Image)</h3>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${globalSettings.round1Open ? "bg-emerald-500 text-black shadow-[0_0_10px_#10b981]" : "bg-gray-800 text-gray-400"}`}>{globalSettings.round1Open ? "OPEN" : "CLOSED"}</span>
                        </div>
                        <button onClick={() => updateGlobalSetting("round1Open", !globalSettings.round1Open)} className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg ${globalSettings.round1Open ? "bg-red-500 hover:bg-red-600 text-white" : "bg-emerald-500 hover:bg-emerald-600 text-black"}`}>
                            {globalSettings.round1Open ? "LOCK ACCESS" : "UNLOCK ACCESS"}
                        </button>
                    </div>

                    <div className={`p-6 rounded-2xl border transition-all ${globalSettings.round2Open ? "bg-[#D4AF37]/10 border-[#D4AF37]" : "bg-[#111] border-white/10"}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-white"><FileVideo size={20}/> R2 (Video)</h3>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${globalSettings.round2Open ? "bg-[#D4AF37] text-black shadow-[0_0_10px_#D4AF37]" : "bg-gray-800 text-gray-400"}`}>{globalSettings.round2Open ? "OPEN" : "CLOSED"}</span>
                        </div>
                        <button onClick={() => updateGlobalSetting("round2Open", !globalSettings.round2Open)} className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg ${globalSettings.round2Open ? "bg-red-500 hover:bg-red-600 text-white" : "bg-[#D4AF37] hover:bg-[#b8952b] text-black"}`}>
                            {globalSettings.round2Open ? "LOCK ACCESS" : "UNLOCK ACCESS"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatBox label="Total Users" value={users.length} color="text-blue-400" />
                    <StatBox label="R1 Active" value={users.filter(u => u.round1_status === 'started').length} color="text-emerald-400" />
                    <StatBox label="R2 Submitted" value={users.filter(u => u.round2_status === 'submitted').length} color="text-[#D4AF37]" />
                    <StatBox label="Flagged" value={users.filter(u => u.round1_status === 'disqualified' || u.round2_status === 'disqualified').length} color="text-red-500" />
                </div>
            </div>
        )}

        {/* ==================== TAB 2: USERS ==================== */}
        {activeTab === "users" && (
            <div className="animate-in fade-in">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-[#111] p-4 rounded-xl border border-white/5">
                    <div className="relative w-full md:w-1/2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input type="text" placeholder="Search by Name or Email..." className="w-full bg-black border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-[#D4AF37] outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
                        {filterOptions.map(f => (
                            <button 
                                key={f.id} 
                                onClick={() => setFilterStatus(f.id)} 
                                className={`px-3 py-2 rounded text-xs font-bold uppercase whitespace-nowrap border transition-all ${filterStatus === f.id ? "bg-[#D4AF37] text-black border-[#D4AF37]" : "bg-transparent text-gray-400 border-white/10 hover:border-white/30"}`}
                            >
                                {f.label}
                            </button>
                        ))}
                        <button onClick={() => { setIsAddModalOpen(true); setInviteLink(""); }} className="ml-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-bold text-xs uppercase flex items-center gap-2 shadow-lg"><UserPlus size={16}/> Add User</button>
                    </div>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-xs text-gray-400 uppercase font-mono">
                                <tr><th className="p-4">Participant</th><th className="p-4">R1 Status</th><th className="p-4">R2 Status</th><th className="p-4">Evidence</th><th className="p-4 text-right">Actions</th></tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {filteredUsers.map(u => (
                                    <tr key={u.userId} className="hover:bg-white/[0.02]">
                                        <td className="p-4">
                                            <div className="font-bold text-white">{u.fullName || "Unknown"}</div>
                                            <div className="text-xs text-gray-500">{u.email}</div>
                                        </td>
                                        <td className="p-4"><StatusBadge status={u.round1_status} /></td>
                                        <td className="p-4"><StatusBadge status={u.round2_status} /></td>
                                        <td className="p-4">
                                            {u.round2_video_link ? (
                                                <a href={u.round2_video_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#D4AF37] hover:underline bg-[#D4AF37]/10 px-2 py-1 rounded w-fit text-xs font-bold">
                                                    <Play size={12} /> Play
                                                </a>
                                            ) : <span className="text-gray-600">-</span>}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => {setSelectedUser(u); setIsEditModalOpen(true)}} className="px-3 py-1.5 bg-white/5 text-white rounded hover:bg-[#D4AF37] hover:text-black text-xs font-bold uppercase flex items-center gap-2 ml-auto">
                                                <Edit3 size={14} /> Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr><td colSpan="5" className="p-8 text-center text-gray-500 font-mono">No operatives match current filters.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* ==================== TAB 3: LOBBY CONFIG ==================== */}
        {activeTab === "lobby" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
                
                <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Calendar size={20} className="text-[#D4AF37]" /> Timer Setup</h3>
                    <input type="datetime-local" className="bg-black border border-white/20 rounded p-3 text-white w-full focus:border-[#D4AF37] outline-none"
                        value={formatDateForInput(globalSettings.targetDate)} onChange={handleDateChange} />
                </div>

                <div className="bg-[#111] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                    <h3 className="text-lg font-bold text-[#D4AF37] mb-2 flex items-center gap-2"><Users size={20} /> R2 Qualification Limit</h3>
                    <p className="text-xs text-gray-400 mb-4">Set how many top players from Leaderboard can access Round 2.</p>
                    <div className="flex gap-4 items-center">
                        <input 
                            type="number" 
                            className="bg-black border border-white/20 rounded p-3 text-white w-20 focus:border-[#D4AF37] text-center font-bold text-xl outline-none"
                            value={topNInput} 
                            onChange={(e) => setTopNInput(e.target.value)} 
                        />
                        <button onClick={handleSaveTopN} className="bg-[#D4AF37] text-black px-4 py-3 rounded hover:bg-[#b8952b] font-bold text-sm">SET LIMIT</button>
                    </div>
                </div>

                {/* 📊 REAL-TIME EXCEL EXPORT BUTTON */}
                <div className="bg-[#111] border border-green-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(34,197,94,0.1)] flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-green-400 mb-2 flex items-center gap-2"><Download size={20} /> Export Results (.xlsx)</h3>
                        <p className="text-xs text-gray-400 mb-4">Download real-time leaderboard with proper Excel formatting.</p>
                    </div>
                    <button onClick={exportToExcel} className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-500 font-bold text-sm uppercase flex items-center justify-center gap-2 shadow-lg">
                        <Download size={16} /> Download Excel
                    </button>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-2xl p-6 lg:col-span-3">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><MessageSquare size={20} className="text-blue-400" /> Live Feed</h3>
                    <div className="flex gap-2 mb-4">
                        <input type="text" placeholder="Type announcement..." className="flex-1 bg-black border border-white/20 rounded p-3 text-white focus:border-blue-400 outline-none"
                            value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddUpdate()} />
                        <button onClick={handleAddUpdate} className="bg-blue-600 text-white px-6 rounded hover:bg-blue-500 font-bold text-sm">SEND</button>
                    </div>
                    <div className="bg-black/50 rounded-xl p-4 h-48 overflow-y-auto border border-white/5 space-y-2 mb-2 custom-scrollbar">
                        {globalSettings.updates && globalSettings.updates.map((msg, i) => (
                            <div key={i} className="flex justify-between items-start text-sm border-b border-white/5 pb-2">
                                <div><span className="text-gray-500 text-xs font-mono mr-2">[{msg.time}]</span><span className="text-gray-300">{msg.text}</span></div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => {if(window.confirm("Clear all messages?")) updateGlobalSetting("updates", [])}} className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1"><Trash2 size={12} /> Clear History</button>
                </div>
            </div>
        )}

      </main>

      {/* ================================= MODAL 1: ADD USER ================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-[#111] border border-white/20 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in-95">
                <div className="p-6 border-b border-white/10 bg-[#151515] flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><UserPlus size={20} className="text-blue-400" /> Add Participant</h2>
                    <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24}/></button>
                </div>

                <div className="p-6 space-y-4">
                    {!inviteLink ? (
                        <>
                            <div className="p-3 bg-blue-900/20 border border-blue-500/20 rounded text-xs text-blue-200 flex gap-2">
                                <AlertTriangle size={14} className="shrink-0" />
                                <span>Creates Auth account & DB record. Generates password setup link.</span>
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Full Name</label>
                                <input className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-blue-500 outline-none" placeholder="John Doe" value={newUser.fullName} onChange={(e) => setNewUser({...newUser, fullName: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Email Address</label>
                                <input className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-blue-500 outline-none" placeholder="john@example.com" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
                            </div>
                            <button onClick={handleCreateUser} className="w-full py-3 rounded bg-blue-600 text-white font-bold hover:bg-blue-500 shadow-lg mt-2">Generate Account</button>
                        </>
                    ) : (
                        <div className="animate-in fade-in text-center">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-green-500"><Check size={24} /></div>
                            <h3 className="text-lg font-bold text-white mb-1">Account Created!</h3>
                            <p className="text-xs text-gray-400 mb-4">Share this link with the user to set their password.</p>
                            
                            <div className="bg-[#050505] border border-white/10 rounded-lg p-3 flex items-center gap-3 mb-6">
                                <LinkIcon size={16} className="text-[#D4AF37]" />
                                <input readOnly value={inviteLink} className="flex-1 bg-transparent text-xs text-gray-300 outline-none font-mono truncate" />
                                <button onClick={copyToClipboard} className="p-2 bg-white/10 rounded hover:bg-white/20 text-white transition-all">
                                    {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                </button>
                            </div>
                            <button onClick={() => { setIsAddModalOpen(false); setInviteLink(""); }} className="w-full py-3 bg-[#151515] border border-white/10 text-gray-400 hover:text-white rounded font-bold text-xs uppercase">Close</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* ================================= MODAL 2: EDIT/DELETE USER ================================= */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-[#111] border border-white/20 rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 my-10 flex flex-col">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#151515]">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Edit3 size={20} className="text-[#D4AF37]" /> Manage User</h2>
                        <p className="text-xs text-gray-500 font-mono mt-1">ID: {selectedUser.userId}</p>
                    </div>
                    <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full"><X size={24}/></button>
                </div>
                
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Profile */}
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Full Name</label><input className="w-full bg-black border border-white/10 rounded p-2 text-white text-sm focus:border-[#D4AF37] outline-none" value={selectedUser.fullName || ""} onChange={(e) => setSelectedUser({...selectedUser, fullName: e.target.value})} /></div>
                        <div><label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Email</label><input disabled className="w-full bg-black/50 border border-white/5 rounded p-2 text-gray-500 text-sm cursor-not-allowed" value={selectedUser.email} /></div>
                    </div>

                    {/* Round 1 */}
                    <div className="p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-xl">
                        <div className="flex justify-between mb-3 items-center">
                            <h3 className="text-sm font-bold text-emerald-400 uppercase flex items-center gap-2"><Terminal size={16}/> Round 1</h3>
                            <div className="flex gap-2">
                                <button onClick={() => quickUpdateStatus('round1', 'pending')} className="text-[10px] bg-gray-800 px-3 py-1 rounded hover:bg-white/10 text-white flex items-center gap-1"><RotateCcw size={10}/> Reset</button>
                                <button onClick={() => quickUpdateStatus('round1', 'disqualified')} className="text-[10px] bg-red-900/50 text-red-400 px-3 py-1 rounded hover:bg-red-900 flex items-center gap-1"><Ban size={10}/> Ban</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <select className="bg-black border border-white/10 rounded p-2 text-sm text-white" value={selectedUser.round1_status || "pending"} onChange={(e) => setSelectedUser({...selectedUser, round1_status: e.target.value})}>
                                <option value="pending">Pending</option><option value="started">Started</option><option value="submitted">Submitted</option><option value="disqualified">Disqualified</option>
                            </select>
                            <input type="number" placeholder="Score" className="bg-black border border-white/10 rounded p-2 text-sm text-white" value={selectedUser.round1_score || 0} onChange={(e) => setSelectedUser({...selectedUser, round1_score: Number(e.target.value)})} />
                        </div>
                    </div>

                    {/* Round 2 */}
                    <div className="p-4 bg-amber-900/10 border border-[#D4AF37]/20 rounded-xl">
                        <div className="flex justify-between mb-3 items-center">
                            <h3 className="text-sm font-bold text-[#D4AF37] uppercase flex items-center gap-2"><FileVideo size={16}/> Round 2</h3>
                            <div className="flex gap-2">
                                <button onClick={() => quickUpdateStatus('round2', 'pending')} className="text-[10px] bg-gray-800 px-3 py-1 rounded hover:bg-white/10 text-white flex items-center gap-1"><RotateCcw size={10}/> Reset</button>
                                <button onClick={() => quickUpdateStatus('round2', 'disqualified')} className="text-[10px] bg-red-900/50 text-red-400 px-3 py-1 rounded hover:bg-red-900 flex items-center gap-1"><Ban size={10}/> Ban</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                            <select className="bg-black border border-white/10 rounded p-2 text-sm text-white" value={selectedUser.round2_status || "pending"} onChange={(e) => setSelectedUser({...selectedUser, round2_status: e.target.value})}>
                                <option value="pending">Pending</option><option value="submitted">Submitted</option><option value="disqualified">Disqualified</option>
                            </select>
                            <input type="number" placeholder="Score" className="bg-black border border-white/10 rounded p-2 text-sm text-white" value={selectedUser.round2_score || 0} onChange={(e) => setSelectedUser({...selectedUser, round2_score: Number(e.target.value)})} />
                        </div>
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <input placeholder="Video URL" className="flex-1 bg-black border border-white/10 rounded p-2 text-sm text-white" value={selectedUser.round2_video_link || ""} onChange={(e) => setSelectedUser({...selectedUser, round2_video_link: e.target.value})} />
                                {selectedUser.round2_video_link && <a href={selectedUser.round2_video_link} target="_blank" rel="noreferrer" className="bg-[#D4AF37] text-black px-3 rounded flex items-center text-xs font-bold hover:bg-[#b8952b]">VIEW</a>}
                            </div>
                            <textarea placeholder="Prompt" className="w-full bg-black border border-white/10 rounded p-2 text-sm text-white h-16 resize-none" value={selectedUser.round2_prompt || ""} onChange={(e) => setSelectedUser({...selectedUser, round2_prompt: e.target.value})} />
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/10 bg-[#151515] flex justify-between items-center">
                    <button onClick={() => handleDeleteUser(selectedUser.userId)} className="text-red-500 hover:text-red-400 flex items-center gap-2 text-sm font-bold opacity-80 hover:opacity-100 hover:bg-red-500/10 px-3 py-2 rounded transition-all">
                        <Trash2 size={16} /> Delete Forever
                    </button>
                    <div className="flex gap-3">
                        <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded bg-transparent border border-white/10 text-white hover:bg-white/5">Cancel</button>
                        <button onClick={handleSaveUser} className="px-6 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-500 flex items-center gap-2 shadow-lg shadow-blue-900/20">
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}