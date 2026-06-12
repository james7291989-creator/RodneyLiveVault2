import React, { useState } from 'react';

export default function AvailableDeals() {
  const [address, setAddress] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const initiateScan = async () => {
    if (!address) return;
    setIsScanning(true);
    // Strike 1: UI intercepts the address.
    // Strike 2 will replace this with the live Render Python API trigger.
    console.log("TARGET ACQUIRED. PREPARING DATA TRANSMISSION TO PYTHON CORE:", address);
    
    // Simulate the engine spinning up for the UI feel
    setTimeout(() => {
      setIsScanning(false);
      setAddress('');
      alert("DATA CORE READY: Address logged in terminal. Waiting for Python API connection in Strike 2.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl p-[1px] bg-gradient-to-b from-gray-700 via-gray-900 to-black rounded-2xl shadow-2xl border border-gray-800">
        <div className="bg-black/95 p-12 rounded-2xl backdrop-blur-xl flex flex-col items-center">
          
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <h1 className="text-[#C1A173] text-xs tracking-[0.4em] uppercase font-bold">St. Louis Acquisition Pipeline</h1>
          </div>
          
          <h2 className="text-5xl font-light mb-12 tracking-widest text-gray-300">ASSET <span className="font-bold text-white">VAULT</span></h2>

          <div className="w-full mb-8 relative">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-[#C1A173]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="ENTER MISSOURI PROPERTY ADDRESS..."
              className="w-full bg-gray-900/80 border border-gray-700 text-white pl-16 pr-6 py-6 rounded-xl focus:outline-none focus:border-[#C1A173] focus:ring-1 focus:ring-[#C1A173] transition-all text-xl tracking-wide placeholder-gray-600 shadow-inner"
            />
          </div>

          <button
            onClick={initiateScan}
            disabled={isScanning}
            className="w-full bg-[#C1A173] text-black font-extrabold text-xl py-6 rounded-xl hover:bg-white hover:shadow-[0_0_40px_rgba(193,161,115,0.6)] transition-all tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed uppercase"
          >
            {isScanning ? 'EXECUTING QUANTUM SCAN...' : 'INITIATE QUANTUM SCAN'}
          </button>
          
        </div>
      </div>
    </div>
  );
}
