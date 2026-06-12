import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Activity, ArrowRight, Building, CheckCircle, Clock, FileText, Target } from 'lucide-react';

const BOARD_COLUMNS = [
  { id: 'RAW_LEAD', title: 'Raw Lead', icon: <Target className="w-4 h-4 text-orange-400" />, borderColor: 'border-orange-500/30' },
  { id: 'UNDERWRITING', title: 'AI Underwriting', icon: <Activity className="w-4 h-4 text-blue-400" />, borderColor: 'border-blue-500/30' },
  { id: 'CONTRACT_SENT', title: 'Contract Sent', icon: <FileText className="w-4 h-4 text-yellow-400" />, borderColor: 'border-yellow-500/30' },
  { id: 'ESCROW', title: 'In Escrow', icon: <Clock className="w-4 h-4 text-purple-400" />, borderColor: 'border-purple-500/30' },
  { id: 'CLOSED', title: 'Dispo / Closed', icon: <CheckCircle className="w-4 h-4 text-green-400" />, borderColor: 'border-green-500/30' }
];

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    // Striking the live Supabase Vault
    const { data, error } = await supabase
      .from('missouri_properties')
      .select('*');
      
    if (error) {
      console.error("Kanban Sync Error:", error);
    } else {
      setDeals(data || []);
    }
    setLoading(false);
  };

  const moveDeal = async (dealId, currentStatus) => {
    const currentIndex = BOARD_COLUMNS.findIndex(col => col.id === currentStatus);
    if (currentIndex < BOARD_COLUMNS.length - 1) {
      const nextStatus = BOARD_COLUMNS[currentIndex + 1].id;
      
      // Optimistic UI Update for instant speed
      setDeals(deals.map(deal => deal.id === dealId ? { ...deal, status: nextStatus } : deal));
      
      // Live Supabase Update
      const { error } = await supabase
        .from('missouri_properties')
        .update({ status: nextStatus })
        .eq('id', dealId);
        
      if (error) {
        console.error("Database Update Failed:", error);
        alert("System Sync Error. Refresh Board.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#010103] text-white font-mono relative p-8">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] z-0 pointer-events-none opacity-20"></div>

      <header className="relative z-10 mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black uppercase tracking-widest text-[#80DEEA] flex items-center gap-3">
          <Building className="w-8 h-8" />
          Live Board Pipeline
        </h1>
        <p className="text-gray-400 text-xs tracking-widest uppercase mt-2">Active St. Louis Acquisition Escrow Tracker</p>
      </header>

      {loading ? (
        <div className="relative z-10 text-[#80DEEA] animate-pulse">DECRYPTING ESCROW VAULT...</div>
      ) : (
        <div className="relative z-10 flex gap-6 overflow-x-auto pb-8 custom-scrollbar h-[calc(100vh-200px)] items-start">
          {BOARD_COLUMNS.map((column) => (
            <div key={column.id} className={`flex-shrink-0 w-80 bg-black/50 border ${column.borderColor} rounded-xl p-4 flex flex-col h-full`}>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
                {column.icon}
                <h2 className="font-bold text-sm uppercase tracking-widest text-white">{column.title}</h2>
                <span className="ml-auto bg-white/10 text-xs px-2 py-0.5 rounded-full">
                  {deals.filter(d => d.status === column.id).length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {deals.filter(deal => deal.status === column.id).map(deal => (
                  <div key={deal.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-[#80DEEA]/50 transition-all group">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Target Asset</p>
                    <h3 className="font-bold text-white text-sm mb-2">{deal.address}</h3>
                    <div className="flex justify-between items-end mt-4">
                      <div>
                        <p className="text-[10px] text-[#80DEEA] uppercase tracking-widest">Est. ARV</p>
                        <p className="text-xs font-bold text-white">{deal.arv || 'TBD'}</p>
                      </div>
                      
                      {column.id !== 'CLOSED' && (
                        <button 
                          onClick={() => moveDeal(deal.id, deal.status)}
                          className="bg-[#80DEEA]/10 text-[#80DEEA] p-2 rounded hover:bg-[#80DEEA] hover:text-black transition-all opacity-0 group-hover:opacity-100"
                          title="Advance Pipeline Stage"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {deals.filter(deal => deal.status === column.id).length === 0 && (
                  <div className="text-center text-gray-600 text-xs uppercase tracking-widest p-4 border border-dashed border-white/10 rounded">
                    Zone Clear
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}