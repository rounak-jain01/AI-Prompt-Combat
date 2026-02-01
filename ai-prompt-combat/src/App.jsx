import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import Lenis from '@studio-freight/lenis';

import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Lobby from './pages/Lobby';

function App() {
  
  useEffect(() => {
    // Lenis scroll code
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
        
        {/* === TOASTER FIX === */}
        <Toaster 
          position="top-center"
          reverseOrder={false}
          containerStyle={{
            top: 40,
            left: 20,
            bottom: 20,
            right: 20,
            zIndex: 99999, 
          }}
          toastOptions={{
            style: {
              background: '#111',
              color: '#fff',
              border: '1px solid #D4AF37',
              boxShadow: '0 0 10px rgba(212,175,55,0.2)',
            },
            success: {
              iconTheme: { primary: '#D4AF37', secondary: '#000' },
            }
          }}
        />

        <Routes>
          <Route path="/" element={<><Navbar /><LandingPage /></>} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/lobby" element={<Lobby />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;