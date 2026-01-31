import React from 'react';

const Lobby = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-[#D4AF37] mb-4">Welcome to the Lobby</h1>
      <p className="text-gray-400">Waiting for the event to start...</p>
    </div>
  );
};

export default Lobby;