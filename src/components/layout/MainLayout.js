import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, Building2, FileText, CreditCard,
  MessageSquare, Settings, LogOut, Menu, X,
  TrendingUp, Shield
} from 'lucide-react';

const MainLayout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'War Room', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Asset Vault', href: '/properties', icon: Building2 },
    { name: 'Live Board', href: '/deals', icon: TrendingUp },
    { name: 'Digital Escrow', href: '/contracts', icon: FileText },
    { name: 'Tier Status', href: '/payments', icon: CreditCard },
    { name: 'SV-1500 Core', href: '/chat', icon: MessageSquare },
    { name: 'System Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#020205] text-gray-200 font-['Inter_Tight',sans-serif] relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#80DEEA]/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR: Obsidian Ice */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#020205]/90 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-white/5">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded border border-white/20 flex items-center justify-center text-white font-black tracking-tighter bg-white/5 shadow-inner text-xs">R&S</div>
              <span className="font-black tracking-widest uppercase text-sm text-white">Rodney & Sons</span>
            </Link>
            <button className="lg:hidden text-white/50 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-xs font-bold uppercase tracking-widest ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                      : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-[#80DEEA]' : 'text-gray-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {isAdmin && (
              <div className="pt-8">
                <p className="px-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-2">System Override</p>
                <Link
                  to="/admin"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-xs font-bold uppercase tracking-widest ${
                    location.pathname === '/admin' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30' : 'text-gray-500 hover:bg-[#D4AF37]/5 hover:text-[#D4AF37]'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Terminal</span>
                </Link>
              </div>
            )}
          </nav>

          {/* User Profile Area */}
          <div className="p-4 border-t border-white/5 bg-black/40">
            <div className="flex items-center space-x-3 mb-4 px-2">
              <div className="w-10 h-10 rounded border border-white/20 bg-white/5 flex items-center justify-center">
                <span className="text-white font-black text-sm">{user?.name?.[0] || 'C'}</span>
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-widest">{user?.name || 'CEO'}</p>
                <p className="text-[10px] font-bold text-[#80DEEA] uppercase tracking-[0.2em]">Crystal Diamond</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg border border-red-500/20 text-red-500/80 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <LogOut className="w-4 h-4" />
              <span>Terminate Session</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="lg:pl-64 relative z-10 flex flex-col min-h-screen">
        {/* Top Mobile Bar */}
        <header className="lg:hidden sticky top-0 z-30 h-16 bg-[#020205]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4">
          <button className="text-white/70 hover:text-white" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-black tracking-widest uppercase text-sm text-white">R&S Vault</span>
          <div className="w-6 h-6"></div>
        </header>

        {/* The Actual Page Content */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;