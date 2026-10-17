import React from 'react';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function ProductCard({ product, onAddToCart, onQuickView }) {
  return (
    <div className="group relative bg-neutral-900/90 rounded-2xl border border-neutral-800 hover:border-neutral-700 transition duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-2xl">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-950">
        <img
          src={product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-black tracking-wider uppercase rounded-md bg-neutral-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
            {product.badge}
          </span>
        )}

        {/* Quick View Button */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute top-3 right-3 p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/60 opacity-0 group-hover:opacity-100 transition duration-200 backdrop-blur-md"
          title="Quick View & Reviews"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[11px] text-emerald-400">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-neutral-200">{(product.rating || 4.8).toFixed(1)}</span>
              <span className="text-[11px] text-neutral-500">({product.reviewsCount || product.reviews?.length || 12})</span>
            </div>
          </div>

          <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition line-clamp-1">
            {product.title}
          </h3>

          <p className="mt-1 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-neutral-500 line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">
              {product.stock > 0 ? (
                <span className="text-emerald-400 font-medium">&bull; {product.stock} in stock</span>
              ) : (
                <span className="text-rose-400 font-medium">&bull; Out of stock</span>
              )}
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock <= 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 font-bold text-xs transition duration-200 shadow-md active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
