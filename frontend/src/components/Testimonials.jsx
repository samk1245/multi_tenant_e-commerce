import React from 'react';
import { Star, ShieldCheck, Quote, CheckCircle } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: "Dr. Ananya Sen",
    city: "Bengaluru, Karnataka",
    verifiedStore: "Aurora Gourmet & Organic Botanicals",
    quote: "The raw acacia honey and first-harvest Uji matcha arrived in pristine glass packaging. Genuine artisan quality unlike anything in supermarkets.",
    rating: 5,
    role: "Verified Premium Member",
  },
  {
    name: "Aditya Roy",
    city: "Mumbai, Maharashtra",
    verifiedStore: "NovaCell Flagship Mobile",
    quote: "Purchased the Nova Fold Pro with same-day Mumbai delivery. The multi-tenant checkout with GST invoice and instant UPI QR was flawless.",
    rating: 5,
    role: "Tech Enthusiast",
  },
  {
    name: "Vikram Rathore",
    city: "New Delhi",
    verifiedStore: "Velocity Pro Athletic & Gym",
    quote: "Olympic calibrated urethane plates arrived with zero freight damage. Rock-solid weight tolerance within 10 grams as advertised.",
    rating: 5,
    role: "Strength & Conditioning Coach",
  },
  {
    name: "Cyrus Mistry",
    city: "Pune, Maharashtra",
    verifiedStore: "Chronos Haute Horlogerie",
    quote: "The exhibition open-heart timepiece is a work of art. The Horween leather strap and anti-reflective sapphire crystal look sublime on wrist.",
    rating: 5,
    role: "Horology Collector",
  },
];

export default function Testimonials() {
  return (
    <section className="mx-4 sm:mx-6 lg:mx-8 mt-14 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Shopper Community</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Trusted by Discerning Shoppers Across India
        </h2>
        <p className="text-xs text-neutral-400">
          Over 45,000+ authentic orders delivered with 256-bit encrypted security
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TESTIMONIALS.map((t, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition duration-300"
          >
            <Quote className="w-8 h-8 text-neutral-800/80 absolute top-4 right-4 pointer-events-none group-hover:text-emerald-500/20 transition" />

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

            <div className="mt-4 pt-3 border-t border-neutral-800/80 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs flex items-center gap-1">
                    <span>{t.name}</span>
                    <CheckCircle className="w-3 h-3 text-emerald-400 fill-emerald-400/20" />
                  </div>
                  <div className="text-[10px] text-neutral-500">{t.city}</div>
                </div>
              </div>
              <div className="text-[10px] text-emerald-400/90 font-medium mt-1 truncate">
                Purchased from {t.verifiedStore}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
