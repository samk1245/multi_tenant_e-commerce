import React from 'react';
import { Star, ShieldCheck, Quote, CheckCircle, Sparkles, Award } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: "Dr. Ananya Sen",
    city: "Bengaluru, Karnataka",
    verifiedStore: "Aurora Gourmet & Organic Botanicals",
    quote: "The raw acacia honey and first-harvest Uji matcha arrived in pristine glass packaging. Genuine artisan quality unlike anything in mainstream supermarkets.",
    rating: 5,
    role: "Verified VIP Patron",
    avatar: "AS",
    accent: "from-purple-500 to-indigo-600",
  },
  {
    name: "Aditya Roy",
    city: "Mumbai, Maharashtra",
    verifiedStore: "NovaCell Flagship Mobile",
    quote: "Purchased the Nova Fold Pro with same-day Mumbai delivery. The multi-tenant checkout with GST invoice and instant UPI QR was totally seamless.",
    rating: 5,
    role: "SaaS Tech Lead",
    avatar: "AR",
    accent: "from-cyan-500 to-blue-600",
  },
  {
    name: "Vikram Rathore",
    city: "New Delhi",
    verifiedStore: "Velocity Pro Athletic & Gym",
    quote: "Olympic calibrated urethane plates arrived with zero freight damage. Rock-solid weight tolerance within 10 grams as advertised. Outstanding logistics.",
    rating: 5,
    role: "Pro Conditioning Coach",
    avatar: "VR",
    accent: "from-purple-600 to-pink-600",
  },
  {
    name: "Cyrus Mistry",
    city: "Pune, Maharashtra",
    verifiedStore: "Chronos Haute Horlogerie",
    quote: "The exhibition open-heart timepiece is a work of art. The Horween leather strap and anti-reflective sapphire crystal look sublime on wrist.",
    rating: 5,
    role: "Horology Collector",
    avatar: "CM",
    accent: "from-cyan-400 to-emerald-500",
  },
];

export default function Testimonials() {
  return (
    <section className="mx-4 sm:mx-6 lg:mx-8 mt-16 space-y-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/25 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Verified Shopper Voices</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Trusted by Discerning Shoppers Across India
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          Over 45,000+ authentic orders delivered across 14 independent flagship tenant boutiques with bank-grade 256-bit encryption.
        </p>

        {/* Trust Metric Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-neutral-300">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span><strong className="text-white">4.92 / 5</strong> Average Rating</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-neutral-300">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span><strong className="text-white">100%</strong> Verified Deliveries</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-neutral-300">
            <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
            <span><strong className="text-white">45,000+</strong> Orders Fulfilled</span>
          </div>
        </div>
      </div>

      {/* Grid of Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TESTIMONIALS.map((t, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-neutral-900/60 backdrop-blur-md border border-neutral-800/80 hover:border-purple-500/40 flex flex-col justify-between shadow-xl relative overflow-hidden group transition duration-300 hover:-translate-y-1"
          >
            {/* Background Glow Effect */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/15 transition-all"></div>
            <Quote className="w-9 h-9 text-neutral-800/60 absolute top-4 right-4 pointer-events-none group-hover:text-purple-500/20 transition" />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-1">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed italic">
                "{t.quote}"
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-neutral-800/80 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${t.accent} flex items-center justify-center text-white font-black text-[11px] shrink-0 shadow-md`}>
                  {t.avatar}
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-white text-xs flex items-center gap-1 truncate">
                    <span>{t.name}</span>
                    <CheckCircle className="w-3 h-3 text-cyan-400 fill-cyan-400/20 shrink-0" />
                  </div>
                  <div className="text-[10px] text-neutral-400 truncate">{t.role} &bull; {t.city}</div>
                </div>
              </div>
              <div className="text-[10px] text-purple-400 font-semibold mt-2 truncate bg-purple-500/5 px-2 py-0.5 rounded border border-purple-500/10">
                Purchased from {t.verifiedStore}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
