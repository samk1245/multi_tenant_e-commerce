import React, { useState, useRef } from 'react';
import { Star, ShoppingCart, Eye, Sparkles, Flame } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function ProductCard({ product, onAddToCart, onQuickView }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, active: false });

  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg tilt
    const rotateY = ((x - centerX) / centerX) * 9;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY, glareX, glareY, active: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, active: false });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tilt.active
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: tilt.active ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className="group relative bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 rounded-2xl border border-neutral-800/80 hover:border-emerald-500/40 transition-colors duration-300 flex flex-col overflow-hidden shadow-xl hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)]"
    >
      {/* 3D Dynamic Glare Effect */}
      {tilt.active && (
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 65%)`,
          }}
        />
      )}

      {/* Product Image Section with 3D Depth */}
      <div className="relative aspect-square overflow-hidden bg-neutral-950 preserve-3d">
        <img
          src={product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* 3D Floating Badges (Top Left) */}
        <div
          className="absolute top-3 left-3 flex flex-col gap-1.5 z-20"
          style={{ transform: 'translateZ(25px)' }}
        >
          {discountPercent > 0 && (
            <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-black tracking-wider uppercase rounded-md bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-lg animate-pulse-glow">
              <Flame className="w-3 h-3 fill-white" />
              <span>{discountPercent}% OFF</span>
            </span>
          )}

          {product.badge && (
            <span className="px-2.5 py-1 text-[10px] font-black tracking-wider uppercase rounded-md bg-neutral-950/90 text-emerald-400 border border-emerald-500/30 backdrop-blur-md shadow-md">
              {product.badge}
            </span>
          )}
        </div>

        {/* Quick View Button with 3D Pop (Top Right) */}
        <button
          onClick={() => onQuickView(product)}
          style={{ transform: 'translateZ(30px)' }}
          className="absolute top-3 right-3 p-2.5 rounded-xl bg-neutral-900/90 hover:bg-emerald-500 text-neutral-300 hover:text-neutral-950 border border-neutral-700/60 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md shadow-xl active:scale-90"
          title="Quick View & Reviews"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Ambient Dark Bottom Gradient for visual depth */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />
      </div>

      {/* Product Information Section */}
      <div
        className="p-5 flex-1 flex flex-col justify-between preserve-3d"
        style={{ transform: 'translateZ(15px)' }}
      >
        <div>
          {/* Category & Star Rating */}
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span className="uppercase tracking-wider font-extrabold text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-neutral-100">{(product.rating || 4.8).toFixed(1)}</span>
              <span className="text-[11px] text-neutral-500">
                ({product.reviewsCount || product.reviews?.length || 18})
              </span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
            {product.title}
          </h3>

          {/* Description snippet */}
          <p className="mt-1 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing, Stock & 3D Interactive Add to Cart */}
        <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white tracking-tight">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-neutral-500 line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>
            <div className="text-[11px] mt-0.5">
              {product.stock > 0 ? (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {product.stock} in stock
                </span>
              ) : (
                <span className="text-rose-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  Out of stock
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock <= 0}
            style={{ transform: 'translateZ(20px)' }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500 text-neutral-950 font-black text-xs transition duration-200 shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
