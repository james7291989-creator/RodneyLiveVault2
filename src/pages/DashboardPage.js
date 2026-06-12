import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ContractSniper from '../components/ContractSniper';

export default function DashboardPage() {
  const { user, signOut, session } = useAuth();
  const navigate = useNavigate();
  const [addressInput, setAddressInput] = useState('');
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'https://rodney-vault-api.onrender.com';

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const executeQuantumScan = async () => {
    if (!addressInput) return;
    setLoading(true);
    setPropertyData(null);
    setLog('[*] INITIATING QUANTUM SCAN. BYPASSING FIREWALLS...');
    
    try {
      const response = await fetch(${API_URL}/api/v1/analyze/quantum, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Bearer 
        },
        body: JSON.stringify({ address: addressInput })
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      setLog('[+] ASSET LOCATED. INITIATING LLC UNMASKING PROTOCOL...');
      
      // Chain the unmasking strike immediately
      const unmaskResponse = await fetch(${API_URL}/api/unmask, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Bearer 
        },
        body: JSON.stringify({ address: data.mailing_address, owner_name: data.owner_name })
      });
      
      const unmaskData = await unmaskResponse.json();
      
      if (!unmaskResponse.ok) throw new Error(unmaskData.error);
      
      setPropertyData({
        ...data,
        registered_agent: unmaskData.registered_agent,
        mailing_address: unmaskData.mailing_address,
        intel_source: unmaskData.intel_source
      });
      
      setLog('[+] SCAN COMPLETE. TARGET ASSET UNMASKED AND LOCKED.');
    } catch (err) {
      setLog([-] SCAN FAILED: );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans relative overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-cyan-900/50 pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">RODNEY <span className="text-cyan-400">&</span> SONS</h1>
            <p className="text-cyan-500/70 text-xs font-mono uppercase tracking-widest mt-1">Institutional Deal Flow // War Room</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-xs font-mono">
              <span className="text-zinc-400 block">OPERATOR ALIAS</span>
              <span className="text-cyan-400">{user?.user_metadata?.full_name || user?.email}</span>
            </div>
            <button onClick={handleLogout} className="border border-red-900/50 hover:bg-red-900/20 text-red-400 px-4 py-2 rounded text-xs font-mono transition-colors">
              TERMINATE CONNECTION
            </button>
          </div>
        </div>

        {/* Command Console */}
        <div className="bg-zinc-950 border border-cyan-900/30 p-6 rounded-xl shadow-[0_0_30px_-15px_rgba(6,182,212,0.2)] mb-6">
          <h2 className="text-sm font-mono text-cyan-500 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            ASSET TARGETING SYSTEM
          </h2>
          <div className="flex gap-4">
            <input 
              type="text" 
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="ENTER TARGET ADDRESS (e.g., 456 DELMAR BLVD)" 
              className="flex-1 bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:outline-none focus:border-cyan-500 font-mono text-sm"
              onKeyDown={(e) => e.key === 'Enter' && executeQuantumScan()}
            />
            <button 
              onClick={executeQuantumScan}
              disabled={loading}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 rounded font-bold tracking-widest text-sm transition-all disabled:opacity-50 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              {loading ? 'SCANNING...' : 'EXECUTE SCAN'}
            </button>
          </div>
          
          {log && (
            <div className="mt-4 p-3 bg-black border border-zinc-800 rounded text-xs font-mono text-zinc-400">
              {log.includes('[-]') ? <span className="text-red-400">{log}</span> : log.includes('[+]') ? <span className="text-emerald-400">{log}</span> : <span className="text-cyan-400">{log}</span>}
            </div>
          )}
        </div>

        {/* Intelligence Output & Weaponry */}
        {propertyData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Asset Data */}
            <div className="space-y-6">
              <div className="bg-zinc-950 border border-emerald-900/30 p-6 rounded-xl">
                <h3 className="text-emerald-500 font-mono text-sm mb-4 border-b border-emerald-900/30 pb-2">FINANCIAL UNDERWRITING</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-zinc-500 text-xs font-mono mb-1">ESTIMATED ARV</p>
                    <p className="text-xl text-white font-bold"></p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs font-mono mb-1">REPAIR ESTIMATE</p>
                    <p className="text-xl text-white font-bold"></p>
                  </div>
                  <div className="col-span-2 mt-2 pt-4 border-t border-zinc-800/50">
                    <p className="text-zinc-500 text-xs font-mono mb-1">MAX ALLOWABLE OFFER (MAO)</p>
                    <p className="text-3xl text-emerald-400 font-bold"></p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950 border border-amber-900/30 p-6 rounded-xl">
                <h3 className="text-amber-500 font-mono text-sm mb-4 border-b border-amber-900/30 pb-2 flex justify-between">
                  <span>CORPORATE IDENTITY UNMASKED</span>
                  <span className="text-xs text-amber-500/50">{propertyData.intel_source}</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-zinc-500 text-xs font-mono mb-1">SHELL COMPANY (LLC)</p>
                    <p className="text-white font-mono">{propertyData.owner_name}</p>
                  </div>
                  <div className="p-3 bg-amber-950/20 border border-amber-900/50 rounded">
                    <p className="text-amber-500/70 text-xs font-mono mb-1">TRUE REGISTERED AGENT</p>
                    <p className="text-amber-400 font-bold tracking-wide">{propertyData.registered_agent}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs font-mono mb-1">MAILING ADDRESS</p>
                    <p className="text-white font-mono text-sm">{propertyData.mailing_address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Execution Weaponry */}
            <div>
              <ContractSniper property={propertyData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
