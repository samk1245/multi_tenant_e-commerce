import React from 'react';
import { Sparkles, ShieldCheck, Truck, RefreshCw, ChevronRight } from 'lucide-react';

export default function Hero({ tenant }) {
  if (!tenant) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 text-white border-b border-slate-700/60 shadow-lg">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Copy Banner */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Brand Store &bull; {tenant.category}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            {tenant.name}
          </h1>

          <p className="mt-2 text-base sm:text-lg text-slate-300 font-medium">
            {tenant.tagline}
          </p>

          <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-xl line-clamp-2">
            {tenant.description}
          </p>

          {/* Amazon-style prime benefits bar */}
          <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-slate-300 pt-4 border-t border-slate-700/60">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>Free Delivery Over ₹999</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>100% Genuine Guaranteed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span>7 Days Return Window</span>
            </div>
          </div>
        </div>

        {/* Right Hero Product Card Graphic */}
        <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-slate-700 bg-slate-900/80 shadow-2xl p-4 flex-shrink-0">
          <img
            src={tenant.bannerImage || "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80"}
            alt={tenant.name}
            className="w-full h-44 object-cover rounded-xl"
          />
          <div className="mt-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-cyan-400">Exclusive Drop</span>
              <h4 className="text-sm font-black text-white">Curated Collection</h4>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-cyan-500 text-slate-950 font-black text-xs">
              Prime Deals
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
