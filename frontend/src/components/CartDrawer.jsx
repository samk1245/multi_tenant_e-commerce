import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) {
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const tax = (subtotal - discountAmount) * 0.08;
  const total = Math.max(0, subtotal - discountAmount + shipping + tax);

  const applyCoupon = (e) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'VIP15' || coupon.trim().toUpperCase() === 'DROP10') {
      const disc = coupon.trim().toUpperCase() === 'VIP15' ? 15 : 10;
      setDiscountPercent(disc);
      setCouponApplied(true);
    } else {
      alert("Try promo coupon code 'VIP15' for 15% off!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-white">Your Shopping Cart</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-bold">
                {items.reduce((c, i) => c + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shipping Progress */}
          <div className="px-6 py-3 bg-neutral-950/60 border-b border-neutral-800/80 text-xs">
            {subtotal >= 150 ? (
              <p className="text-emerald-400 font-bold flex items-center gap-1.5">
                🎉 Congratulations! You unlocked FREE Standard Shipping!
              </p>
            ) : (
              <div>
                <p className="text-neutral-400 mb-1.5">
                  Add <span className="text-white font-bold">${(150 - subtotal).toFixed(2)}</span> more to unlock <span className="text-emerald-400 font-bold">FREE Shipping</span>
                </p>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / 150) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 text-neutral-400">
                <p className="text-4xl mb-3">🛒</p>
                <p className="text-base font-semibold text-neutral-300">Your cart is empty</p>
                <p className="text-xs mt-1">Explore our products and find something you love!</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800/80"
                >
                  <img
                    src={item.thumbnail || item.images?.[0]}
                    alt={item.title}
                    className="w-18 h-18 object-cover rounded-lg bg-neutral-900 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                    <p className="text-xs text-emerald-400 font-bold mt-0.5">
                      ${item.price.toFixed(2)}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 border border-neutral-700 bg-neutral-900 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                          className="p-1 hover:text-white text-neutral-400"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                          className="p-1 hover:text-white text-neutral-400"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item._id)}
                        className="text-neutral-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-neutral-800 bg-neutral-950/80 space-y-3">
              {/* Promo code */}
              <form onSubmit={applyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Promo code (try VIP15)"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 text-xs font-bold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition"
                >
                  Apply
                </button>
              </form>

              {couponApplied && (
                <p className="text-[11px] text-emerald-400 font-semibold">
                  ✓ Promo applied: {discountPercent}% discount!
                </p>
              )}

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-neutral-400 pt-2 border-t border-neutral-800/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-neutral-200 font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="text-neutral-200 font-semibold">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-neutral-200 font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-neutral-800">
                  <span>Total Amount</span>
                  <span className="text-emerald-400 text-base">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => onCheckout({ items, subtotal, shipping, tax, total })}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 transition duration-200 shadow-xl active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit Encrypted Secure Checkout</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
