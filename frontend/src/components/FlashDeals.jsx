import React, { useState, useEffect } from 'react';
import { Flame, Clock, ShoppingCart, Zap, Star } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function FlashDeals({ products, onAddToCart, onQuickView }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

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

  const dealProducts = (products || []).filter((p) => p.compareAtPrice && p.compareAtPrice > p.price).slice(0, 4);

  if (dealProducts.length === 0) return null;

  return (
    <section className="mx-4 sm:mx-6 lg:mx-8 mt-12 p-6 rounded-3xl bg-gradient-to-br from-rose-950/30 via-neutral-900/90 to-amber-950/20 border border-rose-500/20 shadow-2xl relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Countdown Clock */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-400">
            <Flame className="w-4 h-4 fill-rose-400" />
            <span>Limited-Time Lightning Deals</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Flash Sale &bull; Up to 35% Instant Markdown
          </h2>
          <p className="text-xs text-neutral-400">Strict limited stock units allocated for immediate dispatch</p>
        </div>

        {/* Live Ticking Countdown Timer */}
        <div className="flex items-center gap-2 bg-neutral-950/80 px-4 py-2 rounded-2xl border border-neutral-800">
          <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs text-neutral-400 font-semibold uppercase mr-1">Ends In:</span>
          <div className="flex items-center gap-1 font-mono text-sm font-black text-white">
            <span className="bg-neutral-900 px-2 py-1 rounded-lg border border-neutral-700">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span>:</span>
            <span className="bg-neutral-900 px-2 py-1 rounded-lg border border-neutral-700 text-amber-400">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span>:</span>
            <span className="bg-neutral-900 px-2 py-1 rounded-lg border border-neutral-700 text-rose-400">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>
      </div>

      {/* Deal Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {dealProducts.map((item) => {
          const discount = Math.round(((item.compareAtPrice - item.price) / item.compareAtPrice) * 100);
          const stockPercent = Math.min(100, (item.stock / 20) * 100);

          return (
            <div
              key={item._id}
              className="group rounded-2xl bg-neutral-950/70 border border-neutral-800/90 hover:border-rose-500/40 p-4 transition duration-300 flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Thumbnail with Discount Badge */}
                <div
                  onClick={() => onQuickView && onQuickView(item)}
                  className="aspect-square rounded-xl bg-neutral-900 overflow-hidden relative cursor-pointer group-hover:shadow-inner"
                >
                  <img
                    src={item.thumbnail || item.images?.[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-md">
                    <Zap className="w-3 h-3 fill-white" />
                    <span>{discount}% OFF</span>
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase">{item.brand}</span>
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{(item.rating || 4.8).toFixed(1)}</span>
                    </div>
                  </div>
                  <h4
                    onClick={() => onQuickView && onQuickView(item)}
                    className="font-bold text-white text-xs line-clamp-1 group-hover:text-rose-400 transition cursor-pointer"
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

                  {/* Stock Left Progress Meter */}
                  <div className="mt-2.5 space-y-1">
                    <div className="flex justify-between text-[10px] text-neutral-400">
                      <span>Limited Stock</span>
                      <span className="text-rose-400 font-bold">Only {item.stock} left</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                        style={{ width: `${stockPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onAddToCart && onAddToCart(item)}
                className="mt-4 w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-rose-600 text-neutral-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shadow-md"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Claim Deal</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
