import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Flame, Check, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

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
  const [appliedCouponCode, setAppliedCouponCode] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingThreshold = 999;
  const shipping = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 99;
  const tax = Math.round((subtotal - discountAmount) * 0.05); // 5% GST
  const total = Math.max(0, subtotal - discountAmount + shipping + tax);

  const applySpecificCoupon = (code) => {
    const upper = code.trim().toUpperCase();
    let disc = 0;
    if (upper === 'FESTIVE20') disc = 20;
    else if (upper === 'VIP15') disc = 15;
    else if (upper === 'DROP10') disc = 10;
    else disc = 10;

    setDiscountPercent(disc);
    setAppliedCouponCode(upper);
    setCoupon(upper);
  };

  const applyCoupon = (e) => {
    e.preventDefault();
    if (!coupon.trim()) return;
    applySpecificCoupon(coupon);
  };

  const removeCoupon = () => {
    setDiscountPercent(0);
    setAppliedCouponCode('');
    setCoupon('');
  };

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
              <h2 className="text-lg font-black text-white">Your Shopping Cart</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                {items.reduce((c, i) => c + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shipping Progress */}
          <div className="px-6 py-3 bg-neutral-950/80 border-b border-neutral-800/80 text-xs">
            {subtotal >= shippingThreshold ? (
              <p className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Congratulations! You unlocked FREE Express Delivery!</span>
              </p>
            ) : (
              <div>
                <p className="text-neutral-400 mb-1.5">
                  Add <span className="text-white font-bold">{formatCurrency(shippingThreshold - subtotal)}</span> more for <span className="text-emerald-400 font-bold">FREE Delivery</span>
                </p>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / shippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
            {items.length === 0 ? (
              <div className="text-center py-20 text-neutral-400">
                <p className="text-5xl mb-3">🛒</p>
                <p className="text-base font-bold text-neutral-300">Your cart is empty</p>
                <p className="text-xs mt-1 max-w-xs mx-auto">
                  Discover our exclusive fashion, sneakers, specialty roasts and audio gear!
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
                    <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                    <p className="text-xs text-emerald-400 font-black mt-0.5">
                      {formatCurrency(item.price)}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 border border-neutral-700 bg-neutral-900 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                          className="p-1 hover:text-white text-neutral-400 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                          className="p-1 hover:text-white text-neutral-400 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item._id)}
                        className="text-neutral-500 hover:text-rose-400 transition cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout & Discounts */}
          {items.length > 0 && (
            <div className="p-6 border-t border-neutral-800 bg-neutral-950/90 space-y-3">
              
              {/* Quick Coupon Chips */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400 fill-amber-400" /> Apply Discount Coupons:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {['FESTIVE20', 'VIP15', 'DROP10'].map((code) => (
                    <button
                      key={code}
                      onClick={() => applySpecificCoupon(code)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                        appliedCouponCode === code
                          ? 'bg-emerald-500 text-neutral-950 shadow-md'
                          : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-700'
                      }`}
                    >
                      <Tag className="w-3 h-3" />
                      <span>{code}</span>
                      {appliedCouponCode === code && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Promo input field */}
              <form onSubmit={applyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter coupon code"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 uppercase font-mono"
                  />
                </div>
                {appliedCouponCode ? (
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="px-3 py-2 text-xs font-bold rounded-xl bg-rose-950/50 hover:bg-rose-900 text-rose-400 border border-rose-800 transition cursor-pointer"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-3 py-2 text-xs font-bold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition cursor-pointer"
                  >
                    Apply
                  </button>
                )}
              </form>

              {appliedCouponCode && (
                <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-400 font-bold flex items-center justify-between">
                  <span>✓ {appliedCouponCode} applied: {discountPercent}% Instant Savings!</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-neutral-400 pt-2 border-t border-neutral-800/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-neutral-200 font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-neutral-200 font-semibold">
                    {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="text-neutral-200 font-semibold">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-neutral-800">
                  <span>Total Amount</span>
                  <span className="text-emerald-400 text-base">{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                onClick={() => onCheckout({ items, subtotal, discount: discountAmount, couponCode: appliedCouponCode, shipping, tax, total })}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 transition duration-200 shadow-xl shadow-emerald-500/20 active:scale-[0.98] cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit Encrypted Secure Indian Checkout</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
