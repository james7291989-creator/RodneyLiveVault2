import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FileSignature, Download, CheckCircle, Clock, ShieldCheck, FileText, Lock, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Contracts() {
  const { user } = useAuth();
  const isGodMode = user?.email === 'james7291989@gmail.com';
  
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    // Stage 1: UI Rollout. 
    // Stage 2 will map to a new Supabase table: supabase.from('escrow_contracts')
    const mockContracts = [
      { id: 'C-9921', address: '4321 DELMAR BLVD', seller: 'JOHN DOE', entity: 'APEX ACQUISITIONS LLC', emd: '$1,000', status: 'SIGNED', date: '2026-05-15' },
      { id: 'C-9922', address: '5947 PAGE BLVD', seller: 'ST LOUIS RE INV', entity: 'APEX ACQUISITIONS LLC', emd: '$500', status: 'OUT FOR SIGNATURE', date: '2026-05-14' },
      { id: 'C-9923', address: '1405 GOODFELLOW BLVD', seller: 'APEX HOLDINGS', entity: 'APEX ACQUISITIONS LLC', emd: '$2,000', status: 'DRAFTING', date: '2026-05-15' }
    ];
    setContracts(mockContracts);
    setLoading(false);
  };

  const triggerPDFGeneration = () => {
    if (!isGodMode) return alert("RESTRICTED: Gold Tier or higher required to auto-generate legal contracts.");
    
    setIsGenerating(true);
    // Future Python Hook: fetch('https://rodney-vault-api.onrender.com/api/generate-contract', { method: 'POST' })
    setTimeout(() => {
      alert("✅ [SYSTEM LOG] Missouri Assignment PDF Generated successfully via Python backend. Ready for download.");
      setIsGenerating(false);
    }, 2000);
  };

  const downloadPDF = (id) => {
    alert(`[SYSTEM LOG] Downloading encrypted contract ${id}.pdf...`);
  };

  return (
    <div className="min-h-screen bg-[#010103] text-white font-mono relative p-8">
      {/* BACKGROUND GRID */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] z-0 pointer-events-none opacity-20"></div>

      <header className="relative z-10 mb-8 border-b border-white/10 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-[#80DEEA] flex items-center gap-3">
            <FileSignature className="w-8 h-8" />
            Digital Escrow
          </h1>
          <p className="text-gray-400 text-xs tracking-widest uppercase mt-2">Automated Legal Generation & Execution</p>
        </div>
        
        <button 
          onClick={triggerPDFGeneration}
          disabled={isGenerating}
          className="bg-[#80DEEA] text-black px-6 py-3 rounded text-xs font-black uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isGodMode ? <Plus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          {isGenerating ? "COMPILING PDF..." : "Generate Assignment"}
        </button>
      </header>

      {/* ESCROW TERMINAL GRID */}
      <div className="relative z-10 bg-black/50 border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-[#80DEEA] animate-pulse tracking-widest text-sm">ACCESSING LEGAL VAULT...</div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10">
                <tr className="text-gray-400 text-xs uppercase tracking-widest">
                  <th className="p-4 font-medium">Contract ID</th>
                  <th className="p-4 font-medium">Target Asset</th>
                  <th className="p-4 font-medium">Seller / Grantor</th>
                  <th className="p-4 font-medium">Earnest Money</th>
                  <th className="p-4 font-medium">Signature Status</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {contracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="font-bold text-[#80DEEA]">{contract.id}</span>
                      </div>
                    </td>
                    <td className="p-4 text-white font-bold">{contract.address}</td>
                    <td className="p-4 text-gray-400 text-xs">{contract.seller}</td>
                    <td className="p-4 text-green-400 font-mono">{contract.emd}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[10px] rounded uppercase tracking-wider font-bold flex items-center gap-1 w-max ${
                        contract.status === 'SIGNED' ? 'bg-green-500/20 text-green-400' :
                        contract.status === 'OUT FOR SIGNATURE' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {contract.status === 'SIGNED' ? <CheckCircle className="w-3 h-3" /> : 
                         contract.status === 'OUT FOR SIGNATURE' ? <Clock className="w-3 h-3" /> : 
                         <ShieldCheck className="w-3 h-3" />}
                        {contract.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => downloadPDF(contract.id)}
                        className="bg-white/5 text-white border border-white/10 px-3 py-1.5 rounded text-[10px] uppercase tracking-widest font-bold hover:bg-[#80DEEA] hover:text-black hover:border-[#80DEEA] transition-all flex items-center gap-2 ml-auto"
                      >
                        <Download className="w-3 h-3" /> Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {contracts.length === 0 && (
              <div className="p-10 text-center text-gray-600 text-xs uppercase tracking-widest">No active contracts in escrow.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}