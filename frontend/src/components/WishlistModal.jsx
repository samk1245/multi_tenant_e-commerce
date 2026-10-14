import React, { useState } from 'react';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';

export default function WishlistModal({ isOpen, onClose, wishlist, onAddToCart, onRemoveWishlist }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Your Saved Wishlist</h3>
              <p className="text-xs text-neutral-400">{wishlist.length} item(s) saved for later</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {wishlist.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 text-xs">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-30 stroke-[1.5]" />
              <p className="text-sm font-bold text-neutral-300">Your wishlist is currently empty</p>
              <p className="mt-1">Click the heart icon on any product card to save items here.</p>
            </div>
          ) : (
            wishlist.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.thumbnail || (item.images && item.images[0])}
                    alt={item.title}
                    className="w-14 h-14 rounded-xl object-cover bg-neutral-900 flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white line-clamp-1">{item.title}</h4>
                    <span className="text-xs font-black text-emerald-400">₹{item.price ? item.price.toLocaleString('en-IN') : '0'}</span>
                    <span className="text-[11px] text-neutral-500 block">{item.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onAddToCart(item);
                      onRemoveWishlist(item._id);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                  <button
                    onClick={() => onRemoveWishlist(item._id)}
                    className="p-2 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
