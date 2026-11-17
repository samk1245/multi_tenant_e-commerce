import React, { useState, useRef } from 'react';
import { Star, ShoppingCart, Eye, Sparkles, Flame, Heart, Scale, Check } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function ProductCard({
  product,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  isWishlisted,
  onToggleCompare,
  isCompared,
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, active: false });
  const [isAdding, setIsAdding] = useState(false);
  const [flyingItem, setFlyingItem] = useState(false);

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY, glareX, glareY, active: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, active: false });
  };

  const handleAddWithFly = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    setFlyingItem(true);

    if (onAddToCart) {
      onAddToCart(product);
    }

    setTimeout(() => {
      setIsAdding(false);
    }, 700);

    setTimeout(() => {
      setFlyingItem(false);
    }, 900);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tilt.active
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-5px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: tilt.active ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className="group relative bg-[#0b0c16]/90 rounded-2xl border border-white/10 hover:border-purple-500/40 transition-colors duration-300 flex flex-col overflow-hidden shadow-xl hover:shadow-[0_20px_45px_rgba(139,92,246,0.18)]"
    >
      {/* 3D Dynamic Specular Glare */}
      {tilt.active && (
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 65%)`,
          }}
        />
      )}

      {/* Fly-to-Cart Floating Item Particle */}
      {flyingItem && (
        <div
          className="flying-item-node absolute z-50 pointer-events-none w-14 h-14 rounded-full overflow-hidden border-2 border-purple-400 shadow-[0_0_25px_rgba(139,92,246,0.8)]"
          style={{
            top: '40%',
            left: '40%',
            '--fly-x-mid': '40px',
            '--fly-y-mid': '-120px',
            '--fly-x-end': '220px',
            '--fly-y-end': '-380px',
          }}
        >
          <img
            src={product.thumbnail || product.images?.[0]}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Product Image Section with 3D Depth */}
      <div className="relative aspect-square overflow-hidden bg-[#050508] preserve-3d">
        <img
          src={
            product.thumbnail ||
            product.images?.[0] ||
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
          }
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
            <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-black tracking-wider uppercase rounded-md bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white shadow-lg animate-pulse-glow">
              <Flame className="w-3 h-3 fill-white" />
              <span>{discountPercent}% OFF</span>
            </span>
          )}

          {product.badge && (
            <span className="px-2.5 py-1 text-[10px] font-black tracking-wider uppercase rounded-md bg-neutral-950/90 text-cyan-400 border border-cyan-500/30 backdrop-blur-md shadow-md">
              {product.badge}
            </span>
          )}
        </div>

        {/* Top Right Floating Action Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
          {/* Wishlist Heart */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleWishlist) onToggleWishlist(product);
            }}
            style={{ transform: 'translateZ(30px)' }}
            className={`p-2 rounded-xl backdrop-blur-md border transition-all duration-300 shadow-xl cursor-pointer ${
              isWishlisted
                ? 'bg-rose-500 text-white border-rose-400 shadow-rose-500/40 scale-105'
                : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-rose-400 border-white/10'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
          </button>

          {/* Compare Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleCompare) onToggleCompare(product);
            }}
            style={{ transform: 'translateZ(30px)' }}
            className={`p-2 rounded-xl backdrop-blur-md border transition-all duration-300 shadow-xl cursor-pointer ${
              isCompared
                ? 'bg-purple-600 text-white border-purple-400 shadow-purple-500/40 scale-105'
                : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-purple-400 border-white/10'
            }`}
            title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
          >
            <Scale className="w-4 h-4" />
          </button>

          {/* Quick View Button */}
          <button
            onClick={() => onQuickView(product)}
            style={{ transform: 'translateZ(30px)' }}
            className="p-2 rounded-xl bg-neutral-900/90 hover:bg-cyan-500 text-neutral-300 hover:text-neutral-950 border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md shadow-xl active:scale-90 cursor-pointer"
            title="3D Quick View & Reviews"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Ambient Dark Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0b0c16] via-[#0b0c16]/50 to-transparent pointer-events-none" />
      </div>

      {/* Product Details Section */}
      <div
        className="p-5 flex-1 flex flex-col justify-between preserve-3d"
        style={{ transform: 'translateZ(15px)' }}
      >
        <div>
          {/* Category Pill & Star Rating */}
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span className="uppercase tracking-wider font-extrabold text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-neutral-100">
                {(product.rating || 4.8).toFixed(1)}
              </span>
              <span className="text-[11px] text-neutral-500">
                ({product.reviewsCount || product.reviews?.length || 18})
              </span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors line-clamp-1">
            {product.title}
          </h3>

          {/* Description snippet */}
          <p className="mt-1 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price, Stock Urgency & Add to Cart */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
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
              {product.stock > 5 ? (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {product.stock} in stock
                </span>
              ) : product.stock > 0 ? (
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  Only {product.stock} left!
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
            onClick={handleAddWithFly}
            disabled={product.stock <= 0}
            style={{ transform: 'translateZ(20px)' }}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-black text-xs transition-all duration-200 shadow-lg active:scale-95 cursor-pointer ${
              isAdding
                ? 'bg-emerald-500 text-neutral-950 shadow-emerald-500/40'
                : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-purple-600/25 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500'
            }`}
          >
            {isAdding ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
