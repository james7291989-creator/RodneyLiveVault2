import React, { useState } from 'react';
import { Terminal, Database, Server, Cpu, Play, AlertTriangle, ShieldAlert, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function SV1500Core() {
  const { user } = useAuth();
  // EXTREME SECURITY: Only the Commander's exact email bypasses the firewall.
  const isGodMode = user?.email === 'james7291989@gmail.com';
  
  const [logs, setLogs] = useState([
    '[SYSTEM INITIATED] SV-1500 Core Online.', 
    'Secure connection to Render Python Backend established.',
    'Awaiting CEO command override...'
  ]);

  if (!isGodMode) {
    return (
      <div className="min-h-screen bg-red-950 text-red-500 font-mono flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem] z-0 pointer-events-none"></div>
        <div className="text-center border-2 border-red-500/50 p-12 rounded bg-black relative z-10 shadow-[0_0_50px_rgba(255,0,0,0.2)]">
          <ShieldAlert className="w-20 h-20 mx-auto mb-6 text-red-500 animate-pulse" />
          <h1 className="text-4xl font-black uppercase tracking-widest mb-2">RESTRICTED ZONE</h1>
          <p className="text-sm tracking-widest">CLEARANCE LEVEL: GOD MODE REQUIRED.</p>
          <p className="text-[10px] text-red-500/50 mt-4 uppercase">Intrusion attempt logged.</p>
        </div>
      </div>
    );
  }

  const addLog = (msg) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  // ---> THE LIVE RENDER DETONATOR <---
  const triggerScraper = async (botName) => {
    addLog(`Initiating stealth sequence: ${botName}...`);
    try {
      // Striking the live Render Python Backend
      const response = await fetch(`https://rodney-vault-api.onrender.com/api/trigger/${botName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error("Render Backend Shield Active (Connection Failed)");
      
      const data = await response.json();
      addLog(`[SUCCESS] ${data.message}`);
    } catch (error) {
      addLog(`[CRITICAL ERROR] ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#010103] text-white font-mono relative p-8 pb-20">
      {/* BACKGROUND GRID */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] z-0 pointer-events-none opacity-20"></div>

      <header className="relative z-10 mb-8 border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-[#80DEEA] flex items-center gap-3">
            <Terminal className="w-8 h-8" /> SV-1500 Core
          </h1>
          <p className="text-gray-400 text-xs tracking-widest uppercase mt-2">Master Override & Autonomous Scraper Terminal</p>
        </div>
        <div className="flex gap-6 text-[10px] font-bold tracking-widest border border-white/10 bg-black/50 px-4 py-2 rounded">
          <span className="flex items-center gap-2 text-green-400"><Database className="w-3 h-3"/> VAULT: SECURE</span>
          <span className="flex items-center gap-2 text-[#80DEEA]"><Cpu className="w-3 h-3"/> GEMINI: ARMED</span>
          <span className="flex items-center gap-2 text-green-400"><Server className="w-3 h-3"/> RENDER: AWAKE</span>
        </div>
      </header>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TACTICAL TRIGGERS */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-[#80DEEA] font-black uppercase tracking-widest text-sm mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Deploy Stealth Bots
          </h2>
          
          <button onClick={() => triggerScraper('lra_pdf_importer.py')} className="w-full bg-black/50 border border-white/10 p-4 rounded hover:border-[#80DEEA]/50 hover:bg-white/5 transition-all flex items-center justify-between group">
            <div className="text-left">
              <p className="font-bold text-sm text-white">LRA Importer</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Scrape STL PDF Lists</p>
            </div>
            <Play className="w-4 h-4 text-gray-600 group-hover:text-[#80DEEA]" />
          </button>

          <button onClick={() => triggerScraper('county_sweeper.py')} className="w-full bg-black/50 border border-white/10 p-4 rounded hover:border-[#80DEEA]/50 hover:bg-white/5 transition-all flex items-center justify-between group">
            <div className="text-left">
              <p className="font-bold text-sm text-white">County Sweeper</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Tax Delinquent Extraction</p>
            </div>
            <Play className="w-4 h-4 text-gray-600 group-hover:text-[#80DEEA]" />
          </button>

          <button onClick={() => triggerScraper('Apex_Mass_Injector.py')} className="w-full bg-red-900/10 border border-red-500/30 p-4 rounded hover:border-red-500 hover:bg-red-900/20 transition-all flex items-center justify-between group mt-8">
            <div className="text-left">
              <p className="font-bold text-sm text-red-400 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Mass Injector</p>
              <p className="text-[10px] text-red-500/70 uppercase tracking-widest">Force Push to Supabase</p>
            </div>
            <Play className="w-4 h-4 text-red-500/50 group-hover:text-red-400" />
          </button>
        </div>

        {/* LIVE TERMINAL FEED */}
        <div className="lg:col-span-2 bg-black border border-white/10 rounded-xl p-4 flex flex-col h-[500px] shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
            <Terminal className="w-4 h-4 text-gray-500" />
            <h2 className="text-gray-400 font-bold uppercase tracking-widest text-xs">Live Output Stream</h2>
          </div>
          <div className="flex-1 overflow-y-auto font-mono text-xs space-y-2 custom-scrollbar">
            {logs.map((log, i) => (
              <div key={i} className={`${log.includes('SUCCESS') ? 'text-green-400' : log.includes('ERROR') ? 'text-red-500' : log.includes('SYSTEM INITIATED') ? 'text-[#80DEEA]' : 'text-gray-300'}`}>
                {log}
              </div>
            ))}
            <div className="text-gray-600 animate-pulse mt-4">_</div>
          </div>
        </div>
      </div>
    </div>
  );
}