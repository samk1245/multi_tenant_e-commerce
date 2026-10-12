import React from 'react';
import { Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function Hero({ tenant }) {
  if (!tenant) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 border border-neutral-800 bg-neutral-900 shadow-2xl">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0 opacity-25">
        <img
          src={tenant.bannerImage || "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1600&q=80"}
          alt={tenant.name}
          className="w-full h-full object-cover filter blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-neutral-900/40" />
      </div>

      <div className="relative z-10 p-8 sm:p-12 lg:p-14 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800/80 border border-neutral-700 text-xs font-bold text-neutral-300 mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Curated Collection &bull; {tenant.category}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          {tenant.name}
        </h1>

        <p className="mt-3 text-base sm:text-lg text-neutral-300 font-medium">
          {tenant.tagline}
        </p>

        <p className="mt-2 text-sm text-neutral-400 line-clamp-2 max-w-xl">
          {tenant.description}
        </p>

        {/* Feature Badges */}
        <div className="mt-8 flex flex-wrap gap-4 pt-4 border-t border-neutral-800/80 text-xs text-neutral-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Verified Authentic</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>Fast Express Dispatch</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            <span>30-Day Hassle Free Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
}
