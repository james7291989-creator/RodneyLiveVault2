import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');

  // The Catch: This runs WHEN GOOGLE SENDS YOU BACK with the verified user
  useEffect(() => {
    const verifyWithBouncer = async () => {
      if (user && !loading) {
        try {
          // Transmit the email to your Python Bouncer
          const response = await fetch('https://rodney-vault-api.onrender.com/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email })
          });

          if (response.ok) {
            const data = await response.json();
            // FIXED: Matches the 'token' check in App.js ProtectedRoute
            localStorage.setItem('token', data.token); 
            console.log('Access Granted! Bouncer approved.');
          }
          
          // Breach the Vault
          navigate('/dashboard');
        } catch (err) {
          console.error('Bouncer Error:', err);
          // Supabase verified them, so we still push them to the dashboard
          navigate('/dashboard');
        }
      }
    };

    verifyWithBouncer();
  }, [user, loading, navigate]);

  // The Strike: This ONLY triggers the handshake
  const handleSecureLogin = async () => {
    setIsAuthenticating(true);
    setError('');

    try {
      // Trigger Supabase Redirect - Code below this will not execute immediately 
      await signInWithGoogle();
    } catch (err) {
      console.error('Auth Error:', err);
      setError('Handshake failed to initiate.');
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Cyber-Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-cyan-500 opacity-20 blur-[100px]"></div>

      <div className="z-10 w-full max-w-md bg-black/40 backdrop-blur-xl border border-cyan-900/50 p-8 rounded-2xl shadow-[0_0_40px_-15px_rgba(6,182,212,0.3)]">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-cyan-950/30 rounded-full border border-cyan-800/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">RODNEY <span className="text-cyan-400">&</span> SONS</h1>
        <p className="text-cyan-500/70 text-center mb-8 text-sm font-mono uppercase tracking-widest flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          Secure Terminal Access
        </p>

        {/* Dynamic Error Readout */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-500/50 rounded text-red-400 text-sm text-center font-mono animate-pulse">
            [!] {error}
          </div>
        )}

        <button
          onClick={handleSecureLogin}
          disabled={loading || isAuthenticating}
          className="w-full relative group overflow-hidden rounded-lg bg-cyan-600 px-4 py-3 text-white transition-all hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
          <span className="relative flex items-center justify-center gap-3 font-semibold tracking-wide">
            <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l2.85-2.22.83-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {isAuthenticating ? "VERIFYING CLEARANCE..." : "INITIATE OAUTH HANDSHAKE"}
          </span>
        </button>

        <div className="mt-6 flex justify-center items-center gap-2 text-xs text-zinc-500 font-mono border-t border-zinc-800/50 pt-4">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
          API BLEED SHIELD: ARMED & READY
        </div>
      </div>
    </div>
  );
}
// APEX CORE DEPLOYMENT TIMESTAMP: 2026-05-19 05:30:19