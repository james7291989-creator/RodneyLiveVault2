import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabaseClient';

export default function SubscriptionGate({ children }) {
  const { session, loading } = useAuth();
  const [tier, setTier] = useState(null);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!session?.user) {
        setChecking(false);
        return;
    }

    const fetchTier = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('subscription_tier')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;
        setTier(data?.subscription_tier || 'FREE');
      } catch (err) {
        console.error('Tier Check Error:', err);
        setTier('FREE'); 
      } finally {
        setChecking(false);
      }
    };

    fetchTier();
  }, [session]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-[#010103] flex items-center justify-center text-[#80DEEA] font-mono tracking-[0.3em] text-xs uppercase">
        Verifying Database Clearance...
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;

  if (tier === 'FREE') {
    return (
      <div className="min-h-screen bg-[#010103] flex flex-col items-center justify-center p-6 relative overflow-hidden text-center font-['Inter_Tight',sans-serif]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] z-0 pointer-events-none opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-lg bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-12 rounded-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_30px_60px_rgba(0,0,0,0.9)]">
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_30px_rgba(239,68,68,0.3)]">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-[0.3em] text-white mb-4 drop-shadow-md">Clearance Denied</h2>
          <p className="text-gray-400 text-sm mb-10 leading-relaxed font-medium tracking-wide">
            Your entity is operating on the <strong className="text-white">FREE</strong> tier. The 5-Pillar War Room, SV-1500 Core, and Digital Escrow require an active premium license.
          </p>
          <button
            onClick={() => window.open('https://buy.stripe.com/test_00wdR9aPJ1at02T6Ud5J600', '_blank', 'noopener,noreferrer')}
            className="w-full group relative flex items-center justify-center px-8 py-5 rounded-xl font-black text-[#010103] uppercase tracking-[0.3em] text-xs bg-gradient-to-r from-[#80DEEA] to-[#4DD0E1] hover:from-white hover:to-white transition-all duration-300 shadow-[0_0_40px_rgba(128,222,234,0.4)]"
          >
            View Licensing Tiers
          </button>
        </div>
      </div>
    );
  }

  return children;
}
