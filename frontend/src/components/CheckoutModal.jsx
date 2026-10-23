import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle,
  ShieldCheck,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  CalendarClock,
  Coins,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Check,
  Copy,
  Printer,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Info,
  Clock,
  Truck,
  Package,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { addressManager } from '../utils/addressManager';
import InvoiceModal from './InvoiceModal';

const POPULAR_BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC', color: 'bg-blue-600' },
  { id: 'sbi', name: 'State Bank of India', code: 'SBI', color: 'bg-sky-700' },
  { id: 'icici', name: 'ICICI Bank', code: 'ICICI', color: 'bg-amber-600' },
  { id: 'axis', name: 'Axis Bank', code: 'AXIS', color: 'bg-rose-700' },
  { id: 'kotak', name: 'Kotak Mahindra', code: 'KOTAK', color: 'bg-red-600' },
  { id: 'pnb', name: 'Punjab National Bank', code: 'PNB', color: 'bg-yellow-700' },
];

const OTHER_BANKS = [
  'Bank of Baroda',
  'Canara Bank',
  'Union Bank of India',
  'IndusInd Bank',
  'IDFC FIRST Bank',
  'Federal Bank',
  'Yes Bank',
  'Punjab & Sind Bank',
  'Indian Bank',
  'Central Bank of India',
  'RBL Bank',
  'Bandhan Bank',
];

