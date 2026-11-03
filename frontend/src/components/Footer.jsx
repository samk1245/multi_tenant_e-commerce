import React, { useState } from 'react';
import { Mail, Check, ShieldCheck, Truck, RefreshCw, Lock, Sparkles, Send } from 'lucide-react';

export default function Footer({ tenants, onSelectTenant }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 3000);
  };

  return (
    <footer className="mt-20 border-t border-neutral-800 bg-neutral-950/90 text-neutral-400 text-xs">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-neutral-800/80">
        <div className="rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-xl space-y-2">
            <span className="text-emerald-400 font-extrabold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VIP Marketplace Insider</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Unlock Exclusive Flash Drops & 15% Off Your First Order
            </h3>
            <p className="text-neutral-400 text-xs">
              Receive private drop invitations, secret store promo codes, and weekly curated edits directly to your inbox.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex-1 max-w-md">
            {subscribed ? (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>You're in! Check your email for code 'WELCOME15'.</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg active:scale-95 whitespace-nowrap"
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
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛍️</span>
            <span className="text-lg font-black text-white tracking-tight">OmniCommerce Platform</span>
          </div>
          <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
            India's premier next-generation multi-tenant marketplace platform uniting independent luxury boutiques, tech artisans, and direct-trade roasters.
          </p>
          <div className="flex items-center gap-3 pt-2 text-[11px] text-neutral-300">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Genuine</span>
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
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
            {(tenants || []).slice(0, 6).map((t) => (
              <li key={t._id}>
                <button
                  onClick={() => onSelectTenant && onSelectTenant(t)}
                  className="hover:text-emerald-400 transition text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span>{t.logo || '🏪'}</span>
                  <span className="truncate">{t.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: More Categories */}
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Categories</h4>
          <ul className="space-y-2">
            {(tenants || []).slice(6, 12).map((t) => (
              <li key={t._id}>
                <button
                  onClick={() => onSelectTenant && onSelectTenant(t)}
                  className="hover:text-emerald-400 transition text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span>{t.logo || '🏪'}</span>
                  <span className="truncate">{t.category}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Customer Services & Legal */}
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Customer Support</h4>
          <ul className="space-y-2">
            <li><a href="#track" className="hover:text-emerald-400 transition">Track Live Order</a></li>
            <li><a href="#support" className="hover:text-emerald-400 transition">24/7 Ticketing Help</a></li>
            <li><a href="#returns" className="hover:text-emerald-400 transition">7-Day Easy Returns</a></li>
            <li><a href="#privacy" className="hover:text-emerald-400 transition">Privacy & GST Invoicing</a></li>
            <li><a href="#merchant" className="hover:text-emerald-400 transition">Merchant Portal</a></li>
          </ul>
        </div>
      </div>

      {/* Payment Partners & Copyright Bar */}
      <div className="border-t border-neutral-900 bg-black/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-[11px] text-center sm:text-left">
            &copy; {new Date().getFullYear()} OmniCommerce Multi-Tenant Platform Inc. All rights reserved. Registered under Indian GST & IT Regulations.
          </p>

          {/* Payment Method Badges */}
          <div className="flex items-center gap-2 flex-wrap justify-center text-[10px] font-bold text-neutral-400">
            <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800">UPI Instant</span>
            <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800">RuPay</span>
            <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800">Visa</span>
            <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800">Mastercard</span>
            <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800">NetBanking</span>
            <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
