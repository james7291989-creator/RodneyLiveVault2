import React, { useState, useEffect } from 'react';
import { ShieldCheck, Database, FileText, Zap, Lock, Unlock, Activity, X, Diamond, Search, Cpu, Layers, BarChart3, Map as MapIcon } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const API_BASE = "https://rodney-vault-api.onrender.com";

export default function AdminDashboard() {
  const { user } = useAuth();

  const isGodMode = user?.email === 'james7291989@gmail.com';
  const isPaidUser = user?.premium_access === true;
  const hasAccess = isGodMode || isPaidUser;

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [companyName, setCompanyName] = useState('AUTHORIZED ENTITY');
  const [stats, setStats] = useState({ count: 0, totalArv: 0 });
  const [loading, setLoading] = useState(true);

  const [underwriteAddress, setUnderwriteAddress] = useState("");
  const [isUnderwriting, setIsUnderwriting] = useState(false);
  const [aiData, setAiData] = useState(null);

  const [customAddress, setCustomAddress] = useState("");
  const [isUnmasking, setIsUnmasking] = useState(false);
  const [unmaskedEntity, setUnmaskedEntity] = useState(null);

  useEffect(() => {
    const savedName = localStorage.getItem('companyName');
    if (savedName) setCompanyName(savedName);

    const fetchRealData = async () => {
      const { data, error } = await supabase.from('missouri_properties').select('*');
      if (!error && data) {
        setStats({
          count: data.length,
          totalArv: data.reduce((acc, curr) => acc + Number(curr.arv || 0), 0)
        });
      }
      setLoading(false);
    };
    fetchRealData();
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  const triggerPaywall = () => { if (!hasAccess) setShowUpgradeModal(true); };

  const triggerQuantumAI = async (e) => {
    e.preventDefault();
    if (!hasAccess) return triggerPaywall();
    if (!underwriteAddress) return alert("CEO Directive Required: Enter a target asset.");

    setIsUnderwriting(true); setAiData(null);
    try {
      const response = await fetch(`${API_BASE}/api/v1/analyze/quantum`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address: underwriteAddress })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Neural link severed");
      setAiData(data);
    } catch (error) { alert(`Quantum Core Offline: ${error.message}`); }
    finally { setIsUnderwriting(false); }
  };

  const executeBYOD = async () => {
    if (!hasAccess) return triggerPaywall();
    if (!customAddress) return alert("CEO Directive Required: Enter a property address.");

    setIsUnmasking(true); setUnmaskedEntity(null);
    try {
      const response = await fetch('https://rodney-vault-api.onrender.com/api/unmask', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address: customAddress })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Backend Grid Offline");
      setUnmaskedEntity({ target: data.address, llcName: data.owner_name, agent: data.registered_agent, mailing: data.mailing_address });
    } catch (error) { alert(`System Halt: ${error.message}`); }
    finally { setIsUnmasking(false); }
  };

  return (
    <div className="min-h-screen bg-[#010103] text-white font-mono relative overflow-hidden pb-20">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] z-0 pointer-events-none opacity-20"></div>

      <header className="relative z-10 border-b border-white/10 bg-[#010103]/80 backdrop-blur-xl px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 border border-[#80DEEA]/30 rounded flex items-center justify-center"><Diamond className="w-6 h-6 text-[#80DEEA]" /></div>
          <div><h1 className="text-xl font-black uppercase tracking-widest text-white">{companyName}</h1><p className="text-xs text-[#80DEEA] font-mono tracking-widest">ST. LOUIS ACQUISITION PIPELINE</p></div>
        </div>
        {!hasAccess ? ( <div className="flex items-center gap-3 bg-red-900/20 border border-red-500/30 px-4 py-2 rounded text-xs font-mono text-red-400 cursor-pointer" onClick={triggerPaywall}><Lock className="w-4 h-4" /> UPGRADE ACCOUNT</div> ) : ( <div className="flex items-center gap-3 bg-[#80DEEA]/10 border border-[#80DEEA]/30 px-4 py-2 rounded text-xs font-mono text-[#80DEEA]"><Unlock className="w-4 h-4" /> {isGodMode ? 'GOD MODE ACTIVE' : 'VAULT UNLOCKED'}</div> )}
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 mt-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6"><p className="text-xs text-gray-500 tracking-widest mb-2 flex items-center gap-2"><Layers className="w-4 h-4" /> LIVE INVENTORY</p><h2 className="text-4xl font-black text-white">{loading ? "SYNCING..." : stats.count.toLocaleString()}</h2></div>
          <div className="bg-white/5 border border-[#80DEEA]/30 rounded-xl p-6"><p className="text-xs text-[#80DEEA] tracking-widest mb-2 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> LIVE PORTFOLIO ARV</p><h2 className="text-4xl font-black text-[#80DEEA]">{loading ? "CALC..." : formatCurrency(stats.totalArv)}</h2></div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden flex items-center"><h2 className={`text-2xl font-black flex items-center gap-2 ${hasAccess ? 'text-[#80DEEA]' : 'text-red-400'}`}><Activity className="w-6 h-6" /> {hasAccess ? 'ALL SYSTEMS GO' : 'ACTION REQUIRED'}</h2></div>
        </div>

        <div className="relative">
          {!hasAccess && ( <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#010103]/60 backdrop-blur-md rounded-2xl border border-red-500/20"><Lock className="w-16 h-16 text-red-500 mb-6" /><button onClick={triggerPaywall} className="bg-gradient-to-r from-red-600 to-red-800 text-white font-black uppercase px-10 py-4 rounded-lg">Unlock The Grid</button></div> )}

          <div className={`transition-all duration-500 ${!hasAccess ? 'blur-sm opacity-50 pointer-events-none' : ''}`}>

            {/* STRIKE 1: THE APEX ASSET VAULT INTAKE */}
            <div className="bg-gradient-to-b from-[#010103] via-gray-900 to-[#010103] border border-[#80DEEA]/50 rounded-2xl p-10 mb-8 shadow-[0_0_50px_rgba(128,222,234,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                <span className="text-[#80DEEA] text-[10px] tracking-widest uppercase border border-[#80DEEA]/30 px-2 py-1 rounded">God Mode Intake Active</span>
              </div>
              
              <h2 className="text-5xl font-light mb-2 tracking-widest text-gray-300">ASSET <span className="font-bold text-white">VAULT</span></h2>
              <p className="text-xs text-[#80DEEA] tracking-widest mb-8 uppercase flex items-center gap-2"><Cpu className="w-4 h-4" /> SB1500 Core: Quantum Underwriting</p>

              <form onSubmit={triggerQuantumAI} className="w-full relative flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  value={underwriteAddress}
                  onChange={(e) => setUnderwriteAddress(e.target.value)}
                  placeholder="ENTER ST. LOUIS TARGET ASSET..."
                  className="flex-1 bg-black border border-gray-700 text-white pl-6 pr-6 py-6 rounded-xl focus:outline-none focus:border-[#80DEEA] focus:ring-1 focus:ring-[#80DEEA] transition-all text-xl tracking-wide placeholder-gray-600 shadow-inner uppercase"
                />
                <button
                  type="submit"
                  disabled={isUnderwriting}
                  className="bg-[#80DEEA] text-black font-black uppercase text-xl px-12 py-6 rounded-xl hover:bg-white hover:shadow-[0_0_40px_rgba(128,222,234,0.6)] transition-all tracking-[0.2em] disabled:opacity-50"
                >
                  {isUnderwriting ? "SCANNING..." : "INITIATE SCAN"}
                </button>
              </form>

              {/* AI Data Results Display */}
              {aiData && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10 animate-in fade-in">
                  <div className="bg-black/80 p-6 rounded-xl border border-green-500/50 text-center shadow-[0_0_15px_rgba(34,197,94,0.1)]"><p className="text-xs text-gray-400 uppercase mb-2 tracking-widest">DEEP ARV</p><p className="font-black text-2xl text-green-400">{formatCurrency(aiData.estimated_arv)}</p></div>
                  <div className="bg-black/80 p-6 rounded-xl border border-yellow-500/50 text-center shadow-[0_0_15px_rgba(234,179,8,0.1)]"><p className="text-xs text-gray-400 uppercase mb-2 tracking-widest">REPAIR CALC</p><p className="font-black text-2xl text-yellow-400">{formatCurrency(aiData.repair_estimates)}</p></div>
                  <div className="bg-black/80 p-6 rounded-xl border border-purple-500/50 text-center shadow-[0_0_15px_rgba(168,85,247,0.1)]"><p className="text-xs text-gray-400 uppercase mb-2 tracking-widest">MAX ALLOWABLE OFFER</p><p className="font-black text-2xl text-purple-400">{formatCurrency(aiData.max_allowable_offer)}</p></div>
                  <div className="bg-black/80 p-6 rounded-xl border border-[#80DEEA]/50 text-center shadow-[0_0_15px_rgba(128,222,234,0.1)]"><p className="text-xs text-gray-400 uppercase mb-2 tracking-widest">LEGAL AGENT</p><p className="font-black text-sm text-[#80DEEA] mt-3 uppercase">{aiData.registered_agent}</p></div>
                </div>
              )}
            </div>

            {/* ST. LOUIS TACTICAL MAP DISPLAY */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 shadow-[0_0_30px_rgba(128,222,234,0.1)]">
              <h3 className="text-white font-black uppercase text-sm flex items-center gap-2 mb-4"><MapIcon className="w-4 h-4 text-[#80DEEA]" /> Tactical Grid: St. Louis</h3>
              <div className="w-full h-[450px] rounded-xl overflow-hidden border border-[#80DEEA]/30 relative">
                <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded font-mono text-[10px] text-[#80DEEA] uppercase tracking-widest shadow-lg">
                  <span className="w-2 h-2 inline-block bg-red-500 rounded-full animate-pulse mr-2"></span> SATELLITE UPLINK ACTIVE
                </div>
                <Map
                  initialViewState={{ longitude: -90.1994, latitude: 38.6270, zoom: 11.5 }}
                  mapStyle={{
                    version: 8,
                    sources: { 'osm': { type: 'raster', tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256 } },
                    layers: [{ id: 'osm-layer', type: 'raster', source: 'osm', paint: { 'raster-opacity': 0.7, 'raster-saturation': -0.8, 'raster-contrast': 0.2 } }]
                  }}
                />
              </div>
            </div>

            {/* LLC PIERCER */}
            <div className="bg-gradient-to-r from-[#80DEEA]/10 to-transparent border border-[#80DEEA]/30 rounded-xl p-6 mb-6 flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1"><h3 className="text-white font-black uppercase text-sm flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#80DEEA] animate-pulse"></span>LLC Piercer / Contract Generator</h3></div>
              <div className="flex-1 flex gap-2 w-full">
                <input type="text" value={customAddress} onChange={(e) => setCustomAddress(e.target.value)} placeholder="ENTER TARGET TO UNMASK..." className="flex-1 bg-black/50 border border-white/10 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#80DEEA]/50 uppercase" />
                <button onClick={executeBYOD} disabled={isUnmasking} className="bg-[#80DEEA] text-black font-black uppercase text-xs px-6 py-3 rounded"><Search className="w-4 h-4 inline" /> {isUnmasking ? "PIERCING..." : "UNMASK"}</button>
              </div>
            </div>

            {unmaskedEntity && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 mb-10">
                <h3 className="text-green-400 font-black uppercase text-sm mb-4">Target Acquired</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-black/50 p-4 rounded border border-white/5"><p className="text-[10px] text-gray-500 uppercase">Target</p><p className="font-bold text-sm truncate">{unmaskedEntity.target}</p></div>
                  <div className="bg-black/50 p-4 rounded border border-green-500/30"><p className="text-[10px] text-green-500 uppercase">Legal Entity</p><p className="font-bold text-sm truncate">{unmaskedEntity.llcName}</p></div>
                  <div className="bg-black/50 p-4 rounded border border-white/5"><p className="text-[10px] text-gray-500 uppercase">Agent</p><p className="font-bold text-sm truncate">{unmaskedEntity.agent}</p></div>
                  <div className="bg-black/50 p-4 rounded border border-white/5"><p className="text-[10px] text-gray-500 uppercase">Mailing</p><p className="font-bold text-sm truncate">{unmaskedEntity.mailing}</p></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