export default function CheckoutModal({
  isOpen,
  onClose,
  cartData,
  onPlaceOrder,
  orderSuccess,
  tenant,
}) {
  // Address States
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
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

  // Payment Method States
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod' | 'emi'
  const [upiTimer, setUpiTimer] = useState(600); // 10 minutes in seconds
  const [upiIdInput, setUpiIdInput] = useState('');
  const [upiVerified, setUpiVerified] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Card Form State
  const [cardData, setCardData] = useState({
    number: '',
    holder: 'Rahul Verma',
    expiry: '',
    cvv: '',
    saveCard: true,
  });

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState('hdfc');

  // COD Anti-spam Captcha State
  const [captchaCode, setCaptchaCode] = useState('8492');
  const [captchaInput, setCaptchaInput] = useState('');

  // EMI State
  const [selectedEmiTenure, setSelectedEmiTenure] = useState(3);

  // Wallet / OmniCoins Discount State
  const [redeemOmniCoins, setRedeemOmniCoins] = useState(false);
  const OMNICOINS_DISCOUNT = 500;

  // Invoice Modal State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Load addresses on open
  useEffect(() => {
    if (!isOpen) return;
    async function load() {
      const list = await addressManager.getAddresses();
      setAddresses(list);
      const def = list.find((a) => a.isDefault) || list[0];
      if (def) setSelectedAddressId(def.id || def._id);
    }
    load();
    generateNewCaptcha();
  }, [isOpen]);

  // UPI Countdown Timer
  useEffect(() => {
    if (!isOpen || paymentMethod !== 'upi') return;
    const interval = setInterval(() => {
      setUpiTimer((prev) => (prev > 0 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, paymentMethod]);

  if (!isOpen) return null;

  const generateNewCaptcha = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Card formatting helpers
  const handleCardNumberChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardData({ ...cardData, number: formatted });
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setCardData({ ...cardData, expiry: raw });
  };

  // Detect card brand
  const getCardBrand = (num) => {
    const cleaned = num.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(cleaned)) return 'Mastercard';
    if (/^(60|65|81|82)/.test(cleaned)) return 'RuPay';
    if (/^3[47]/.test(cleaned)) return 'Amex';
    return 'Card';
  };

  // Address CRUD
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!editingAddressData.street || !editingAddressData.city || !editingAddressData.zip) {
      alert('Please fill in street, city, and PIN code.');
      return;
    }

    let updatedList;
    if (editingAddressData.id) {
      updatedList = await addressManager.updateAddress(
        'customer@example.com',
        editingAddressData.id,
        editingAddressData
      );
    } else {
      updatedList = await addressManager.addAddress('customer@example.com', editingAddressData);
    }

    setAddresses(updatedList);
    const active = updatedList.find((a) => a.isDefault) || updatedList[0];
    if (active) setSelectedAddressId(active.id || active._id);
    setIsEditingAddress(false);
  };

  const handleStartAddAddress = () => {
    setEditingAddressData({
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
    setIsEditingAddress(true);
  };

  const handleStartEditAddress = (addr) => {
    setEditingAddressData({
      id: addr.id || addr._id,
      label: addr.label || 'Home',
      name: addr.name || 'Rahul Verma',
      phone: addr.phone || '+91 91234 56789',
      street: addr.street || '',
      landmark: addr.landmark || '',
      city: addr.city || 'Mumbai',
      state: addr.state || 'Maharashtra',
      zip: addr.zip || '400050',
      isDefault: !!addr.isDefault,
    });
    setIsEditingAddress(true);
  };

  const handleDeleteAddress = async (id, e) => {
    e.stopPropagation();
    if (addresses.length <= 1) {
      alert('You need at least one saved delivery address.');
      return;
    }
    const updated = await addressManager.deleteAddress('customer@example.com', id);
    setAddresses(updated);
    if (selectedAddressId === id) {
      setSelectedAddressId(updated[0]?.id || updated[0]?._id);
    }
  };

  // Financial Calculations
  const rawSubtotal = cartData?.subtotal || 0;
  const initialDiscount = cartData?.discount || 0;
  const loyaltyDiscount = redeemOmniCoins ? Math.min(OMNICOINS_DISCOUNT, rawSubtotal) : 0;
  const effectiveDiscount = initialDiscount + loyaltyDiscount;
  const shipping = cartData?.shipping || 0;
  const tax = cartData?.tax || 0;
  const finalPayable = Math.max(0, rawSubtotal - effectiveDiscount + shipping + tax);

  // Selected address object
  const activeAddress = addresses.find((a) => (a.id || a._id) === selectedAddressId) || addresses[0];

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!activeAddress) {
      alert('Please add or select a delivery address.');
      return;
    }

    if (paymentMethod === 'cod') {
      if (captchaInput.trim() !== captchaCode.trim()) {
        alert('Security verification code does not match. Please enter the 4 digits shown.');
        generateNewCaptcha();
        return;
      }
    }

    if (paymentMethod === 'card') {
      if (!cardData.number || cardData.number.replace(/\s/g, '').length < 15) {
        alert('Please enter a valid 16-digit card number.');
        return;
      }
    }

    setLoading(true);

    const payload = {
      name: activeAddress.name || 'Rahul Verma',
      email: 'customer@example.com',
      phone: activeAddress.phone || '+91 91234 56789',
      address: {
        label: activeAddress.label,
        street: activeAddress.street + (activeAddress.landmark ? `, Near ${activeAddress.landmark}` : ''),
        city: activeAddress.city,
        state: activeAddress.state,
        zip: activeAddress.zip,
        country: activeAddress.country || 'India',
      },
      paymentMethod,
      paymentDetails: {
        provider:
          paymentMethod === 'upi'
            ? 'UPI_AUTOPAY'
            : paymentMethod === 'card'
            ? `${getCardBrand(cardData.number)}_GATEWAY`
            : paymentMethod === 'netbanking'
            ? `NETBANK_${selectedBank.toUpperCase()}`
            : paymentMethod === 'emi'
            ? `EMI_${selectedEmiTenure}M`
            : 'CASH_ON_DELIVERY',
        transactionId: `TXN-${Date.now().toString().slice(-8)}`,
      },
      appliedOmniCoins: redeemOmniCoins ? OMNICOINS_DISCOUNT : 0,
    };

    await onPlaceOrder(payload);
    setLoading(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <div className="relative w-full max-w-2xl max-h-[92vh] rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden text-neutral-100">
          
          {/* Header */}
          <div className="relative bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 p-5 px-6 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  {orderSuccess ? 'Order Confirmed!' : 'Secure 256-Bit Checkout'}
                </h3>
                <p className="text-xs text-neutral-400">
                  {orderSuccess
                    ? 'Receipt & tracking reference issued'
                    : 'Choose your delivery destination & payment option'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
            {orderSuccess ? (
              /* ORDER SUCCESS VIEW */
              <div className="text-center py-4 space-y-5">
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/20 animate-bounce">
                  <CheckCircle className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">Payment & Order Placed!</h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
                    Your order has been recorded into the store database. A confirmation SMS & email have been dispatched with live dispatch tracking.
                  </p>
                </div>

                {/* Order Summary Pill */}
                <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-left space-y-2.5 text-xs max-w-lg mx-auto">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                    <span className="text-neutral-400">Order Reference ID:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {orderSuccess.orderNumber}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Total Charged:</span>
                    <span className="font-mono font-black text-white text-base">
                      {formatCurrency(orderSuccess.totalAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Payment Status:</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase text-[10px] border border-emerald-500/30">
                      {orderSuccess.paymentMethod === 'cod' ? 'COD (Pay on Delivery)' : 'Paid Online (Verified)'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Delivery Address:</span>
                    <span className="text-neutral-200 truncate max-w-[260px]">
                      {orderSuccess.customer?.address?.street || orderSuccess.customer?.street}, {orderSuccess.customer?.address?.city || orderSuccess.customer?.city}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Estimated Delivery:</span>
                    <span className="text-neutral-300 font-semibold">
                      {orderSuccess.shippingDetails?.estimatedDelivery || '2-4 Business Days'}
                    </span>
                  </div>
                </div>

                {/* Delivery Timeline Preview */}
                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 text-left max-w-lg mx-auto">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Live Tracking Timeline</span>
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                    <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                      ✓ Confirmed
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      Packed
                    </div>
                    <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-500">
                      In Transit
                    </div>
                    <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-500">
                      Delivered
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-lg mx-auto">
                  <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="w-full sm:w-1/2 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Printer className="w-4 h-4 text-emerald-400" />
                    <span>Print Tax Invoice</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full sm:w-1/2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : (
              /* CHECKOUT STEP FORM */
              <form onSubmit={handleSubmitOrder} className="space-y-6">
                
                {/* SECTION 1: DELIVERY ADDRESS SELECTION & EDITING */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 text-xs font-black flex items-center justify-center">
                        1
                      </span>
                      <h4 className="text-sm font-black text-white">Delivery Address</h4>
                    </div>

                    {!isEditingAddress && (
                      <button
                        type="button"
                        onClick={handleStartAddAddress}
                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New Address</span>
                      </button>
                    )}
                  </div>

                  {isEditingAddress ? (
                    /* Inline Address Editor Form */
                    <div className="p-4 rounded-2xl bg-neutral-950 border border-emerald-500/40 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                        <span className="text-xs font-bold text-white">
                          {editingAddressData.id ? 'Edit Delivery Address' : 'Add New Address'}
                        </span>
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
                            Address Label
                          </label>
                          <select
                            value={editingAddressData.label}
                            onChange={(e) =>
                              setEditingAddressData({ ...editingAddressData, label: e.target.value })
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                          className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                            Landmark (Opt)
                          </label>
                          <input
                            type="text"
                            value={editingAddressData.landmark}
                            onChange={(e) =>
                              setEditingAddressData({ ...editingAddressData, landmark: e.target.value })
                            }
                            placeholder="Near Metro..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                          <span>Set as default delivery address</span>
                        </label>

                        <button
                          type="button"
                          onClick={handleSaveAddress}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition"
                        >
                          Save Address
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Selectable Address Cards */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {addresses.map((addr) => {
                        const isSelected = (addr.id || addr._id) === selectedAddressId;
                        return (
                          <div
                            key={addr.id || addr._id}
                            onClick={() => setSelectedAddressId(addr.id || addr._id)}
                            className={`p-3.5 rounded-2xl border transition cursor-pointer relative flex flex-col justify-between ${
                              isSelected
                                ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>{addr.label}</span>
                                  {addr.isDefault && (
                                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                                      Default
                                    </span>
                                  )}
                                </span>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartEditAddress(addr);
                                    }}
                                    className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                                    title="Edit address"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeleteAddress(addr.id || addr._id, e)}
                                    className="p-1 rounded text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition"
                                    title="Delete address"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div className="text-[11px] text-neutral-300 font-semibold">
                                {addr.name} &bull; {addr.phone}
                              </div>

                              <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                                {addr.street}{addr.landmark ? `, Near ${addr.landmark}` : ''}<br />
                                {addr.city}, {addr.state} - <span className="font-mono">{addr.zip}</span>
                              </p>
                            </div>

                            <div className="mt-3 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px]">
                              <span className={isSelected ? 'text-emerald-400 font-bold' : 'text-neutral-500'}>
                                {isSelected ? '● Selected Destination' : '○ Click to Select'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* SECTION 2: PAYMENT METHOD SELECTION */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 text-xs font-black flex items-center justify-center">
                        2
                      </span>
                      <h4 className="text-sm font-black text-white">Payment Method</h4>
                    </div>

                    <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Encrypted SSL</span>
                    </span>
                  </div>

                  {/* Payment Tabs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition cursor-pointer ${
                        paymentMethod === 'upi'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm'
                          : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span className="text-[11px] font-bold">UPI / QR</span>
                      <span className="text-[9px] text-emerald-400">Instant Free</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm'
                          : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="text-[11px] font-bold">Card</span>
                      <span className="text-[9px] text-neutral-500">Debit / Credit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition cursor-pointer ${
                        paymentMethod === 'netbanking'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm'
                          : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span className="text-[11px] font-bold">NetBank</span>
                      <span className="text-[9px] text-neutral-500">All Banks</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('emi')}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition cursor-pointer ${
                        paymentMethod === 'emi'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm'
                          : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <CalendarClock className="w-4 h-4" />
                      <span className="text-[11px] font-bold">EMI</span>
                      <span className="text-[9px] text-amber-400">0% Interest</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`col-span-2 sm:col-span-1 p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm'
                          : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      <span className="text-[11px] font-bold">COD</span>
                      <span className="text-[9px] text-neutral-500">Pay at Door</span>
                    </button>
                  </div>

                  {/* ACTIVE PAYMENT METHOD CONTENT */}
                  <div className="mt-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                    
                    {/* TAB 1: UPI & DYNAMIC QR */}
                    {paymentMethod === 'upi' && (
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {/* QR Preview Box */}
                          <div className="p-3 bg-white rounded-2xl shadow-xl flex flex-col items-center shrink-0">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&margin=0&data=upi://pay?pa=omnistore@okhdfcbank%26pn=OmniStore%26am=${finalPayable}%26cu=INR`}
                              alt="Instant UPI QR Code"
                              className="w-28 h-28 object-contain"
                            />
                            <span className="text-[9px] font-black text-neutral-900 mt-1 uppercase tracking-wider">
                              Scan with any UPI App
                            </span>
                          </div>

                          <div className="flex-1 text-left space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">Instant UPI Dynamic QR</span>
                              <span className="text-[11px] font-mono font-bold text-amber-400 flex items-center gap-1 bg-amber-400/10 px-2 py-0.5 rounded">
                                <Clock className="w-3 h-3" />
                                <span>{formatTimer(upiTimer)}</span>
                              </span>
                            </div>

                            <p className="text-[11px] text-neutral-400 leading-relaxed">
                              Open Google Pay, PhonePe, Paytm, or BHIM and scan this QR code to complete immediate payment of{' '}
                              <span className="text-white font-bold">{formatCurrency(finalPayable)}</span>.
                            </p>

                            <div className="flex items-center gap-2 pt-1">
                              <div className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 font-mono text-xs text-emerald-400">
                                omnistore@okhdfcbank
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText('omnistore@okhdfcbank');
                                  setCopiedUpi(true);
                                  setTimeout(() => setCopiedUpi(false), 2000);
                                }}
                                className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs text-white font-bold transition flex items-center gap-1"
                              >
                                {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedUpi ? 'Copied' : 'Copy ID'}</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Or Enter UPI ID Manually */}
                        <div className="pt-3 border-t border-neutral-800/80">
                          <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                            Or Enter Your UPI ID (VPA)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={upiIdInput}
                              onChange={(e) => {
                                setUpiIdInput(e.target.value);
                                setUpiVerified(false);
                              }}
                              placeholder="e.g. rahul@okaxis or 9876543210@paytm"
                              className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (upiIdInput.includes('@')) {
                                  setUpiVerified(true);
                                } else {
                                  alert('Please enter a valid UPI ID (e.g. name@bank)');
                                }
                              }}
                              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-emerald-400 transition"
                            >
                              {upiVerified ? '✓ Verified' : 'Verify'}
                            </button>
                          </div>
                          {upiVerified && (
                            <span className="text-[10px] text-emerald-400 mt-1 block">
                              ✓ Verified VPA account: Rahul Verma (HDFC Bank Direct)
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* TAB 2: CREDIT / DEBIT CARD */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        {/* 3D Realistic Credit Card Visualizer */}
                        <div className="relative w-full max-w-sm mx-auto h-40 rounded-2xl p-4 bg-gradient-to-br from-neutral-800 via-neutral-900 to-emerald-950 border border-neutral-700 shadow-2xl flex flex-col justify-between overflow-hidden">
                          <div className="flex items-center justify-between">
                            <div className="w-9 h-7 rounded bg-amber-400/80 border border-amber-300 shadow-inner flex items-center justify-center">
                              <span className="w-6 h-4 border border-amber-600/60 rounded-xs"></span>
                            </div>
                            <span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
                              {getCardBrand(cardData.number)}
                            </span>
                          </div>

                          <div className="font-mono text-base tracking-widest text-white drop-shadow">
                            {cardData.number || '•••• •••• •••• ••••'}
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-neutral-300 uppercase">
                            <div>
                              <span className="block text-[8px] text-neutral-500">Cardholder</span>
                              <span className="font-bold">{cardData.holder || 'YOUR NAME'}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] text-neutral-500">Expires</span>
                              <span className="font-mono font-bold">{cardData.expiry || 'MM/YY'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Form Inputs */}
                        <div className="space-y-3 pt-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                              Card Number
                            </label>
                            <input
                              type="text"
                              value={cardData.number}
                              onChange={handleCardNumberChange}
                              placeholder="4000 1234 5678 9010"
                              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 font-mono focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                                Expiration (MM/YY)
                              </label>
                              <input
                                type="text"
                                value={cardData.expiry}
                                onChange={handleExpiryChange}
                                placeholder="12/28"
                                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 font-mono focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                                CVV / Security Code
                              </label>
                              <input
                                type="password"
                                maxLength={4}
                                value={cardData.cvv}
                                onChange={(e) =>
                                  setCardData({ ...cardData, cvv: e.target.value.slice(0, 4) })
                                }
                                placeholder="•••"
                                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 font-mono focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                          </div>

                          <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-400 pt-1">
                            <input
                              type="checkbox"
                              checked={cardData.saveCard}
                              onChange={(e) =>
                                setCardData({ ...cardData, saveCard: e.target.checked })
                              }
                              className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400"
                            />
                            <span>Secure tokenized card storage as per RBI guidelines</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* TAB 3: NET BANKING */}
                    {paymentMethod === 'netbanking' && (
                      <div className="space-y-3">
                        <span className="text-[11px] font-semibold text-neutral-400 block mb-2">
                          Select Popular Bank
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {POPULAR_BANKS.map((b) => (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => setSelectedBank(b.id)}
                              className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                                selectedBank === b.id
                                  ? 'border-emerald-500 bg-emerald-500/15 text-white font-bold'
                                  : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'
                              }`}
                            >
                              <div className="text-xs">{b.name}</div>
                              <span className="text-[10px] text-neutral-500 font-mono">{b.code}</span>
                            </button>
                          ))}
                        </div>

                        <div className="pt-2">
                          <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                            Or Choose from Other Banks
                          </label>
                          <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                          >
                            {OTHER_BANKS.map((bankName) => (
                              <option key={bankName} value={bankName.toLowerCase()}>
                                {bankName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* TAB 4: EMI & NO COST EMI */}
                    {paymentMethod === 'emi' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">Select EMI Plan</span>
                          <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">
                            0% Interest Available
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div
                            onClick={() => setSelectedEmiTenure(3)}
                            className={`p-3 rounded-xl border cursor-pointer text-center transition ${
                              selectedEmiTenure === 3
                                ? 'border-emerald-500 bg-emerald-500/10 text-white'
                                : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                            }`}
                          >
                            <div className="text-sm font-black text-emerald-400">
                              {formatCurrency(Math.round(finalPayable / 3))}/mo
                            </div>
                            <div className="text-[11px] font-bold text-white mt-0.5">3 Months</div>
                            <div className="text-[9px] text-emerald-400">0% No Cost EMI</div>
                          </div>

                          <div
                            onClick={() => setSelectedEmiTenure(6)}
                            className={`p-3 rounded-xl border cursor-pointer text-center transition ${
                              selectedEmiTenure === 6
                                ? 'border-emerald-500 bg-emerald-500/10 text-white'
                                : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                            }`}
                          >
                            <div className="text-sm font-black text-emerald-400">
                              {formatCurrency(Math.round(finalPayable / 6))}/mo
                            </div>
                            <div className="text-[11px] font-bold text-white mt-0.5">6 Months</div>
                            <div className="text-[9px] text-emerald-400">0% No Cost EMI</div>
                          </div>

                          <div
                            onClick={() => setSelectedEmiTenure(12)}
                            className={`p-3 rounded-xl border cursor-pointer text-center transition ${
                              selectedEmiTenure === 12
                                ? 'border-emerald-500 bg-emerald-500/10 text-white'
                                : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                            }`}
                          >
                            <div className="text-sm font-black text-white">
                              {formatCurrency(Math.round((finalPayable * 1.08) / 12))}/mo
                            </div>
                            <div className="text-[11px] font-bold text-white mt-0.5">12 Months</div>
                            <div className="text-[9px] text-neutral-400">8% Low Interest</div>
                          </div>
                        </div>

                        <p className="text-[10px] text-neutral-400 mt-2">
                          Supported by HDFC FlexiPay, ZestMoney, Simpl, and SBI Cards. No paper verification required.
                        </p>
                      </div>
                    )}

                    {/* TAB 5: CASH ON DELIVERY */}
                    {paymentMethod === 'cod' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                          <Info className="w-4 h-4 shrink-0" />
                          <span>
                            Pay using Cash or doorstep QR upon delivery. Please keep exact change ready.
                          </span>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                            Anti-Spam Security Verification
                          </label>
                          <div className="flex items-center gap-3">
                            <div className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700 font-mono text-base font-black text-emerald-400 tracking-widest select-none">
                              {captchaCode}
                            </div>
                            <button
                              type="button"
                              onClick={generateNewCaptcha}
                              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition"
                              title="Generate new code"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <input
                              type="text"
                              maxLength={4}
                              value={captchaInput}
                              onChange={(e) => setCaptchaInput(e.target.value)}
                              placeholder="Enter 4 digits"
                              className="w-32 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 font-mono focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* SECTION 3: OMNICOINS LOYALTY REWARDS REDEMPTION */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-neutral-950 to-emerald-500/10 border border-amber-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                      <Coins className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white flex items-center gap-1.5">
                        <span>Redeem 500 OmniCoins</span>
                        <span className="text-[10px] text-amber-400 font-bold px-1.5 py-0.2 rounded bg-amber-400/10">
                          Save ₹500
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400">
                        Available balance: 1,450 OmniCoins in your customer account
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setRedeemOmniCoins(!redeemOmniCoins)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      redeemOmniCoins
                        ? 'bg-emerald-500 text-neutral-950 shadow-md font-black'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {redeemOmniCoins ? '✓ Applied' : 'Apply'}
                  </button>
                </div>

                {/* SECTION 4: BILLING BREAKDOWN & PLACE ORDER BUTTON */}
                <div className="pt-4 border-t border-neutral-800 space-y-3">
                  <div className="space-y-1.5 text-xs text-neutral-400">
                    <div className="flex justify-between">
                      <span>Items Subtotal:</span>
                      <span className="font-mono text-neutral-200">{formatCurrency(rawSubtotal)}</span>
                    </div>

                    {effectiveDiscount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-semibold">
                        <span>Discounts (Promo + OmniCoins):</span>
                        <span className="font-mono">-{formatCurrency(effectiveDiscount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Standard Express Shipping:</span>
                      <span className="font-mono text-neutral-200">
                        {shipping === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : formatCurrency(shipping)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Estimated GST / Tax:</span>
                      <span className="font-mono text-neutral-200">{formatCurrency(tax)}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-neutral-400 block">Total Payable Now:</span>
                      <div className="text-2xl font-black text-emerald-400 font-mono">
                        {formatCurrency(finalPayable)}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !activeAddress}
                      className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-black text-sm transition shadow-xl shadow-emerald-500/25 flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      {loading ? (
                        <span>Processing Order...</span>
                      ) : (
                        <>
                          <span>
                            {paymentMethod === 'cod' ? 'Confirm Cash on Delivery' : 'Place Order & Pay'}
                          </span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </form>
            )}
          </div>

        </div>
      </div>

      {/* Tax Invoice Modal for Download & Printing */}
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        order={orderSuccess}
        tenant={tenant}
      />
    </>
  );
}
