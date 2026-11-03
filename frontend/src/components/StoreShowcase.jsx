import React from 'react';
import { Store, Star, Users, ArrowRight, Heart, Sparkles, CheckCircle } from 'lucide-react';

export default function StoreShowcase({ tenants, activeTenant, onSelectTenant }) {
  if (!tenants || tenants.length === 0) return null;

  return (
    <section className="mx-4 sm:mx-6 lg:mx-8 mt-12 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Multi-Vendor Marketplace</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Explore 14 Flagship Brand Destinations
          </h2>
          <p className="text-xs text-neutral-400">
            Independent online boutiques spanning Luxury Fashion, Gadgets, Mobile Phones, Organics, Watches & more
          </p>
        </div>
      </div>

      {/* Grid of Stores with 3D Neumorphic Glass Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tenants.map((t) => {
          const isActive = activeTenant?._id === t._id;
          return (
            <div
              key={t._id}
              onClick={() => onSelectTenant(t)}
              className={`group relative rounded-2xl p-4.5 border transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-b from-neutral-900 to-neutral-950 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                  : 'bg-neutral-900/70 hover:bg-neutral-900/90 border-neutral-800 hover:border-neutral-700 hover:shadow-xl'
              }`}
            >
              {/* Cover Banner Ambience */}
              <div className="absolute top-0 inset-x-0 h-16 opacity-20 overflow-hidden pointer-events-none">
                <img
                  src={t.bannerImage || "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80"}
                  alt={t.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900" />
              </div>

              <div>
                <div className="flex items-start justify-between relative z-10 mb-3">
                  <span className="text-3xl p-2.5 rounded-2xl bg-neutral-950 border border-neutral-800/90 shadow-md">
                    {t.logo || '🛍️'}
                  </span>
                  {isActive && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active Store
                    </span>
                  )}
                </div>

                <div className="relative z-10">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block mb-1.5">
                    {t.category}
                  </span>
                  <h3 className="font-black text-white text-base group-hover:text-emerald-400 transition leading-snug">
                    {t.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {t.tagline || t.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs relative z-10">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{t.rating?.toFixed(1) || '4.9'}</span>
                  <span className="text-neutral-500 text-[10px] font-normal">
                    ({(t.followersCount || 1200).toLocaleString()})
                  </span>
                </div>

                <span className="text-[11px] font-bold text-neutral-300 group-hover:text-emerald-400 flex items-center gap-1 transition">
                  <span>Enter Store</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
