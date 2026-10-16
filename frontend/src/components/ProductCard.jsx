import React from 'react';
import { Star, ShoppingCart, Eye, Heart, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({
  product,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  isWishlisted,
}) {
  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white rounded-2xl border border-slate-200 hover:border-cyan-400 hover:shadow-xl transition duration-200 flex flex-col overflow-hidden p-4 text-slate-900"
    >
      {/* Top Badge & Wishlist Pill */}
      <div className="flex items-center justify-between mb-2">
        {product.badge ? (
          <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase bg-red-600 text-white">
            {product.badge}
          </span>
        ) : discountPercent ? (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-cyan-700 text-white">
            {discountPercent}% OFF
          </span>
        ) : (
          <span className="text-[10px] font-bold text-slate-500 uppercase">
            {product.category}
          </span>
        )}

        <button
          onClick={() => onToggleWishlist(product)}
          className={`p-1.5 rounded-full transition ${
            isWishlisted
              ? 'bg-rose-50 text-rose-500'
              : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
          }`}
          title="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Image Stage */}
      <div
        onClick={() => onQuickView(product)}
        className="relative aspect-square overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center cursor-pointer mb-3 p-2"
      >
        <img
          src={
            product.thumbnail ||
            (product.images && product.images[0]) ||
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
          }
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
          loading="lazy"
        />

        {/* Quick View Floating Pill */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-2 inset-x-4 py-1.5 rounded-lg bg-slate-900/80 text-white text-[11px] font-bold flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition backdrop-blur-sm shadow"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick Look</span>
        </button>
      </div>

      {/* Product Info (Amazon format: Title, Brand, Rating stars, Price) */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] text-slate-500 font-semibold block">
            {product.brand || 'Prime Brand'}
          </span>

          <h3
            onClick={() => onQuickView(product)}
            className="font-bold text-sm text-slate-900 hover:text-cyan-700 cursor-pointer line-clamp-2 leading-snug mt-0.5 transition"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-500">
              {'★'.repeat(Math.round(product.rating || 5))}
              <span className="text-slate-300 text-[10px]">
                {'★'.repeat(5 - Math.round(product.rating || 5))}
              </span>
            </div>
            <span className="text-xs font-bold text-cyan-800">
              {product.rating || '4.8'}
            </span>
            <span className="text-[11px] text-slate-400">
              ({product.reviewsCount || 18})
            </span>
          </div>

          {/* Prime Delivery Promise */}
          <div className="flex items-center gap-1 mt-1 text-[11px] text-cyan-800 font-bold">
            <CheckCircle2 className="w-3 h-3 text-cyan-600" />
            <span>FREE Express Delivery</span>
          </div>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-950">
                ₹{product.price ? product.price.toLocaleString('en-IN') : '0'}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-bold block">
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Amazon-style vibrant Add to Cart button */}
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock <= 0}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-slate-950 font-black text-xs transition duration-150 shadow-sm active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
