import React, { useState, useEffect } from 'react';
import { Flame, Clock, ShoppingCart, Zap, Star, Check } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function FlashDeals({ products, onAddToCart, onQuickView }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = (products || [])
    .filter((p) => p.compareAtPrice && p.compareAtPrice > p.price)
    .slice(0, 4);

  if (dealProducts.length === 0) return null;

  const handleClaim = (item) => {
    setAddedId(item._id);
    if (onAddToCart) onAddToCart(item);
    setTimeout(() => {
      setAddedId(null);
    }, 800);
  };

  return (
    <section className="mx-4 sm:mx-6 lg:mx-8 mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-950/20 via-[#0a0b14]/90 to-cyan-950/20 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Countdown Clock */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">
            <Flame className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>Limited-Time Lightning Drops</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white mt-1 tracking-tight">
            Flash Sale &bull; Up to 35% Instant Markdown
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Strict limited stock units allocated for immediate express dispatch
          </p>
        </div>

        {/* Live Ticking Countdown Timer */}
        <div className="flex items-center gap-2.5 bg-[#050508]/90 px-4 py-2.5 rounded-2xl border border-white/10 shadow-lg">
          <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs text-neutral-400 font-bold uppercase mr-1">Ends In:</span>
          <div className="flex items-center gap-1.5 font-mono text-sm font-black text-white">
            <span className="bg-[#121422] px-2.5 py-1 rounded-lg border border-white/10 text-neutral-200">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span className="text-neutral-500">:</span>
            <span className="bg-[#121422] px-2.5 py-1 rounded-lg border border-purple-500/30 text-purple-300">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span className="text-neutral-500">:</span>
            <span className="bg-[#121422] px-2.5 py-1 rounded-lg border border-cyan-500/30 text-cyan-300">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>
      </div>

      {/* Deal Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {dealProducts.map((item) => {
          const discount = Math.round(
            ((item.compareAtPrice - item.price) / item.compareAtPrice) * 100
          );
          const stockPercent = Math.min(100, (item.stock / 20) * 100);
          const isAdded = addedId === item._id;

          return (
            <div
              key={item._id}
              className="group rounded-2xl bg-[#090a13]/85 border border-white/10 hover:border-purple-500/40 p-4 transition duration-300 flex flex-col justify-between shadow-xl hover:shadow-[0_15px_35px_rgba(0,0,0,0.5)] backdrop-blur-md"
            >
              <div>
                {/* Thumbnail with Discount Badge */}
                <div
                  onClick={() => onQuickView && onQuickView(item)}
                  className="aspect-square rounded-xl bg-[#050508] overflow-hidden relative cursor-pointer"
                >
                  <img
                    src={item.thumbnail || item.images?.[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white font-black text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-md">
                    <Zap className="w-3 h-3 fill-white" />
                    <span>{discount}% OFF</span>
                  </span>
                </div>

                <div className="mt-3.5">
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">
                      {item.brand}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{(item.rating || 4.8).toFixed(1)}</span>
                    </div>
                  </div>
                  <h4
                    onClick={() => onQuickView && onQuickView(item)}
                    className="font-bold text-white text-xs line-clamp-1 group-hover:text-purple-300 transition cursor-pointer"
                  >
                    {item.title}
                  </h4>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-base font-black text-white font-mono">
                      {formatCurrency(item.price)}
                    </span>
                    <span className="text-xs text-neutral-500 line-through font-mono">
                      {formatCurrency(item.compareAtPrice)}
                    </span>
                  </div>

                  {/* Stock Left Meter */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[10px] text-neutral-400">
                      <span>Limited Stock</span>
                      <span className="text-amber-400 font-bold">Only {item.stock} left</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                        style={{ width: `${stockPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleClaim(item)}
                className={`mt-4 w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition duration-200 cursor-pointer active:scale-95 shadow-md ${
                  isAdded
                    ? 'bg-emerald-500 text-neutral-950 shadow-emerald-500/40'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/25'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Claimed to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Claim Deal</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
