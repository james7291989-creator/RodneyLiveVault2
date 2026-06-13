import React from 'react';
import { ShieldAlert, Crown, ArrowRight, Zap } from 'lucide-react';

export default function SubscriptionGate({ requiredTier, currentTier = 1, children }) {
  // Simple numeric hierarchy mapping for authorization evaluation
  const tierWeights = { 'SCOUT': 1, 'PRO_CLOSER': 2, 'APEX_INVESTOR': 3, 'SYNDICATE': 4, 'GOD_MODE': 5 };
  
  const hasAccess = (tierWeights[currentTier] || 1) >= (tierWeights[requiredTier] || 1);

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="w-full p-8 rounded-lg border border-red-500/20 bg-[#0C0606] text-center shadow-[0_0_25px_rgba(239,68,68,0.1)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center max-w-md mx-auto">
        <div className="h-12 w-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
          <ShieldAlert className="h-6 w-6 text-red-400" />
        </div>
        
        <h3 className="font-mono text-xs tracking-[0.2em] text-red-400 uppercase mb-1">/// ACCESS RESTRICTED</h3>
        <h2 className="text-xl font-bold text-white tracking-tight mb-3">Upgrade Required for Target Module</h2>
        
        <p className="text-gray-400 text-xs leading-relaxed mb-6">
          This function requires <span className="text-cyan-400 font-mono font-bold">TIER {requiredTier}</span> status. 
          Your profile is currently registered under standard <span className="text-gray-400 font-mono font-bold">TIER {currentTier}</span> parameters.
        </p>
        
        <button 
          onClick={() => window.location.href = '/dashboard/billing'}
          className="w-full inline-flex h-10 items-center justify-center gap-2 rounded border border-cyan-500/40 bg-cyan-500/10 font-mono text-xs font-bold tracking-[0.15em] text-cyan-300 hover:bg-cyan-500/20 transition-all uppercase shadow-[0_0_15px_rgba(6,182,212,0.1)]"
        >
          <Crown className="h-4 w-4" /> UPGRADE TERMINAL <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
