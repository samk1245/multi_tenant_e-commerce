import React from 'react';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({
  product,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  isWishlisted,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-neutral-900/90 rounded-3xl border border-neutral-800/80 hover:border-neutral-700 transition duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square overflow-hidden bg-neutral-950">
        <img
          src={
            product.thumbnail ||
            (product.images && product.images[0]) ||
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
          }
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3.5 left-3.5 px-2.5 py-1 text-[10px] font-black tracking-wider uppercase rounded-xl bg-neutral-950/85 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
            {product.badge}
          </span>
        )}

        {/* Top Right Action Pills */}
        <div className="absolute top-3.5 right-3.5 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition">
          {/* Wishlist toggle */}
          <button
            onClick={() => onToggleWishlist(product)}
            className={`p-2 rounded-xl backdrop-blur-md transition ${
              isWishlisted
                ? 'bg-rose-500 text-white shadow-lg'
                : 'bg-neutral-900/80 text-neutral-300 hover:text-rose-400 hover:bg-neutral-800'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Quick View Button */}
          <button
            onClick={() => onQuickView(product)}
            className="p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white transition backdrop-blur-md"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span className="uppercase tracking-wider font-extrabold text-[10px] text-emerald-400">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-neutral-200">{product.rating || '4.9'}</span>
              <span className="text-neutral-500">({product.reviewsCount || 12})</span>
            </div>
          </div>

          <h3 className="font-black text-base text-white group-hover:text-emerald-400 transition line-clamp-1">
            {product.title}
          </h3>

          <p className="mt-1 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-neutral-500 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">
              {product.stock > 0 ? (
                <span className="text-emerald-400 font-semibold">&bull; {product.stock} in stock</span>
              ) : (
                <span className="text-rose-400 font-semibold">&bull; Out of stock</span>
              )}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddToCart(product)}
            disabled={product.stock <= 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 font-black text-xs transition duration-200 shadow-md active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
