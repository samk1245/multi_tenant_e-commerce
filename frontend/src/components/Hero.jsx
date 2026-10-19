import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Flame, Tag, Check, ArrowRight } from 'lucide-react';

export default function Hero({ tenant }) {
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  if (!tenant) return null;

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 border border-neutral-800/80 bg-neutral-900/95 shadow-2xl perspective-1000">
      
      {/* 3D Ambient Background Graphic with Glow */}
      <div className="absolute inset-0 z-0 opacity-30">
        <img
          src={tenant.bannerImage || "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1600&q=80"}
          alt={tenant.name}
          className="w-full h-full object-cover filter blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-900/50" />
      </div>

      {/* Floating 3D Ambient Lights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content Layout */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        
        {/* Left Column: Store Branding */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/80 border border-neutral-700/80 text-xs font-bold text-neutral-300 mb-4 backdrop-blur-md shadow-lg">
            <span className="text-base">{tenant.logo || '✨'}</span>
            <span className="text-emerald-400 font-extrabold">{tenant.category}</span>
            <span className="text-neutral-500">&bull;</span>
            <span className="text-neutral-400">Curated Multi-Tenant Flagship</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {tenant.name}
          </h1>

          <p className="mt-2 text-base sm:text-lg text-emerald-400/90 font-bold">
            {tenant.tagline}
          </p>

          <p className="mt-3 text-sm text-neutral-300 leading-relaxed max-w-xl">
            {tenant.description}
          </p>

          {/* Feature Badges */}
          <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-neutral-800/80 text-xs text-neutral-300">
            <div className="flex items-center gap-1.5 bg-neutral-950/50 px-2.5 py-1 rounded-lg border border-neutral-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Genuine & Verified</span>
            </div>
            <div className="flex items-center gap-1.5 bg-neutral-950/50 px-2.5 py-1 rounded-lg border border-neutral-800">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Free Express Delivery over ₹999</span>
            </div>
            <div className="flex items-center gap-1.5 bg-neutral-950/50 px-2.5 py-1 rounded-lg border border-neutral-800">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span>7-Day Return Guarantee</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Floating Discount Offer Banner */}
        <div className="w-full lg:w-auto lg:min-w-[340px] preserve-3d animate-float-slow">
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 border border-emerald-500/30 shadow-2xl backdrop-blur-xl">
            {/* Shimmer bar on top */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 rounded-t-2xl" />

            <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>Limited Festive Offer</span>
            </div>

            <div className="text-2xl font-black text-white">
              Flat 20% Discount
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              On all orders above ₹2,499. Apply coupon code at checkout:
            </p>

            {/* Coupon Code Pill */}
            <div className="mt-4 flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 shadow-inner">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-400" />
                <span className="font-mono font-black text-sm text-emerald-400 tracking-wider">
                  FESTIVE20
                </span>
              </div>
              <button
                onClick={() => handleCopyCoupon('FESTIVE20')}
                className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition active:scale-95 flex items-center gap-1 cursor-pointer"
              >
                {copiedCoupon ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <span>Copy Code</span>
                )}
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500">
              <span>Code 'VIP15' also available (15% off)</span>
              <span className="text-emerald-400 font-semibold">Ends Soon</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
