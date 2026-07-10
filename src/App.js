import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ApexTerminal from "./components/dashboard/ApexTerminal";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => authListener?.subscription?.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#010103] flex items-center justify-center text-[#80DEEA] tracking-[0.3em] text-xs font-mono uppercase">
        Initializing Secure Link...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={!session ? <LandingPage /> : <Navigate to="/dashboard" />} />
      <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={session ? <ApexTerminal session={session} /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;