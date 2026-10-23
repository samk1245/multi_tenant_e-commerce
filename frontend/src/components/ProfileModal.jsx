import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Package,
  MapPin,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  ChevronRight,
  Copy,
  Check,
  ArrowRight,
  Printer,
  Plus,
  Edit2,
  Trash2,
  Phone,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { api } from '../api';
import { addressManager } from '../utils/addressManager';
import InvoiceModal from './InvoiceModal';

export default function ProfileModal({ isOpen, onClose, onApplyCoupon, tenant }) {
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

  // Addresses State
  const [addresses, setAddresses] = useState([]);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressData, setEditingAddressData] = useState({
    id: null,
    label: 'Home',
    name: 'Rahul Verma',
    phone: '+91 91234 56789',
    street: '',
    landmark: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400050',
    isDefault: false,
  });

  // Invoice view state
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  const coupons = [
    { code: 'FESTIVE20', discount: '20% OFF', description: 'Flat 20% off on orders above ₹2,499', expires: 'Ends in 3 days' },
    { code: 'VIP15', discount: '15% OFF', description: 'Exclusive 15% VIP discount for registered members', expires: 'Valid all month' },
    { code: 'DROP10', discount: '10% OFF', description: 'Special 10% instant discount on latest fashion drops', expires: 'No min spend' },
  ];

  useEffect(() => {
    if (!isOpen) return;

    async function loadData() {
      setLoadingOrders(true);
      try {
        const [orderList, addressList] = await Promise.all([
          api.getUserOrders(currentUser.email),
          addressManager.getAddresses(currentUser.email),
        ]);
        setOrders(orderList);
        if (orderList.length > 0) {
          setSelectedOrder(orderList[0]);
        }
        setAddresses(addressList);
      } catch (err) {
        console.error("Failed to load user profile data:", err);
      } finally {
        setLoadingOrders(false);
      }
    }

    loadData();
  }, [isOpen, currentUser.email]);

  if (!isOpen) return null;

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    if (onApplyCoupon) onApplyCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  // Address Handlers
  const handleStartAddAddress = () => {
    setEditingAddressData({
      id: null,
      label: 'Home',
      name: currentUser.name,
      phone: currentUser.phone,
      street: '',
      landmark: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400050',
      isDefault: addresses.length === 0,
    });
    setIsEditingAddress(true);
  };

  const handleStartEditAddress = (addr) => {
    setEditingAddressData({
      id: addr.id || addr._id,
      label: addr.label || 'Home',
      name: addr.name || currentUser.name,
      phone: addr.phone || currentUser.phone,
      street: addr.street || '',
      landmark: addr.landmark || '',
      city: addr.city || 'Mumbai',
      state: addr.state || 'Maharashtra',
      zip: addr.zip || '400050',
      isDefault: !!addr.isDefault,
    });
    setIsEditingAddress(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!editingAddressData.street || !editingAddressData.city || !editingAddressData.zip) {
      alert('Please fill out street, city, and PIN code.');
      return;
    }

    let updated;
    if (editingAddressData.id) {
      updated = await addressManager.updateAddress(currentUser.email, editingAddressData.id, editingAddressData);
    } else {
      updated = await addressManager.addAddress(currentUser.email, editingAddressData);
    }

    setAddresses(updated);
    setIsEditingAddress(false);
  };

  const handleDeleteAddress = async (id) => {
    if (addresses.length <= 1) {
      alert('You need at least one saved delivery address.');
      return;
    }
    const updated = await addressManager.deleteAddress(currentUser.email, id);
    setAddresses(updated);
  };

  const handleSetDefaultAddress = async (id) => {
    const updated = await addressManager.setDefault(currentUser.email, id);
    setAddresses(updated);
  };

  return (
    <>
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
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Account
                  </span>
                  <span className="text-neutral-500">&bull;</span>
                  <span className="text-amber-300 font-bold">
                    {currentUser.rewardPoints} OmniCoins Earned
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 bg-neutral-950/80 p-1.5 rounded-2xl border border-neutral-800/80">
              <button
                onClick={() => {
                  setActiveTab('orders');
                  setIsEditingAddress(false);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-emerald-500 text-neutral-950 shadow-md font-extrabold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('addresses');
                  setIsEditingAddress(false);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-emerald-500 text-neutral-950 shadow-md font-extrabold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Addresses ({addresses.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('rewards');
                  setIsEditingAddress(false);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'rewards'
                    ? 'bg-emerald-500 text-neutral-950 shadow-md font-extrabold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>Offers ({coupons.length})</span>
              </button>
            </div>
          </div>

          {/* Modal Tab Content */}
          <div className="p-6 md:p-8 overflow-y-auto flex-1">
            
            {/* TAB 1: ORDERS & LIVE TRACKING */}
            {activeTab === 'orders' && (
              <div>
                {loadingOrders ? (
                  <div className="text-center py-12 text-sm text-neutral-400">
                    Loading your purchase history...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Package className="w-12 h-12 text-neutral-600 mx-auto" />
                    <h4 className="text-base font-bold text-white">No Orders Found</h4>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                      You haven't placed any orders yet. Browse our curated store collections and discover exclusive drops!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Orders List */}
                    <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                        Past Purchases ({orders.length})
                      </span>
                      {orders.map((o) => (
                        <div
                          key={o._id}
                          onClick={() => setSelectedOrder(o)}
                          className={`p-4 rounded-2xl border transition cursor-pointer ${
                            selectedOrder?._id === o._id
                              ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                              : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono text-xs font-bold text-emerald-400">
                              #{o.orderNumber}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-800 text-neutral-300">
                              {o.orderStatus}
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
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
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

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setInvoiceOrder(selectedOrder)}
                              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                              title="Print official tax invoice"
                            >
                              <Printer className="w-3.5 h-3.5 text-emerald-400" />
                              <span>View Invoice</span>
                            </button>

                            <div className="text-right">
                              <span className="text-[10px] text-neutral-400 block uppercase">Total Invoiced</span>
                              <span className="text-lg font-black text-white font-mono">
                                {formatCurrency(selectedOrder.totalAmount)}
                              </span>
                            </div>
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
                                <div className="font-bold text-white font-mono">
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
                            <span className="uppercase text-emerald-400 font-semibold">
                              {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment (Verified)'}
                            </span>
                          </div>
                          <div>
                            <span className="font-bold text-white block">Deliver to:</span>
                            <span>{selectedOrder.customer?.address?.city || selectedOrder.customer?.city || 'Mumbai'}, {selectedOrder.customer?.address?.state || selectedOrder.customer?.state || 'Maharashtra'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ADDRESSES MANAGEMENT */}
            {activeTab === 'addresses' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white">Saved Delivery Addresses</h4>
                    <p className="text-xs text-neutral-400">
                      Manage your personal shipping destinations for faster 1-click checkout.
                    </p>
                  </div>

                  {!isEditingAddress && (
                    <button
                      onClick={handleStartAddAddress}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Address</span>
                    </button>
                  )}
                </div>

                {isEditingAddress ? (
                  /* Address Add / Edit Form */
                  <form onSubmit={handleSaveAddress} className="p-5 rounded-2xl bg-neutral-950 border border-emerald-500/40 space-y-4 max-w-2xl mx-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                      <h5 className="text-sm font-bold text-white">
                        {editingAddressData.id ? 'Edit Delivery Address' : 'Add New Address'}
                      </h5>
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(false)}
                        className="text-xs text-neutral-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                          Address Tag / Label
                        </label>
                        <select
                          value={editingAddressData.label}
                          onChange={(e) =>
                            setEditingAddressData({ ...editingAddressData, label: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value="Home">Home</option>
                          <option value="Office">Office / Workplace</option>
                          <option value="Parents">Parents / Family</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                          Recipient Name
                        </label>
                        <input
                          type="text"
                          required
                          value={editingAddressData.name}
                          onChange={(e) =>
                            setEditingAddressData({ ...editingAddressData, name: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                          10-Digit Mobile Phone
                        </label>
                        <input
                          type="tel"
                          required
                          value={editingAddressData.phone}
                          onChange={(e) =>
                            setEditingAddressData({ ...editingAddressData, phone: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          required
                          value={editingAddressData.zip}
                          onChange={(e) =>
                            setEditingAddressData({ ...editingAddressData, zip: e.target.value })
                          }
                          placeholder="e.g. 400050"
                          className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                        Flat, Building Name, Street
                      </label>
                      <input
                        type="text"
                        required
                        value={editingAddressData.street}
                        onChange={(e) =>
                          setEditingAddressData({ ...editingAddressData, street: e.target.value })
                        }
                        placeholder="House No, Apartment, Street name"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                          Landmark (Optional)
                        </label>
                        <input
                          type="text"
                          value={editingAddressData.landmark}
                          onChange={(e) =>
                            setEditingAddressData({ ...editingAddressData, landmark: e.target.value })
                          }
                          placeholder="Near Metro..."
                          className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          required
                          value={editingAddressData.city}
                          onChange={(e) =>
                            setEditingAddressData({ ...editingAddressData, city: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          required
                          value={editingAddressData.state}
                          onChange={(e) =>
                            setEditingAddressData({ ...editingAddressData, state: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                        <input
                          type="checkbox"
                          checked={editingAddressData.isDefault}
                          onChange={(e) =>
                            setEditingAddressData({
                              ...editingAddressData,
                              isDefault: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400"
                        />
                        <span>Set as default shipping address</span>
                      </label>

                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition shadow-md"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id || addr._id}
                        className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800 hover:border-neutral-700 transition space-y-3 relative flex flex-col justify-between"
                      >
                        <div>
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

                          <div className="text-xs text-neutral-300 font-semibold mt-1">
                            {addr.name} &bull; {addr.phone}
                          </div>

                          <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                            {addr.street}{addr.landmark ? `, Near ${addr.landmark}` : ''}<br />
                            {addr.city}, {addr.state} - <span className="font-mono text-neutral-300">{addr.zip}</span>
                          </p>
                        </div>

                        <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id || addr._id)}
                            className={`text-xs font-semibold cursor-pointer ${
                              addr.isDefault ? 'text-emerald-400' : 'text-neutral-400 hover:text-white'
                            }`}
                          >
                            {addr.isDefault ? '✓ Default Address' : 'Set as Default'}
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEditAddress(addr)}
                              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
                              title="Edit address"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Edit</span>
                            </button>

                            <button
                              onClick={() => handleDeleteAddress(addr.id || addr._id)}
                              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 transition cursor-pointer"
                              title="Delete address"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition flex items-center gap-1 active:scale-95 cursor-pointer"
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

      {/* Tax Invoice Modal */}
      <InvoiceModal
        isOpen={!!invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
        order={invoiceOrder}
        tenant={tenant}
      />
    </>
  );
}
