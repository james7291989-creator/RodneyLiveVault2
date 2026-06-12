import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Shield, Bell, Save, Building2, Key } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const isGodMode = user?.email === 'james7291989@gmail.com';

  const [entityName, setEntityName] = useState('AUTHORIZED ENTITY');
  const [signerName, setSignerName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load existing data on mount
  useEffect(() => {
    const savedEntity = localStorage.getItem('companyName');
    if (savedEntity) setEntityName(savedEntity);
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    // Stage 1: Local Storage update to immediately reflect on the War Room header
    localStorage.setItem('companyName', entityName);
    
    // Future Stage 2: supabase.from('user_profiles').update({ ... })
    setTimeout(() => {
      setIsSaving(false);
      alert(`✅ [SYSTEM LOG] Legal Entity Data Secured. Contracts will now render under: ${entityName}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#010103] text-white font-mono relative p-8 pb-20">
      {/* BACKGROUND GRID */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] z-0 pointer-events-none opacity-20"></div>

      <header className="relative z-10 mb-8 border-b border-white/10 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-[#80DEEA] flex items-center gap-3">
            <SettingsIcon className="w-8 h-8" /> System Config
          </h1>
          <p className="text-gray-400 text-xs tracking-widest uppercase mt-2">Operational Parameters & Legal Entity Profile</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#80DEEA] text-black px-6 py-3 rounded text-xs font-black uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "ENCRYPTING..." : "Save Configuration"}
        </button>
      </header>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
        
        {/* LEGAL ENTITY PROFILE */}
        <div className="bg-black/50 border border-white/10 rounded-xl p-6">
          <h2 className="text-[#80DEEA] font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2 border-b border-white/10 pb-3">
            <Building2 className="w-4 h-4" /> Legal Acquisition Entity
          </h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-6">
            WARNING: This data is directly injected into your Missouri Assignment Contracts. Ensure legal accuracy.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Registered LLC Name</label>
              <input 
                type="text" 
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                className="w-full bg-[#010103] border border-white/10 rounded px-4 py-2 text-white text-sm focus:outline-none focus:border-[#80DEEA]/50"
                placeholder="e.g. APEX ACQUISITIONS LLC"
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Authorized Signer</label>
              <input 
                type="text" 
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className="w-full bg-[#010103] border border-white/10 rounded px-4 py-2 text-white text-sm focus:outline-none focus:border-[#80DEEA]/50"
                placeholder="e.g. James R. Arms Jr. - Managing Member"
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Business Mailing Address</label>
              <input 
                type="text" 
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                className="w-full bg-[#010103] border border-white/10 rounded px-4 py-2 text-white text-sm focus:outline-none focus:border-[#80DEEA]/50"
                placeholder="e.g. 1000 Washington Ave, St. Louis, MO 63101"
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* SECURITY & CLEARANCE */}
          <div className="bg-black/50 border border-white/10 rounded-xl p-6">
            <h2 className="text-[#80DEEA] font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2 border-b border-white/10 pb-3">
              <Shield className="w-4 h-4" /> Security Clearance
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-bold">{user?.email || 'OFFLINE_USER'}</p>
                <p className={`text-[10px] font-black uppercase tracking-widest ${isGodMode ? 'text-[#80DEEA]' : 'text-gray-500'}`}>
                  STATUS: {isGodMode ? 'GOD MODE (CEO)' : 'STANDARD OPERATOR'}
                </p>
              </div>
            </div>
            <button className="text-xs text-gray-400 hover:text-white border border-white/10 bg-white/5 px-4 py-2 rounded flex items-center gap-2 transition-all">
              <Key className="w-3 h-3" /> Reset Encryption Key (Password)
            </button>
          </div>

          {/* SYSTEM ALERTS */}
          <div className="bg-black/50 border border-white/10 rounded-xl p-6">
            <h2 className="text-[#80DEEA] font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2 border-b border-white/10 pb-3">
              <Bell className="w-4 h-4" /> Active Targeting Alerts
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-10 h-5 bg-[#80DEEA]/20 rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-[#80DEEA] rounded-full"></div>
                </div>
                <span className="text-xs text-gray-400 group-hover:text-white uppercase tracking-widest transition-colors">High-Equity Vault Injections</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-10 h-5 bg-[#80DEEA]/20 rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-[#80DEEA] rounded-full"></div>
                </div>
                <span className="text-xs text-gray-400 group-hover:text-white uppercase tracking-widest transition-colors">Contract Signature Alerts</span>
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}