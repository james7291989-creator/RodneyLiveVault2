import React from 'react';
import { ShieldCheck, Target, Layers, Star, Crown, Diamond, Check, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const STRIPE_LINKS = {
  BRONZE: "https://buy.stripe.com/test_00wdR9aPJ1at02T6Ud5J600",
  SILVER: "https://buy.stripe.com/test_00wdR9aPJ1at02T6Ud5J600",
  GOLD: "https://buy.stripe.com/test_00wdR9aPJ1at02T6Ud5J600",
  PLATINUM: "https://buy.stripe.com/test_00wdR9aPJ1at02T6Ud5J600",
  CRYSTAL_DIAMOND: "https://buy.stripe.com/test_00wdR9aPJ1at02T6Ud5J600"
};

const TIERS = [
  { id: 'BRONZE', name: 'Bronze', price: '$49', icon: <Target className="w-8 h-8 text-orange-500" />, borderColor: 'border-orange-500/50', bgColor: 'bg-orange-500', features: ['Asset Vault Access', 'Basic Filtering', 'Standard Support'] },
  { id: 'SILVER', name: 'Silver', price: '$98', icon: <Layers className="w-8 h-8 text-gray-400" />, borderColor: 'border-gray-500/50', bgColor: 'bg-gray-500', features: ['Bronze Features', 'AI Underwriting (ARV/MAO)', 'Live Board Pipeline'] },
  { id: 'GOLD', name: 'Gold', price: '$297', icon: <Star className="w-8 h-8 text-yellow-500" />, borderColor: 'border-yellow-500/50', bgColor: 'bg-yellow-500', popular: true, features: ['Silver Features', 'Digital Escrow Access', 'One-Touch Smart Contracts', 'Priority Support'] },
  { id: 'PLATINUM', name: 'Platinum', price: '$497', icon: <Crown className="w-8 h-8 text-slate-300" />, borderColor: 'border-slate-500/50', bgColor: 'bg-slate-500', features: ['Gold Features', 'Autonomous Seller Outreach', 'Unlimited LLC Piercing', 'API Access'] },
  { id: 'CRYSTAL_DIAMOND', name: 'Crystal Diamond', price: '$997', icon: <Diamond className="w-8 h-8 text-[#80DEEA]" />, borderColor: 'border-[#80DEEA]', bgColor: 'bg-[#80DEEA]', features: ['Platinum Features', 'Dedicated Server Node', 'Hedge Fund Data Pipeline', '1-on-1 CTO Support'] }
];

export default function PricingWall() {
  const { user } = useAuth();
  const isGodMode = user?.email === 'james7291989@gmail.com';

  const handlePurchase = (tierId) => {
    const url = STRIPE_LINKS[tierId];
    if (url) window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-[#010103] text-white font-mono relative p-8 pb-20">
      {/* BACKGROUND GRID */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] z-0 pointer-events-none opacity-20"></div>

      <header className="relative z-10 mb-12 text-center max-w-3xl mx-auto pt-10">
        <ShieldCheck className="w-16 h-16 text-[#80DEEA] mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">
          Establish Your Clearance
        </h1>
        <p className="text-gray-400 uppercase tracking-widest text-sm">
          Select your operational tier to deploy the Rodney & Sons automated acquisition weapon in the St. Louis market.
        </p>
        {isGodMode && (
          <div className="mt-6 inline-block bg-[#80DEEA]/10 border border-[#80DEEA]/30 px-4 py-2 rounded text-xs font-mono text-[#80DEEA]">
            <Zap className="w-4 h-4 inline mr-2" /> CEO GOD MODE ACTIVE: ALL TIERS UNLOCKED
          </div>
        )}
      </header>

      {/* REVENUE GATE GRID */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
        {TIERS.map((tier) => (
          <div key={tier.id} className={`bg-black/80 backdrop-blur-sm border ${tier.borderColor} rounded-2xl p-6 relative flex flex-col ${tier.popular ? 'transform md:-translate-y-4 shadow-[0_0_30px_rgba(234,179,8,0.15)] z-20' : 'z-10 hover:border-white/50 transition-all'}`}>
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] font-black uppercase px-3 py-1 rounded-full whitespace-nowrap">
                Most Popular
              </div>
            )}
            
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">{tier.icon}</div>
              <h2 className="text-lg font-black uppercase tracking-widest text-white">{tier.name}</h2>
              <div className="mt-4">
                <span className="text-3xl font-black">{tier.price}</span>
                <span className="text-gray-500 text-xs">/mo</span>
              </div>
            </div>

            <div className="flex-1 space-y-4 mb-8">
              {tier.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                  <Check className={`w-4 h-4 mt-0.5 ${tier.popular ? 'text-yellow-500' : 'text-[#80DEEA]'}`} />
                  <span className="leading-tight">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handlePurchase(tier.id)}
              className={`w-full py-3 rounded text-xs font-black uppercase tracking-widest transition-all ${
                tier.popular 
                  ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]' 
                  : `bg-white/5 border border-white/10 hover:${tier.bgColor} hover:text-black`
              }`}
            >
              {tier.id === 'CRYSTAL_DIAMOND' ? 'Initialize Node' : 'Deploy Tier'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}