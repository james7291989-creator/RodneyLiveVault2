import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function ContractSniper({ property }) {
  const { session } = useAuth();
  const [status, setStatus] = useState('STANDBY'); // STANDBY, FIRING, CONFIRMED, ERROR
  const [log, setLog] = useState('');

  const executeSnipe = async () => {
    if (!property || !property.address) {
      setLog("[-] CRITICAL: NO TARGET ACQUIRED.");
      setStatus('ERROR');
      return;
    }

    setStatus('FIRING');
    setLog("[*] UPLINK ESTABLISHED. FORGING ENVELOPE...");

    try {
      // Pointing directly to your live Render Python backend
      const API_URL = process.env.REACT_APP_API_URL || 'https://rodney-vault-api.onrender.com';
      
      const response = await fetch(${API_URL}/api/contract/snipe, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Bearer 
        },
        body: JSON.stringify({
          address: property.address,
          mao: property.mao || 0,
          agent_name: property.owner_name || 'PENDING OWNER',
          mailing_address: property.mailing_address || 'PENDING ADDRESS'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Sniper Misfire");
      }

      setStatus('CONFIRMED');
      setLog([+] PAYLOAD DELIVERED. STATUS: );
    } catch (err) {
      setStatus('ERROR');
      setLog([-] EXECUTION FAILED: );
    }
  };

  return (
    <div className="w-full bg-black/60 backdrop-blur-md border border-red-900/50 p-6 rounded-xl shadow-[0_0_30px_-10px_rgba(220,38,38,0.15)] mt-4 relative overflow-hidden">
      {/* Target Crosshair Visual */}
      <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
        <svg className="w-32 h-32 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v4m0 8v4m8-8h-4M8 12H4m15.364-6.364l-2.828 2.828m-8.486 8.486l-2.828 2.828m14.142 0l-2.828-2.828M6.343 6.343l2.828 2.828"></path>
        </svg>
      </div>

      <h3 className="text-xl font-bold text-white mb-1 tracking-wider flex items-center gap-2">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
        CONTRACT SNIPER
      </h3>
      <p className="text-red-500/70 text-xs font-mono uppercase tracking-widest mb-6">Automated DocuSign Deployment</p>

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm font-mono text-zinc-300 relative z-10">
        <div className="bg-zinc-950/80 p-3 rounded border border-red-900/30">
          <span className="text-zinc-500 block text-xs mb-1">TARGET ASSET</span>
          <span className="text-white">{property?.address || "AWAITING TARGET"}</span>
        </div>
        <div className="bg-zinc-950/80 p-3 rounded border border-red-900/30">
          <span className="text-zinc-500 block text-xs mb-1">MAX ALLOWABLE OFFER (MAO)</span>
          <span className="text-emerald-400 font-bold"></span>
        </div>
      </div>

      <button
        onClick={executeSnipe}
        disabled={status === 'FIRING' || !property?.address}
        className="w-full relative z-10 group overflow-hidden rounded-lg bg-red-900 border border-red-500/50 px-4 py-4 text-white transition-all hover:bg-red-700 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-bold tracking-widest text-lg"
      >
        {status === 'FIRING' ? 'TRANSMITTING PAYLOAD...' : status === 'CONFIRMED' ? 'ENVELOPE DEPLOYED' : 'FIRE CONTRACT'}
      </button>

      {log && (
        <div className={mt-4 p-3 rounded text-xs font-mono border relative z-10 }>
          {log}
        </div>
      )}
    </div>
  );
}
