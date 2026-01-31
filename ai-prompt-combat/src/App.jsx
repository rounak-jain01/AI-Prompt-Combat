import React from 'react';
import Navbar from './components/Navbar/Navbar'; // Navbar Global rakha hai
import LandingPage from './pages/LandingPage';   // New Page Import

function App() {
  return (
    <div className="min-h-screen bg-dark text-white selection:bg-[#FFD700] selection:text-black">
      {/* Navbar har page par dikhega isliye yahan rakha hai */}
      <Navbar /> 
      
      {/* Main Landing Page Content */}
      <LandingPage />
    </div>
  );
}

export default App;