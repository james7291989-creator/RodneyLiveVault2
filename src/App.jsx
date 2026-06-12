import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import your Pages
import LoginPage from './pages/LoginPage';
import AvailableDeals from './pages/AvailableDeals';
import AdminDashboard from './pages/AdminDashboard';
import PricingWall from './pages/PricingWall';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Global styling wrapper for the dark luxury theme */}
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#C1A173] selection:text-black">
          <Routes>
            {/* 1. Default Route pushes everyone to the Vault Doors (Pricing Wall) */}
            <Route path="/" element={<PricingWall />} />
            
            {/* 2. Security Portal */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* 3. Investor View (The Fishing Net) */}
            <Route path="/available-deals" element={<AvailableDeals />} />
            
            {/* 4. CEO Command Center (Admin Only) */}
            <Route path="/ceo-dashboard" element={<AdminDashboard />} />
            
            {/* 5. Fallback: Catch any bad URLs and send them to the Paywall */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}