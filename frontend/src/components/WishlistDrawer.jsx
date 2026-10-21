import React from 'react';
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function WishlistDrawer({
  isOpen,
  onClose,
  items,
  onAddToCart,
  onRemoveFromWishlist,
  onClearWishlist,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-rose-400" />
              </div>
              <h2 className="text-lg font-black text-white">Your Wishlist</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-bold">
                {items.length} saved
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
            {items.length === 0 ? (
              <div className="text-center py-20 text-neutral-400">
                <Heart className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
                <p className="text-base font-bold text-neutral-300">Your wishlist is empty</p>
                <p className="text-xs mt-1 max-w-xs mx-auto">
                  Click the heart icon on any product to save it for later or compare favorites!
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 hover:border-neutral-700/80 transition"
                >
                  <img
                    src={item.thumbnail || item.images?.[0]}
                    alt={item.title}
                    className="w-18 h-18 object-cover rounded-xl bg-neutral-900 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                    <p className="text-xs text-white font-black mt-1">
                      {formatCurrency(item.price)}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <button
                        onClick={() => {
                          onAddToCart(item);
                          onRemoveFromWishlist(item._id);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold transition shadow-md cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Move to Cart</span>
                      </button>

                      <button
                        onClick={() => onRemoveFromWishlist(item._id)}
                        className="p-1.5 text-neutral-500 hover:text-rose-400 transition cursor-pointer"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-neutral-800 bg-neutral-950/90 flex items-center justify-between">
              <button
                onClick={onClearWishlist}
                className="text-xs font-semibold text-neutral-400 hover:text-rose-400 transition cursor-pointer"
              >
                Clear Wishlist
              </button>

              <button
                onClick={() => {
                  items.forEach((item) => onAddToCart(item));
                  onClearWishlist();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition cursor-pointer"
              >
                <span>Add All to Cart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
