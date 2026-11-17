import React, { useState } from 'react';
import { Mail, Check, ShieldCheck, Truck, RefreshCw, Lock, Sparkles, Send } from 'lucide-react';

export default function Footer({ tenants, onSelectTenant }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 3000);
  };

  return (
    <footer className="mt-20 border-t border-white/10 bg-[#050508]/95 text-neutral-400 text-xs">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-white/5">
        <div className="rounded-3xl bg-gradient-to-r from-[#090b16] via-[#101222] to-[#090b16] border border-purple-500/30 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="max-w-xl space-y-2">
            <span className="text-cyan-400 font-extrabold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>ShopSphere VIP Insider</span>
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Unlock Exclusive Flash Drops & 15% Off Your First Order
            </h3>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Receive private drop invitations, secret store promo codes, and weekly curated edits directly to your inbox.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex-1 max-w-md">
            {subscribed ? (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>You're in! Check your email for code 'WELCOME15'.</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#050508] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-purple-600/30 active:scale-95 whitespace-nowrap"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Main Footer Links & Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Col 1: Platform Overview */}
        <div className="col-span-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#050508] rounded-[10px] flex items-center justify-center">
                <span className="text-sm font-black text-white">S</span>
              </div>
            </div>
            <span className="text-lg font-black text-white tracking-tight">ShopSphere 3D Platform</span>
          </div>
          <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
            Enterprise multi-tenant digital commerce cloud uniting 14 independent luxury boutiques, tech artisans, and lifestyle merchants under real-time 3D spatial experiences.
          </p>
          <div className="flex items-center gap-4 pt-2 text-[11px] text-neutral-300">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>100% Genuine</span>
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>256-Bit SSL</span>
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Express Logistics</span>
            </span>
          </div>
        </div>

        {/* Col 2: Flagship Stores */}
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Flagship Stores</h4>
          <ul className="space-y-2">
            {(tenants || []).slice(0, 5).map((t) => (
              <li key={t._id}>
                <button
                  onClick={() => onSelectTenant && onSelectTenant(t)}
                  className="hover:text-cyan-400 transition cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>{t.logo}</span>
                  <span className="truncate">{t.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: More Boutiques */}
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">More Boutiques</h4>
          <ul className="space-y-2">
            {(tenants || []).slice(5, 10).map((t) => (
              <li key={t._id}>
                <button
                  onClick={() => onSelectTenant && onSelectTenant(t)}
                  className="hover:text-purple-300 transition cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>{t.logo}</span>
                  <span className="truncate">{t.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Platform Security & Governance */}
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Governance</h4>
          <ul className="space-y-2 text-neutral-400">
            <li>Multi-Tenant Isolation</li>
            <li>Role-Based Access Control</li>
            <li>GST Tax Invoice Engine</li>
            <li>Live Courier Logistics</li>
            <li>24/7 AI Support Desk</li>
            <li>99.99% Platform SLA</li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} ShopSphere Enterprise Inc. All rights reserved. Multi-Tenant Architecture.
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span className="hover:text-white transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition cursor-pointer">Security Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
