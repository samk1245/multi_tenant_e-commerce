import React from 'react';
import { X, Star, ShoppingCart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function ProductModal({ product, isOpen, onClose, onAddToCart }) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-950/80 text-neutral-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media */}
        <div className="bg-neutral-950 flex items-center justify-center p-6">
          <img
            src={product.thumbnail || product.images?.[0]}
            alt={product.title}
            className="w-full max-h-96 object-contain rounded-2xl"
          />
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {product.category}
            </span>

            <h2 className="text-2xl font-black text-white mt-1 leading-snug">
              {product.title}
            </h2>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="ml-1 text-sm font-bold text-white">{product.rating}</span>
              </div>
              <span className="text-xs text-neutral-400">({product.reviewsCount} customer reviews)</span>
              {product.badge && (
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {product.badge}
                </span>
              )}
            </div>

            <p className="text-sm text-neutral-300 mt-4 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-black text-white">${product.price.toFixed(2)}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-neutral-500 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
              <span className="text-xs text-emerald-400 font-semibold ml-auto">
                {product.stock} Units In Stock
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 transition"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <div className="grid grid-cols-3 gap-2 text-[10px] text-neutral-400 pt-3 border-t border-neutral-800 text-center">
              <div>Authentic Guarantee</div>
              <div>Free Returns</div>
              <div>Secure Payment</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
