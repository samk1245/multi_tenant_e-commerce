import React, { useState, useEffect } from 'react';
import { X, Package, Clock, Truck, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { api } from '../api';

export default function OrderTrackingModal({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadOrders();
    }
  }, [isOpen]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const list = await api.getMyOrders();
      setOrders(list);
      if (list.length > 0) {
        selectOrder(list[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectOrder = async (order) => {
    setSelectedOrder(order);
    try {
      const res = await api.getOrderTracking(order._id);
      if (res.success) {
        setTrackingData(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Order History & Shipment Tracking</h3>
              <p className="text-xs text-neutral-400">Live multi-carrier logistics timeline and fulfillment milestones</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-800">
          
          {/* Order List Sidebar */}
          <div className="p-5 space-y-3 overflow-y-auto max-h-[60vh]">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Past Orders</h4>
            {loading ? (
              <p className="text-xs text-neutral-500">Loading order records...</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-10 text-neutral-400 text-xs">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No orders placed yet.</p>
              </div>
            ) : (
              orders.map((o) => (
                <div
                  key={o._id}
                  onClick={() => selectOrder(o)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                    selectedOrder?._id === o._id
                      ? 'bg-neutral-800/80 border-indigo-500/50 shadow-md'
                      : 'bg-neutral-950/40 border-neutral-800 hover:bg-neutral-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-white">{o.orderNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-500/10 text-emerald-400">
                      {o.orderStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                    <span className="font-bold text-emerald-400">₹{o.totalAmount ? Math.round(o.totalAmount).toLocaleString('en-IN') : '0'}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Tracking Timeline Main Section */}
          <div className="md:col-span-2 p-6 flex flex-col justify-between overflow-y-auto max-h-[60vh]">
            {selectedOrder ? (
              <div className="space-y-6">
                {/* Order Overview Banner */}
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-neutral-500 text-[10px] uppercase font-bold">Carrier & Tracking</span>
                    <p className="font-bold text-white mt-0.5">
                      {trackingData?.carrier || selectedOrder.shippingDetails?.carrier || 'Express Direct'} &bull;{' '}
                      <span className="font-mono text-emerald-400">
                        {trackingData?.trackingNumber || selectedOrder.shippingDetails?.trackingNumber || 'TRK-LIVE'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] uppercase font-bold">Estimated Delivery</span>
                    <p className="font-bold text-white mt-0.5">
                      {trackingData?.estimatedDelivery || selectedOrder.shippingDetails?.estimatedDelivery || '3-5 Business Days'}
                    </p>
                  </div>
                </div>

                {/* Timeline Steps */}
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">Milestone Progress</h5>
                  <div className="relative pl-6 space-y-6 border-l-2 border-neutral-800 ml-3">
                    {trackingData?.timeline?.map((step, idx) => (
                      <div key={idx} className="relative group">
                        <div
                          className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 ${
                            step.completed
                              ? 'bg-emerald-500 border-neutral-900 ring-4 ring-emerald-500/20'
                              : 'bg-neutral-800 border-neutral-700'
                          }`}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h6 className={`text-xs font-bold ${step.completed ? 'text-white' : 'text-neutral-500'}`}>
                              {step.status}
                            </h6>
                            {step.timestamp && (
                              <span className="text-[10px] text-neutral-500 font-mono">
                                {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5">{step.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items in shipment */}
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Package Contents</h5>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 text-xs">
                        <div className="flex items-center gap-2.5">
                          {it.thumbnail && (
                            <img src={it.thumbnail} alt={it.title} className="w-8 h-8 rounded-lg object-cover" />
                          )}
                          <span className="font-semibold text-white truncate max-w-xs">{it.title}</span>
                        </div>
                        <span className="text-neutral-400 font-mono">Qty: {it.quantity} &bull; ₹{it.price ? it.price.toLocaleString('en-IN') : '0'}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-20 text-neutral-500 text-xs">
                Select an order to view tracking data.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
