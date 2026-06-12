import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cpu, ArrowRight, Diamond, Lock, FileText, Mail, Building2, Layers, Scale, Crosshair, Upload, AlertTriangle } from 'lucide-react';
import { supabase } from '../supabaseClient'; 

export default function LandingPage() {
  const [appState, setAppState] = useState('step1'); 
  
  const [formData, setFormData] = useState({
    name: '', email: '', tier: '', company: '', consent: false
  });

  const handleNextStep = (e) => {
    e.preventDefault();
    setAppState('step2');
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setAppState('processing');
    
    localStorage.setItem('companyName', formData.company.toUpperCase() || 'AUTHORIZED ENTITY');
    
    try {
      console.log("🚀 INITIATING DIRECT TRANSMISSION TO SUPABASE VAULT...");
      
      // 1. STRIKE THE DATABASE (Lead Capture)
      const { error } = await supabase
        .from('early_access_leads')
        .insert([{ 
          full_name: formData.name, 
          email: formData.email, 
          capital: formData.tier 
        }]);

      if (error) throw error;
      console.log("📡 DATABASE PAYLOAD SECURED");
      
      // 2. STRIKE THE ENGINE (Fire Brevo Email Cannon)
      try {
         console.log("🚀 INITIATING RENDER CLOUD IGNITION FOR EMAIL...");
         await fetch('https://rodney-vault-api.onrender.com/api/send-welcome', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: formData.name, email: formData.email })
         });
         console.log("✉️ EMAIL CANNON FIRED");
      } catch (err) {
         console.log("⚠️ Email cannon misfire (Check Render Logs):", err);
      }

      // 3. THE VELVET ROPE UI (Acceptance Screen)
      setTimeout(() => {
        setAppState('success');
      }, 1500);

    } catch (error) {
      console.error("❌ CRITICAL ENGINE FAILURE:");
      console.error(error.message);
      console.error(error);
      alert(`TRANSMISSION FAILED: ${error.message}\n\nCheck F12 Console for full telemetry.`);
      setAppState('step2'); 
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#010103] text-white font-['Inter_Tight',sans-serif] selection:bg-[#80DEEA] selection:text-black overflow-x-hidden relative">
      
      {/* GOD-MODE BACKGROUND LAYER - Kept dark to let the glass pop */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558281050-4c33200099c7?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 mix-blend-luminosity filter contrast-125"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-[#010103]"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-white/[0.01] blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[#80DEEA]/[0.05] blur-[150px] rounded-full mix-blend-screen"></div>
      </div>

      {/* TECH GRID */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] z-0 pointer-events-none opacity-40"></div>

      {/* NAV - Smoked Glass Upgrade */}
      <nav className="relative z-20 max-w-7xl mx-auto px-6 h-24 flex items-center justify-between border-b border-white/10 bg-[#010103]/30 backdrop-blur-3xl shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded border border-white/20 bg-white/5 flex items-center justify-center backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
             <Diamond className="text-[#80DEEA] w-5 h-5" />
          </div>
          <span className="text-sm font-black uppercase tracking-[0.4em] text-gray-200 drop-shadow-md">
            RODNEY <span className="text-[#80DEEA]">& SONS</span>
          </span>
        </div>
        <Link to="/login" className="text-xs font-black uppercase tracking-[0.3em] text-white hover:text-[#80DEEA] transition-all border border-white/20 px-8 py-3 rounded bg-white/[0.03] hover:bg-white/[0.1] backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
          Vault Login
        </Link>
      </nav>

      {/* HERO */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center">
        {/* Crystal Pill */}
        <div className="mb-8 px-6 py-3 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.5)] flex items-center gap-3">
           <Cpu className="w-4 h-4 text-[#80DEEA]" />
           <span className="text-xs font-black uppercase tracking-[0.3em] text-[#80DEEA]">Autonomous Wholesaling Infrastructure</span>
        </div>

        <h1 className="text-[5rem] md:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-gray-500 drop-shadow-[0_0_40px_rgba(255,255,255,0.15)] mb-6 filter drop-shadow-2xl">
          ST. LOUIS
          <br/>
          <span className="text-[4rem] md:text-[8rem] bg-clip-text text-transparent bg-gradient-to-b from-[#80DEEA] to-[#00838F]">DOMINATION</span>
        </h1>

        {/* Smoked Crystal Banner */}
        <h2 className="mt-6 text-base md:text-2xl font-black uppercase tracking-[0.4em] text-white max-w-5xl leading-relaxed bg-[#010103]/40 inline-block px-10 py-5 rounded-xl backdrop-blur-3xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_10px_40px_rgba(0,0,0,0.8)]">
          We Are Not Agents. We Are Your Unfair Advantage.
        </h2>
      </main>

      {/* PROGRESSIVE ONBOARDING WIZARD - Master Crystal Card */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-32">
        <div className="bg-white/[0.02] backdrop-blur-[80px] rounded-3xl border border-white/10 p-8 md:p-16 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_30px_60px_rgba(0,0,0,0.9)] relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#80DEEA]/40 to-transparent"></div>
          
          {appState === 'success' ? (
             <div className="py-10 animate-in fade-in zoom-in duration-700">
               <ShieldCheck className="w-20 h-20 text-[#80DEEA] mx-auto mb-8 drop-shadow-[0_0_20px_rgba(128,222,234,0.6)]" />
               <h3 className="text-3xl md:text-4xl font-black uppercase tracking-[0.3em] text-white mb-4">Application Transmitted</h3>
               <p className="text-sm text-[#80DEEA] font-bold uppercase tracking-[0.2em] mb-10">Security Clearance Pending...</p>
               
               {/* Inner frosted pane */}
               <div className="bg-black/20 backdrop-blur-2xl border border-white/5 p-8 rounded-xl text-left max-w-lg mx-auto shadow-[inset_0_2px_15px_rgba(0,0,0,0.5)]">
                 <p className="text-gray-300 text-sm leading-relaxed mb-6">
                   Your entity credentials have been securely routed to the Executive Desk for review. Due to extreme market demand, we reject the vast majority of applications.
                 </p>
                 <p className="text-gray-300 text-sm leading-relaxed mb-6">
                   <strong className="text-white">If you qualify for the Unfair Advantage Program</strong>, you will receive a direct correspondence from CEO James Rodney Arms Jr. containing your official acceptance letter and a secure portal link.
                 </p>
                 <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-xs text-[#80DEEA] font-black uppercase tracking-[0.2em]">Monitor Your Inbox Closely</span>
                 </div>
               </div>
             </div>
          ) : (
            <div>
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_20px_rgba(128,222,234,0.1)]">
                {appState === 'step1' ? <Lock className="text-[#80DEEA] w-10 h-10 drop-shadow-lg" /> : <FileText className="text-[#80DEEA] w-10 h-10 drop-shadow-lg" />}
              </div>
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-[0.3em] text-white mb-4 drop-shadow-lg">
                {appState === 'step1' ? 'Platform Application' : 'Entity Configuration'}
              </h3>
              <p className="text-sm text-gray-300 font-bold uppercase tracking-[0.2em] mb-10 leading-relaxed max-w-xl mx-auto">
                {appState === 'step1' 
                  ? 'The St. Louis Vault operates on an invite-only basis. Submit your credentials.' 
                  : 'Configure your Engine for contract generation & review terms.'}
              </p>

              {/* STEP 1: IDENTITY & CAPITAL */}
              {appState === 'step1' && (
                <form onSubmit={handleNextStep} className="space-y-6 text-left max-w-2xl mx-auto">
                  <div className="space-y-4">
                    {/* Frosted Glass Inputs */}
                    <input required id="operatorName" name="operatorName" autoComplete="name" type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="LEGAL FULL NAME" className="w-full bg-black/20 backdrop-blur-2xl border border-white/10 rounded-lg p-5 text-sm text-white focus:border-[#80DEEA]/50 focus:bg-white/[0.05] transition-all font-mono tracking-widest placeholder:text-gray-600 shadow-[inset_0_2px_15px_rgba(0,0,0,0.5)]" />
                    <input required id="operatorEmail" name="operatorEmail" autoComplete="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="SECURE EMAIL ADDRESS" className="w-full bg-black/20 backdrop-blur-2xl border border-white/10 rounded-lg p-5 text-sm text-white focus:border-[#80DEEA]/50 focus:bg-white/[0.05] transition-all font-mono tracking-widest placeholder:text-gray-600 shadow-[inset_0_2px_15px_rgba(0,0,0,0.5)]" />
                    <select required id="capitalTier" name="capitalTier" autoComplete="off" value={formData.tier} onChange={(e) => setFormData({...formData, tier: e.target.value})} className="w-full bg-black/20 backdrop-blur-2xl border border-white/10 rounded-lg p-5 text-sm text-white focus:border-[#80DEEA]/50 focus:bg-white/[0.05] transition-all font-mono tracking-widest shadow-[inset_0_2px_15px_rgba(0,0,0,0.5)] appearance-none cursor-pointer">
                      <option value="" disabled className="bg-black text-white">SELECT MONTHLY INVESTMENT CAPITAL</option>
                      <option value="tier1" className="bg-black text-white">Under $10,000 / Month (Independent)</option>
                      <option value="tier2" className="bg-black text-white">$10,000 - $50,000 / Month (Scaling Operator)</option>
                      <option value="tier3" className="bg-black text-white">$50,000+ / Month (Institutional)</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full group relative flex items-center justify-center px-12 py-6 rounded-lg font-black text-[#010103] uppercase tracking-[0.3em] text-sm bg-gradient-to-r from-[#80DEEA] to-[#4DD0E1] hover:from-white hover:to-white transition-all duration-300 shadow-[0_0_40px_rgba(128,222,234,0.4)]">
                    Next Step: Entity Setup <ArrowRight className="w-5 h-5 ml-4" />
                  </button>
                </form>
              )}

              {/* STEP 2: LEGAL, ENTITY & DISCLAIMERS */}
              {(appState === 'step2' || appState === 'processing') && (
                <form onSubmit={handleFinalSubmit} className="space-y-6 text-left animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
                  <div className="space-y-4">
                    
                    {/* LLC Name */}
                    <input required id="companyName" name="companyName" autoComplete="organization" type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} placeholder="COMPANY / LLC LEGAL NAME" className="w-full bg-black/20 backdrop-blur-2xl border border-[#80DEEA]/30 rounded-lg p-5 text-sm text-[#80DEEA] focus:border-white focus:bg-white/[0.05] focus:outline-none transition-all font-mono tracking-widest placeholder:text-[#80DEEA]/40 shadow-[inset_0_2px_15px_rgba(0,0,0,0.5)]" />
                    
                    {/* Fake Logo Upload Button */}
                    <div className="w-full bg-black/20 backdrop-blur-2xl border border-dashed border-white/20 rounded-lg p-5 text-center cursor-pointer hover:border-[#80DEEA]/50 hover:bg-white/[0.05] transition-all flex flex-col items-center justify-center gap-2">
                      <Upload className="w-6 h-6 text-gray-500" />
                      <span className="text-xs text-gray-400 font-mono tracking-widest">UPLOAD COMPANY LOGO (OPTIONAL)</span>
                    </div>

                    {/* SCROLLABLE LEGAL DISCLAIMERS TERMINAL */}
                    <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-lg p-5 h-40 overflow-y-auto mt-6 shadow-[inset_0_2px_15px_rgba(0,0,0,0.5)] scrollbar-thin scrollbar-thumb-[#80DEEA]/30 scrollbar-track-transparent">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <h5 className="text-[11px] text-gray-300 uppercase tracking-widest font-black">Platform Disclaimers & Terms</h5>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-relaxed mb-3">
                        <strong className="text-white">1. NON-BROKERAGE STATUS:</strong> Rodney & Sons LLC operates strictly as a software provider, data aggregator, and principal investor. We are not a licensed real estate brokerage, nor do we represent you in any capacity.
                      </p>
                      <p className="text-[10px] text-gray-400 leading-relaxed mb-3">
                        <strong className="text-white">2. ESTIMATE ACCURACY:</strong> Quantum Core AI values (ARV) and estimates are for informational purposes only. Real estate investing carries financial risk. Conduct independent due diligence.
                      </p>
                      <p className="text-[10px] text-gray-400 leading-relaxed">
                        <strong className="text-white">3. LEGAL LIABILITY:</strong> Contracts generated do not constitute legal advice. Ensure compliance with all laws.
                      </p>
                    </div>

                    {/* Double Checkbox Consent - Frosted Plates */}
                    <div className="space-y-3 mt-4">
                      <div className="flex items-start gap-4 bg-white/[0.03] backdrop-blur-xl p-4 rounded-lg border border-white/10">
                        <input required type="checkbox" className="mt-1 w-5 h-5 accent-[#80DEEA] cursor-pointer" id="contract-consent" name="contractConsent" />
                        <label htmlFor="contract-consent" className="text-[11px] text-gray-300 font-medium leading-relaxed tracking-wide cursor-pointer">
                          I grant <strong className="text-white">Rodney & Sons LLC</strong> permission to utilize my Name, LLC, and Logo for generating legally binding Contracts and White-Labeled Dashboards.
                        </label>
                      </div>

                      <div className="flex items-start gap-4 bg-white/[0.03] backdrop-blur-xl p-4 rounded-lg border border-white/10">
                        <input required type="checkbox" className="mt-1 w-5 h-5 accent-[#80DEEA] cursor-pointer" id="terms-consent" name="termsConsent" />
                        <label htmlFor="terms-consent" className="text-[11px] text-gray-300 font-medium leading-relaxed tracking-wide cursor-pointer">
                          I acknowledge the <strong className="text-white">Platform Disclaimers</strong> above, assume full financial liability, and agree to the Terms of Service.
                        </label>
                      </div>
                    </div>

                  </div>

                  <button disabled={appState === 'processing'} type="submit" className="w-full mt-8 group relative flex items-center justify-center px-12 py-6 rounded-lg font-black text-[#010103] uppercase tracking-[0.3em] text-sm bg-gradient-to-r from-[#80DEEA] to-[#4DD0E1] hover:from-white hover:to-white transition-all duration-300 shadow-[0_0_40px_rgba(128,222,234,0.4)] disabled:opacity-50">
                    {appState === 'processing' ? 'Encrypting Credentials...' : 'Initialize Engine & Transmit'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* THE MANIFESTO - Crystal Plate */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <div className="p-12 md:p-20 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-[80px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-[#80DEEA] to-transparent opacity-80"></div>
          
          <div className="flex items-center gap-6 mb-10">
            <Crosshair className="text-[#80DEEA] w-10 h-10" />
            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">The Supply Chain</h3>
          </div>
          
          <div className="space-y-10 text-lg md:text-xl text-gray-300 font-medium leading-relaxed tracking-wide">
            <p>
              The St. Louis real estate market is choked by middlemen, outdated MLS data, and slow-moving brokerages. <strong className="text-white">Rodney & Sons was engineered to bypass the friction entirely.</strong> We are not agents seeking commissions. We operate as a direct-to-investor wholesale pipeline, securing highly distressed, off-market assets before the public grid even knows they exist.
            </p>
            <p>
              We do the heavy lifting in the dirt. Our proprietary systems scrape county data, target tax delinquencies, and secure LRA properties, isolating only the highest-yield targets. But we don't just hand you a raw list. When a property hits our Vault, our <strong className="text-[#80DEEA]">Quantum Core AI</strong> has already underwritten the deal—instantly calculating the After Repair Value (ARV) and precise line-item rehab estimates.
            </p>
            <p>
              You don't need another broker. You need a supply chain. From autonomous deal discovery to generating flawless, title-compliant assignment contracts with a single click, Rodney & Sons provides the complete infrastructure required to rapidly acquire assets and scale your portfolio.
            </p>
          </div>
        </div>
      </div>

      {/* APEX CAPABILITIES GRID - Glass Grid */}
      <div className="relative z-10 bg-[#010103]/60 border-t border-white/10 backdrop-blur-[80px] shadow-[0_-20px_50px_rgba(0,0,0,0.9)]">
        <div className="max-w-7xl mx-auto px-6 py-40">
          
          <div className="text-center mb-24">
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 mb-8 drop-shadow-xl">The Operations Engine</h3>
            <p className="text-base md:text-lg text-[#80DEEA] font-bold uppercase tracking-[0.3em] max-w-3xl mx-auto leading-loose drop-shadow-md">
              Everything required to scale an institutional real estate portfolio, consolidated into a single, autonomous platform.
            </p>
            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#80DEEA] to-transparent mx-auto mt-12 opacity-60"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Array of Glass Cards */}
            <div className="p-12 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_30px_rgba(0,0,0,0.5)] hover:border-[#80DEEA]/40 hover:bg-white/[0.05] transition-all duration-500 group">
              <Cpu className="w-14 h-14 text-[#80DEEA] mb-8 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-[0_0_15px_rgba(128,222,234,0.6)]" />
              <h4 className="text-xl font-black uppercase tracking-[0.2em] text-white mb-6 drop-shadow-md">Quantum Core Underwriting</h4>
              <p className="text-base text-gray-400 leading-relaxed font-medium">Instantaneous property analysis. The AI calculates deep ARV, line-item repair estimates, and max allowable offers in milliseconds.</p>
            </div>

            <div className="p-12 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_30px_rgba(0,0,0,0.5)] hover:border-[#80DEEA]/40 hover:bg-white/[0.05] transition-all duration-500 group">
              <Mail className="w-14 h-14 text-[#80DEEA] mb-8 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-[0_0_15px_rgba(128,222,234,0.6)]" />
              <h4 className="text-xl font-black uppercase tracking-[0.2em] text-white mb-6 drop-shadow-md">Autonomous AI Outreach</h4>
              <p className="text-base text-gray-400 leading-relaxed font-medium">A relentless digital acquisition team. Automated seller communication and negotiation sequencing to source off-market distress.</p>
            </div>

            <div className="p-12 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_30px_rgba(0,0,0,0.5)] hover:border-[#80DEEA]/40 hover:bg-white/[0.05] transition-all duration-500 group">
              <Building2 className="w-14 h-14 text-[#80DEEA] mb-8 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-[0_0_15px_rgba(128,222,234,0.6)]" />
              <h4 className="text-xl font-black uppercase tracking-[0.2em] text-white mb-6 drop-shadow-md">Exclusive Acquisition Feed</h4>
              <p className="text-base text-gray-400 leading-relaxed font-medium">No MLS trash. Direct pipeline to pre-vetted, high-yield St. Louis assets including tax delinquencies, LRA, and heavy distress.</p>
            </div>

            <div className="p-12 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_30px_rgba(0,0,0,0.5)] hover:border-[#80DEEA]/40 hover:bg-white/[0.05] transition-all duration-500 group">
              <FileText className="w-14 h-14 text-[#80DEEA] mb-8 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-[0_0_15px_rgba(128,222,234,0.6)]" />
              <h4 className="text-xl font-black uppercase tracking-[0.2em] text-white mb-6 drop-shadow-md">Dynamic Smart Contracts</h4>
              <p className="text-base text-gray-400 leading-relaxed font-medium">One click generates flawless, Missouri-compliant legal agreements. The AI auto-injects entity data and locks down assignments instantly.</p>
            </div>

            <div className="p-12 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_30px_rgba(0,0,0,0.5)] hover:border-[#80DEEA]/40 hover:bg-white/[0.05] transition-all duration-500 group">
              <Scale className="w-14 h-14 text-[#80DEEA] mb-8 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-[0_0_15px_rgba(128,222,234,0.6)]" />
              <h4 className="text-xl font-black uppercase tracking-[0.2em] text-white mb-6 drop-shadow-md">Title-Ready E-Signatures</h4>
              <p className="text-base text-gray-400 leading-relaxed font-medium">Fully compliant DocuSign integration. Contracts are securely routed, signed, and automatically pushed to escrow without human friction.</p>
            </div>

            <div className="p-12 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_30px_rgba(0,0,0,0.5)] hover:border-[#80DEEA]/40 hover:bg-white/[0.05] transition-all duration-500 group">
              <Layers className="w-14 h-14 text-[#80DEEA] mb-8 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-[0_0_15px_rgba(128,222,234,0.6)]" />
              <h4 className="text-xl font-black uppercase tracking-[0.2em] text-white mb-6 drop-shadow-md">Tiered Infrastructure</h4>
              <p className="text-base text-gray-400 leading-relaxed font-medium">Scalable architecture built for everyone from the hungry independent operator up to heavy-capital institutional hedge funds.</p>
            </div>
          </div>

          <div className="mt-28 text-center">
            <button onClick={scrollToTop} className="inline-flex items-center justify-center px-20 py-8 rounded-xl font-black text-white uppercase tracking-[0.3em] text-sm bg-white/5 border border-white/20 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_15px_40px_rgba(0,0,0,0.6)] hover:bg-white/10 hover:border-[#80DEEA]/50 transition-all duration-300">
              Apply For Vault Access <ArrowRight className="w-5 h-5 ml-6 text-[#80DEEA]" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}