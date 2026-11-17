import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Flame,
  Check,
  Sparkles,
  Share2,
  Copy,
  ShoppingCart,
} from 'lucide-react';
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
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingThreshold = 999;
  const shipping = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 99;
  const tax = Math.round((subtotal - discountAmount) * 0.05); // 5% GST
  const total = Math.max(0, subtotal - discountAmount + shipping + tax);

  const handleCopySummary = () => {
    const lines = items
      .map((i) => `• ${i.title} x ${i.quantity} = ${formatCurrency(i.price * i.quantity)}`)
      .join('\n');
    const summaryText = `🛒 ShopSphere Multi-Tenant Cart Summary:\n${lines}\n\nSubtotal: ${formatCurrency(
      subtotal
    )}\nEstimated Total: ${formatCurrency(total)}\nShop at: ${window.location.origin}`;
    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

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
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0a0c18] border-l border-white/10 flex flex-col shadow-2xl backdrop-blur-2xl">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#050508]/80">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-black text-white">Your Shopping Cart</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40">
                {items.reduce((c, i) => c + i.quantity, 0)} items
              </span>
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={handleCopySummary}
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-cyan-400 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  title="Share or copy cart summary"
                >
                  {copiedSummary ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-cyan-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Shipping Progress */}
          <div className="px-6 py-3 bg-[#050508]/90 border-b border-white/10 text-xs">
            {subtotal >= shippingThreshold ? (
              <p className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Congratulations! You unlocked FREE Express Delivery!</span>
              </p>
            ) : (
              <div>
                <p className="text-neutral-400 mb-1.5">
                  Add{' '}
                  <span className="text-white font-bold">
                    {formatCurrency(shippingThreshold - subtotal)}
                  </span>{' '}
                  more for <span className="text-cyan-400 font-bold">FREE Delivery</span>
                </p>
                <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(139,92,246,0.8)]"
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
                  className="flex gap-4 p-3.5 rounded-2xl bg-[#050508]/80 border border-white/10 hover:border-purple-500/30 transition"
                >
                  <img
                    src={item.thumbnail || item.images?.[0]}
                    alt={item.title}
                    className="w-18 h-18 object-cover rounded-xl bg-neutral-950 flex-shrink-0 border border-white/5"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                    <p className="text-xs text-cyan-400 font-mono font-black mt-0.5">
                      {formatCurrency(item.price)}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 border border-white/10 bg-neutral-900 rounded-xl p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                          className="p-1 hover:text-white text-neutral-400 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1.5 font-mono">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                          className="p-1 hover:text-white text-neutral-400 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item._id)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
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
            <div className="p-6 border-t border-white/10 bg-[#050508]/95 space-y-3">
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
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                          : 'bg-white/5 text-neutral-300 hover:text-white border border-white/10'
                      }`}
                    >
                      <Tag className="w-3 h-3 text-cyan-400" />
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
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 uppercase font-mono"
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
                    className="px-3 py-2 text-xs font-bold rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 border border-white/10 transition cursor-pointer"
                  >
                    Apply
                  </button>
                )}
              </form>

              {appliedCouponCode && (
                <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-[11px] text-cyan-400 font-bold flex items-center justify-between">
                  <span>✓ {appliedCouponCode} applied: {discountPercent}% Instant Savings!</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-neutral-400 pt-2 border-t border-white/10">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-neutral-200 font-semibold font-mono">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-cyan-400 font-bold font-mono">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-neutral-200 font-semibold font-mono">
                    {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="text-neutral-200 font-semibold font-mono">
                    {formatCurrency(tax)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-white/10">
                  <span>Total Amount</span>
                  <span className="text-cyan-400 text-base font-mono">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  onCheckout({
                    items,
                    subtotal,
                    discount: discountAmount,
                    couponCode: appliedCouponCode,
                    shipping,
                    tax,
                    total,
                  })
                }
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black text-sm flex items-center justify-center gap-2 transition duration-200 shadow-xl shadow-purple-600/30 active:scale-[0.98] cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>256-Bit Encrypted Secure Indian Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
