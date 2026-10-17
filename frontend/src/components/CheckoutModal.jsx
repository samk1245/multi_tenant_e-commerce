import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartData,
  onPlaceOrder,
  orderSuccess,
}) {
  const [formData, setFormData] = useState({
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone: '+91 98765 43210',
    street: 'Flat 402, Sea View Apartments, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400050',
    paymentMethod: 'upi', // 'upi' | 'card' | 'cod'
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onPlaceOrder(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 sm:p-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {orderSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white">Order Confirmed!</h3>
            <p className="text-sm text-neutral-400 mt-2">
              Thank you for your order! Your order has been placed successfully in the tenant store database.
            </p>

            <div className="mt-6 p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Order Number:</span>
                <span className="font-mono font-bold text-emerald-400">{orderSuccess.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Total Paid / Payable:</span>
                <span className="font-bold text-white">{formatCurrency(orderSuccess.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Payment Option:</span>
                <span className="font-bold text-emerald-400 uppercase">
                  {formData.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment (Verified)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Customer:</span>
                <span className="text-neutral-200">{orderSuccess.customer?.name} ({orderSuccess.customer?.email})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Fulfillment Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase text-[10px]">
                  {orderSuccess.orderStatus}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-black text-white">Complete Your Order</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Enter your delivery address and choose your preferred payment method.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Delivery Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-neutral-300 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center gap-1 transition ${
                      formData.paymentMethod === 'upi'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="text-[11px] font-bold">UPI / GPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center gap-1 transition ${
                      formData.paymentMethod === 'card'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[11px] font-bold">Cards / NetBank</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center gap-1 transition ${
                      formData.paymentMethod === 'cod'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span className="text-[11px] font-bold">Cash On Delivery</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400">Total to charge:</span>
                  <div className="text-xl font-black text-emerald-400">
                    {formatCurrency(cartData?.total || 0)}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-bold text-sm transition"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
