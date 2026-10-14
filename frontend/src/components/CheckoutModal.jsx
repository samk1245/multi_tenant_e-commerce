import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle,
  ShieldCheck,
  CreditCard,
  Banknote,
  QrCode,
  Truck,
  MapPin,
  Lock,
} from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartData,
  onPlaceOrder,
  orderSuccess,
  currentUser,
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    paymentMethod: 'online', // 'online' | 'cod' | 'upi'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const defaultAddr = currentUser.addresses?.[0] || {};
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        street: defaultAddr.street || prev.street || '42 M.G. Road',
        city: defaultAddr.city || prev.city || 'Bengaluru',
        state: defaultAddr.state || prev.state || 'Karnataka',
        zip: defaultAddr.zip || prev.zip || '560001',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || 'Rahul Verma',
        email: prev.email || 'customer@example.com',
        phone: prev.phone || '+91 98765 43210',
        street: prev.street || 'Flat 102, Shanti Vihar, Andheri East',
        city: prev.city || 'Mumbai',
        state: prev.state || 'Maharashtra',
        zip: prev.zip || '400069',
      }));
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onPlaceOrder(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 sm:p-8">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {orderSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white">Order Placed Successfully!</h3>
            <p className="text-xs text-neutral-400 mt-2">
              Your order has been confirmed and scheduled with our carrier logistics.
            </p>

            <div className="mt-6 p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-left space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Order ID:</span>
                <span className="font-mono font-bold text-emerald-400">{orderSuccess.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Amount to Pay / Paid:</span>
                <span className="font-bold text-white">₹{orderSuccess.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Payment Option:</span>
                <span className="font-bold uppercase text-emerald-400">
                  {orderSuccess.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Paid (UPI/Card)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Deliver To:</span>
                <span className="text-neutral-200 font-medium">
                  {orderSuccess.customer?.name}, {orderSuccess.customer?.address?.city} ({orderSuccess.customer?.address?.zip})
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-sm transition shadow-lg active:scale-[0.98]"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                Express Unified Checkout
              </span>
              <h3 className="text-2xl font-black text-white mt-0.5">Shipping & Payment Details</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Prices calculated in Indian Rupees (₹ INR) with free delivery on orders above ₹999.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Customer Contact */}
              <div className="space-y-3">
                <h4 className="font-black text-neutral-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1. Delivery Address</span>
                </h4>

                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Street / House Address</label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1">PIN Code</label>
                    <input
                      type="text"
                      required
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-3 border-t border-neutral-800">
                <h4 className="font-black text-neutral-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2. Select Payment Method</span>
                </h4>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* Online / Card */}
                  <label
                    className={`p-3 rounded-2xl border cursor-pointer flex flex-col items-center justify-center text-center transition ${
                      formData.paymentMethod === 'online'
                        ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === 'online'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="sr-only"
                    />
                    <CreditCard className="w-5 h-5 mb-1.5 text-emerald-400" />
                    <span>Card / NetBanking</span>
                    <span className="text-[10px] text-neutral-500 mt-0.5">Instant Discount</span>
                  </label>

                  {/* UPI */}
                  <label
                    className={`p-3 rounded-2xl border cursor-pointer flex flex-col items-center justify-center text-center transition ${
                      formData.paymentMethod === 'upi'
                        ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="sr-only"
                    />
                    <QrCode className="w-5 h-5 mb-1.5 text-indigo-400" />
                    <span>UPI / QR</span>
                    <span className="text-[10px] text-neutral-500 mt-0.5">GPay, PhonePe, Paytm</span>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`p-3 rounded-2xl border cursor-pointer flex flex-col items-center justify-center text-center transition ${
                      formData.paymentMethod === 'cod'
                        ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="sr-only"
                    />
                    <Banknote className="w-5 h-5 mb-1.5 text-amber-400" />
                    <span>Cash on Delivery</span>
                    <span className="text-[10px] text-neutral-500 mt-0.5">Pay at Doorstep</span>
                  </label>
                </div>
              </div>

              {/* Total & Submit Button */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-neutral-400 text-xs">Total Payable:</span>
                  <div className="text-2xl font-black text-emerald-400">
                    ₹{cartData?.total ? Math.round(cartData.total).toLocaleString('en-IN') : '0'}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-black text-sm shadow-xl transition active:scale-[0.98]"
                >
                  {loading ? 'Confirming Order...' : formData.paymentMethod === 'cod' ? 'Place COD Order' : 'Pay & Confirm'}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 pt-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>PCI-DSS Compliant 256-Bit SSL Payment Security</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
