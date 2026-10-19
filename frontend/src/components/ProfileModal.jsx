import React, { useState, useEffect } from 'react';
import { X, User, Package, MapPin, Tag, ShieldCheck, CheckCircle2, Clock, Truck, ChevronRight, Copy, Check, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { api } from '../api';

export default function ProfileModal({ isOpen, onClose, onApplyCoupon }) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'rewards'
  const [currentUser, setCurrentUser] = useState({
    name: 'Rahul Verma',
    email: 'customer@example.com',
    phone: '+91 91234 56789',
    memberTier: 'Gold VIP Member',
    rewardPoints: 1450,
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [copiedCoupon, setCopiedCoupon] = useState(null);

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Home',
      street: 'Flat 402, Sea View Apartments, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400050',
      isDefault: true,
    },
    {
      id: 2,
      label: 'Office',
      street: '12/A Green Glen Layout, Outer Ring Road, Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      zip: '560103',
      isDefault: false,
    },
  ]);

  const coupons = [
    { code: 'FESTIVE20', discount: '20% OFF', description: 'Flat 20% off on orders above ₹2,499', expires: 'Ends in 3 days' },
    { code: 'VIP15', discount: '15% OFF', description: 'Exclusive 15% VIP discount for registered members', expires: 'Valid all month' },
    { code: 'DROP10', discount: '10% OFF', description: 'Special 10% instant discount on latest fashion drops', expires: 'No min spend' },
  ];

  useEffect(() => {
    if (!isOpen) return;
    async function fetchOrders() {
      setLoadingOrders(true);
      try {
        const orderList = await api.getUserOrders(currentUser.email);
        setOrders(orderList);
        if (orderList.length > 0) {
          setSelectedOrder(orderList[0]);
        }
      } catch (err) {
        console.error("Failed to load user orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    }
    fetchOrders();
  }, [isOpen, currentUser.email]);

  if (!isOpen) return null;

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    if (onApplyCoupon) onApplyCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Header / Profile Banner */}
        <div className="relative bg-gradient-to-r from-neutral-950 via-emerald-950/40 to-neutral-950 p-6 md:p-8 border-b border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl font-black text-neutral-950 shadow-xl shadow-emerald-500/20">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">{currentUser.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {currentUser.memberTier}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                {currentUser.email} &bull; {currentUser.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:text-right">
            <div className="bg-neutral-900/90 border border-neutral-800 px-4 py-2 rounded-xl">
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold block">
                Reward Balance
              </span>
              <span className="text-lg font-black text-emerald-400">
                {currentUser.rewardPoints} Pts
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/90 px-6 pt-3">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'addresses'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'rewards'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Discount Coupons ({coupons.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div>
              {loadingOrders ? (
                <div className="text-center py-12 text-neutral-400">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs">Loading order history...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 bg-neutral-950/40 rounded-2xl border border-neutral-800">
                  <Package className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-white">No Orders Yet</h4>
                  <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                    You haven't placed any orders yet. Explore our multi-tenant catalog and enjoy express shipping!
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Orders List */}
                  <div className="lg:col-span-1 space-y-3 max-h-[460px] overflow-y-auto pr-1">
                    {orders.map((o) => (
                      <div
                        key={o._id}
                        onClick={() => setSelectedOrder(o)}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition ${
                          selectedOrder?._id === o._id
                            ? 'bg-neutral-800/90 border-emerald-500/60 shadow-lg'
                            : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-mono font-bold text-emerald-400">{o.orderNumber}</span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                            {o.orderStatus || 'processing'}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-white">
                          {formatCurrency(o.totalAmount)}
                        </div>
                        <div className="text-[11px] text-neutral-400 flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/80">
                          <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                          <span>{o.items?.length || 1} Item(s)</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right: Selected Order Detail & Live Timeline */}
                  {selectedOrder && (
                    <div className="lg:col-span-2 p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-black text-white">Order Details</h4>
                            <span className="font-mono text-xs text-emerald-400 font-bold">
                              #{selectedOrder.orderNumber}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-neutral-400 block">Total Invoiced</span>
                          <span className="text-lg font-black text-white">
                            {formatCurrency(selectedOrder.totalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Shipment Tracking Timeline */}
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Delivery Timeline & Tracking</span>
                        </h5>

                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                            <CheckCircle2 className="w-4 h-4 mx-auto mb-1" />
                            <span className="font-bold text-[11px] block">Order Placed</span>
                            <span className="text-[10px] text-neutral-400">Verified</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                            <Package className="w-4 h-4 mx-auto mb-1" />
                            <span className="font-bold text-[11px] block">Packed</span>
                            <span className="text-[10px] text-neutral-400">Warehouse</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300">
                            <Truck className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                            <span className="font-bold text-[11px] block">Dispatched</span>
                            <span className="text-[10px] text-neutral-500">In Transit</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-500">
                            <Clock className="w-4 h-4 mx-auto mb-1" />
                            <span className="font-bold text-[11px] block">Delivery</span>
                            <span className="text-[10px] text-neutral-500">Est. 2-3 Days</span>
                          </div>
                        </div>

                        {selectedOrder.shippingDetails?.trackingNumber && (
                          <div className="mt-3 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs flex items-center justify-between">
                            <span className="text-neutral-400">AWB Tracking Number:</span>
                            <span className="font-mono font-bold text-white">
                              {selectedOrder.shippingDetails.trackingNumber}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Purchased Items List */}
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                          Ordered Items ({selectedOrder.items?.length || 0})
                        </h5>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {selectedOrder.items?.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900 border border-neutral-800/80 text-xs"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.thumbnail || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80'}
                                  alt={item.title}
                                  className="w-10 h-10 object-cover rounded-lg bg-neutral-950"
                                />
                                <div>
                                  <div className="font-bold text-white">{item.title}</div>
                                  <div className="text-[11px] text-neutral-400">Qty: {item.quantity}</div>
                                </div>
                              </div>
                              <div className="font-bold text-white">
                                {formatCurrency(item.price * item.quantity)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment & Shipping Summary */}
                      <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-neutral-800 text-neutral-400">
                        <div>
                          <span className="font-bold text-white block">Payment Method:</span>
                          <span className="uppercase text-emerald-400">
                            {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment (Verified)'}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold text-white block">Deliver to:</span>
                          <span>{selectedOrder.customer?.city || 'Mumbai'}, {selectedOrder.customer?.state || 'Maharashtra'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">Saved Delivery Addresses</h4>
                  <p className="text-xs text-neutral-400">Manage your shipping destinations for faster 1-click checkout.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800 hover:border-neutral-700 transition space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {addr.street}<br />
                      {addr.city}, {addr.state} - <span className="font-mono">{addr.zip}</span>
                    </p>
                    <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === addr.id })));
                        }}
                        className={`text-xs font-semibold ${addr.isDefault ? 'text-emerald-400' : 'text-neutral-400 hover:text-white'}`}
                      >
                        {addr.isDefault ? '✓ Default Address' : 'Set as Default'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REWARDS & COUPONS */}
          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-white">Active Discount Codes & Offers</h4>
                <p className="text-xs text-neutral-400">Click any coupon below to copy and apply directly to your cart checkout.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    className="p-5 rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 border border-emerald-500/30 shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-black text-white">{c.discount}</span>
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/10">
                          {c.expires}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                        {c.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-emerald-400">{c.code}</span>
                      <button
                        onClick={() => handleCopy(c.code)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition flex items-center gap-1 active:scale-95"
                      >
                        {copiedCoupon === c.code ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Applied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Apply</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
