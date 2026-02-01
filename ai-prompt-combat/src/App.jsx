import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import Lenis from '@studio-freight/lenis';

// IMPORT PAGES
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Lobby from './pages/Lobby';
import Round1 from './pages/Round1'; // New Import

function App() {
  
  // Smooth Scroll Effect (Lenis)
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
      <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FFD700] selection:text-black">
        
        {/* === GLOBAL NOTIFICATIONS (TOASTER) === */}
        <Toaster 
          position="top-center"
          reverseOrder={false}
          containerStyle={{
            top: 40,
            zIndex: 99999, // Ensures it shows above everything
          }}
          toastOptions={{
            style: {
              background: '#0A0A0A',
              color: '#fff',
              border: '1px solid #333',
              fontSize: '14px',
            },
            success: {
              style: {
                border: '1px solid #D4AF37', // Gold Border for Success
                color: '#D4AF37',
              },
              iconTheme: {
                primary: '#D4AF37',
                secondary: '#000',
              },
            },
            error: {
              style: {
                border: '1px solid #ef4444', // Red Border for Error
                color: '#ef4444',
              },
            },
          }}
        />

        <Routes>
          {/* LANDING PAGE (With Navbar) */}
          <Route 
            path="/" 
            element={
              <>
                <Navbar />
                <LandingPage />
              </>
            } 
          />

          {/* AUTH PAGES */}
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
          {/* DASHBOARD & ROUNDS */}
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/round-1" element={<Round1 />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;