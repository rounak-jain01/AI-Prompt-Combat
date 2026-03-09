import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Lenis from "@studio-freight/lenis";

// Pages & Components
import Navbar from "./components/Navbar/Navbar";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Lobby from "./pages/Lobby";
import Round1Rules from "./pages/Round1Rules";
import Round1 from "./pages/Round1";
import LeaderboardDashboard from './pages/LeaderboardDashboard';
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Round2Rules from "./pages/Round2Rules";
import Round2 from "./pages/Round2";

// 🛡️ Security Guards (Imports add kiye hain)
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Layout Component for Pages WITH Navbar
const LayoutWithNavbar = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-dark text-white selection:bg-[#FFD700] selection:text-black">
        <Toaster
          position="top-center"
          reverseOrder={false}
          containerStyle={{ top: 80, zIndex: 99999 }}
          toastOptions={{
            style: {
              background: "#0A0A0A",
              color: "#fff",
              border: "1px solid #333",
            },
            success: {
              style: { border: "1px solid #D4AF37", color: "#D4AF37" },
              iconTheme: { primary: "#D4AF37", secondary: "#000" },
            },
          }}
        />

        <Routes>
          {/* 🟢 PUBLIC ROUTES (Bina login ke dekh sakte hain) */}
          <Route path="/" element={<LayoutWithNavbar><LandingPage /></LayoutWithNavbar>} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* 🟡 PROTECTED ROUTES (Sirf Login wale bacche ja sakte hain) */}
          <Route
            path="/lobby"
            element={
              <ProtectedRoute>
                <LayoutWithNavbar>
                  <Lobby />
                </LayoutWithNavbar>
              </ProtectedRoute>
            }
          />
          <Route path="/round-1/rules" element={<ProtectedRoute><Round1Rules /></ProtectedRoute>} />
          <Route path="/round1" element={<ProtectedRoute><Round1 /></ProtectedRoute>} />
          <Route path="/round-2/rules" element={<ProtectedRoute><Round2Rules /></ProtectedRoute>} />
          <Route path="/round-2" element={<ProtectedRoute><Round2 /></ProtectedRoute>} />
          
          {/* Note: Agar aap chahte hain ki Leaderboard sab dekhein, toh ProtectedRoute hata sakte hain */}
          <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardDashboard /></ProtectedRoute>} />

          {/* 🔴 ADMIN ROUTE (Sirf Admin ja sakta hai) */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute> 
                <AdminDashboard /> 
              </AdminRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;