import React from 'react';
import { Store, Star, Users, ArrowRight, Heart, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function StoreShowcase({ tenants, activeTenant, onSelectTenant }) {
  if (!tenants || tenants.length === 0) return null;

  return (
    <section className="mx-4 sm:mx-6 lg:mx-8 mt-12 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Curated Multi-Vendor Ecosystem</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white mt-1 tracking-tight">
            Explore 14 Distinct Flagship Brand Destinations
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mt-0.5">
            Isolated digital storefronts powered by dynamic tenant resolution. Seamlessly switch boutiques across Luxury Fashion, Gadgets, Mobile, Organics, Watches & more.
          </p>
        </div>
      </div>

      {/* Grid of Stores with 3D Glassmorphic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tenants.map((t) => {
          const isActive = activeTenant?._id === t._id;
          return (
            <div
              key={t._id}
              onClick={() => onSelectTenant(t)}
              className={`group relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden backdrop-blur-xl ${
                isActive
                  ? 'bg-gradient-to-b from-[#131525] to-[#0a0b14] border-purple-500 shadow-2xl shadow-purple-500/20 ring-1 ring-purple-500/50 -translate-y-1'
                  : 'bg-[#0a0b14]/80 hover:bg-[#121422]/90 border-white/10 hover:border-cyan-500/40 hover:shadow-xl hover:-translate-y-0.5'
              }`}
            >
              {/* Cover Banner Ambience */}
              <div className="absolute top-0 inset-x-0 h-20 opacity-20 overflow-hidden pointer-events-none">
                <img
                  src={
                    t.bannerImage ||
                    'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={t.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0b14]" />
              </div>

              <div>
                <div className="flex items-start justify-between relative z-10 mb-3.5">
                  <span className="text-3xl p-3 rounded-2xl bg-[#050508] border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
                    {t.logo || '🛍️'}
                  </span>
                  {isActive ? (
                    <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-wider border border-purple-500/40 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      Active Boutique
                    </span>
                  ) : (
                    <span className="text-[10px] text-neutral-500 font-mono">
                      #{t.slug}
                    </span>
                  )}
                </div>

                <div className="relative z-10">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 inline-block mb-1.5">
                    {t.category}
                  </span>
                  <h3 className="font-black text-white text-base group-hover:text-purple-300 transition-colors leading-snug">
                    {t.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {t.tagline || t.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs relative z-10">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{t.rating?.toFixed(1) || '4.9'}</span>
                  <span className="text-neutral-500 text-[10px] font-normal">
                    ({(t.followersCount || 1400).toLocaleString()})
                  </span>
                </div>

                <span className="flex items-center gap-1 text-[11px] font-bold text-neutral-400 group-hover:text-cyan-400 transition-colors">
                  <span>Enter</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
