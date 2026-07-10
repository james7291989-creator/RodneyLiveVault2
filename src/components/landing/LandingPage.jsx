import React from 'react';

const LandingPage = ({ onEnterTerminal }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation Row */}
      <header className="border-b border-slate-900 px-6 py-4 flex justify-between items-center bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-sm tracking-widest text-slate-400 uppercase">RODNEY & SONS // SYSTEMS</span>
        </div>
        <button 
          onClick={onEnterTerminal} 
          className="font-mono text-xs text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded bg-emerald-950/20 hover:bg-emerald-500 hover:text-slate-950 transition-all duration-300 tracking-wider uppercase">
          Portal Login
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto py-12">
        <div className="inline-block mb-4 px-3 py-1 bg-emerald-950/40 border border-emerald-500/20 rounded text-emerald-400 font-mono text-xs tracking-widest uppercase animate-fade-in">
          Asset Vault Architecture v2.0 Live
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 uppercase">
          Institutional Off-Market <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Intelligence Streams</span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mb-10 leading-relaxed">
          Automated underwriter processing, instant LLC veil piercing, and smart contract orchestration engineered for rapid volume acquisition.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={onEnterTerminal}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-500 text-slate-950 font-mono font-bold uppercase tracking-wider rounded shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all duration-300 transform hover:-translate-y-0.5">
            Launch Apex Terminal
          </button>
        </div>
      </main>

      {/* Feature Footprint Row */}
      <section className="border-t border-slate-900 bg-slate-900/20 py-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left font-mono text-xs text-slate-500">
          <div className="border-l-2 border-emerald-500/20 pl-4">
            <span className="text-slate-300 block font-bold uppercase mb-1 font-sans text-sm">01 / ANALYTICS</span>
            SV-1500 Core calculation models evaluating raw assets automatically.
          </div>
          <div className="border-l-2 border-emerald-500/20 pl-4">
            <span className="text-slate-300 block font-bold uppercase mb-1 font-sans text-sm">02 / DEPLOYMENT</span>
            Digital Escrow pipeline syncing directly with remote signing nodes.
          </div>
          <div className="border-l-2 border-emerald-500/20 pl-4">
            <span className="text-slate-300 block font-bold uppercase mb-1 font-sans text-sm">03 / VELOCITY</span>
            Capped DOM rendering logic running zero-latency off-market streams.
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;


