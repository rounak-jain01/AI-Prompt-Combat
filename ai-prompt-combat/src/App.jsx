import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Lenis from "@studio-freight/lenis";

import Navbar from "./components/Navbar/Navbar";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Lobby from "./pages/Lobby";
import Round1Rules from "./pages/Round1Rules";
import Round1 from "./pages/Round1";
import LeaderboardDashboard from './pages/LeaderboardDashboard';
import AdminDashboard from "./pages/Admin/AdminDashboard";

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
          {/* PAGES WITH NAVBAR */}
          <Route
            path="/"
            element={
              <LayoutWithNavbar>
                <LandingPage />
              </LayoutWithNavbar>
            }
          />
          <Route
            path="/lobby"
            element={
              <LayoutWithNavbar>
                <Lobby />
              </LayoutWithNavbar>
            }
          />
          {/* PAGES WITHOUT NAVBAR (Clean Layout) */}
          <Route path="/round-1/rules" element={<Round1Rules />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/round1" element={<Round1 />} />{" "}
          <Route path="/leaderboard" element={<LeaderboardDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* No Navbar Here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
