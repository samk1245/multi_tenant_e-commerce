import React, { useState } from 'react';
import { X, Search, Truck, Package, CheckCircle2, Clock, MapPin, AlertCircle, Phone } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { api } from '../api';

const DEMO_PRESETS = [
  'ORD-94821-IN',
  'ORD-83910-IN',
  'DLV8391038IN',
  'BD98472910IN',
];

export default function OrderTrackerModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSearch = async (trackingCode) => {
    const code = (trackingCode || query).trim();
    if (!code) return;

    setLoading(true);
    setError(null);
    setTrackingData(null);

    try {
      const res = await api.trackOrder(code);
      if (res.success && res.data) {
        setTrackingData(res.data);
      } else {
        setError(res.message || 'No tracking information found for this reference.');
      }
    } catch (err) {
      setError('Unable to fetch live tracking details: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const order = trackingData?.order;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        
        {/* Header */}
        <div className="p-5 px-6 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Live Shipment Tracker</h3>
              <p className="text-xs text-neutral-400">
                Track your parcel delivery across all fulfillment carriers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Search Bar & Demo Presets */}
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter Order # (e.g. ORD-94821-IN) or AWB Tracking #"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                {loading ? 'Searching...' : 'Track'}
              </button>
            </form>

            {/* Quick Demo Reference Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-neutral-400">
              <span className="text-[10px] uppercase font-bold text-neutral-500">Quick Test:</span>
              {DEMO_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setQuery(preset);
                    handleSearch(preset);
                  }}
                  className="px-2.5 py-0.5 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-emerald-500/40 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Tracking Result View */}
          {trackingData && (
            <div className="space-y-5 animate-in fade-in duration-300">
              
              {/* Carrier & Status Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-950 via-emerald-950/20 to-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      AWB: {trackingData.trackingNumber || 'DLV8391038IN'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {trackingData.status || 'In Transit'}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">
                    {trackingData.carrier || 'Delhivery Express Direct'}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Estimated Delivery: <strong className="text-white">{trackingData.estimatedDelivery || 'Tomorrow by 4:00 PM'}</strong></span>
                  </p>
                </div>

                {order && (
                  <div className="text-left sm:text-right text-xs">
                    <span className="text-neutral-400 block">Total Amount:</span>
                    <span className="text-base font-black text-white font-mono">
                      {formatCurrency(order.totalAmount)}
                    </span>
                    <span className="text-[10px] text-emerald-400 block font-semibold">
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}
                    </span>
                  </div>
                )}
              </div>

              {/* Step-by-Step Delivery Timeline */}
              <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-4">
                <span className="text-xs font-bold text-white block">
                  Delivery Milestones & GPS Tracking
                </span>

                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                    <span className="font-bold text-[11px] block">Order Confirmed</span>
                    <span className="text-[10px] text-neutral-400">Warehouse Hub</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                    <Package className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                    <span className="font-bold text-[11px] block">Packed</span>
                    <span className="text-[10px] text-neutral-400">Quality Checked</span>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    trackingData.status === 'delivered' || trackingData.status === 'shipped' || trackingData.status === 'out_for_delivery'
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                  }`}>
                    <Truck className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                    <span className="font-bold text-[11px] block">In Transit</span>
                    <span className="text-[10px] text-neutral-400">Mumbai Hub</span>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    trackingData.status === 'delivered'
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                  }`}>
                    <Clock className="w-4 h-4 mx-auto mb-1" />
                    <span className="font-bold text-[11px] block">Delivered</span>
                    <span className="text-[10px] text-neutral-400">Doorstep</span>
                  </div>
                </div>

                {/* Destination Details */}
                {order?.customer && (
                  <div className="pt-3 border-t border-neutral-800/80 flex items-start gap-2.5 text-xs text-neutral-400">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white font-bold">{order.customer.name}</span>
                      <p className="mt-0.5">
                        {order.customer.address?.street || order.customer.street}, {order.customer.address?.city || order.customer.city}, {order.customer.address?.state || order.customer.state} - {order.customer.address?.zip || order.customer.zip}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Items in this parcel */}
              {order?.items && order.items.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-neutral-400 block mb-2">
                    Package Contents ({order.items.length})
                  </span>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.thumbnail || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80'}
                            alt={item.title}
                            className="w-10 h-10 object-cover rounded-lg bg-neutral-900"
                          />
                          <div>
                            <div className="font-bold text-white">{item.title}</div>
                            <div className="text-[11px] text-neutral-400">Qty: {item.quantity}</div>
                          </div>
                        </div>
                        <div className="font-mono font-bold text-white">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
