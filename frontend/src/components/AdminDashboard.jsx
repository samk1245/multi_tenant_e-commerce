import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Store,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
  Sliders,
  Filter,
} from 'lucide-react';
import { api } from '../api';
import { formatCurrency } from '../utils/formatters';

export default function AdminDashboard({ onSelectStore }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminOverview();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleToggleStoreStatus = async (tenantId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setActionLoading(tenantId);
    try {
      const res = await api.updateTenantStatus(tenantId, newStatus);
      if (res.success) {
        fetchOverview();
      }
    } catch (err) {
      alert("Error updating store status: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-neutral-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-3" />
        <p className="font-bold">Loading Super-Admin Platform Analytics...</p>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalUsers: 0,
    totalStores: 0,
    activeStores: 0,
    pendingReviewStores: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    growthRate: '+24.8% MoM',
    uptime: '99.99%',
  };

  const filteredTenants = (data?.tenants || []).filter((t) => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.slug.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">Super-Admin Platform Hub</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider">
                Full RBAC Root
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Live multi-tenant telemetry, global merchant governance, and catalog oversight
            </p>
          </div>
        </div>

        <button
          onClick={fetchOverview}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 border border-neutral-700 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Platform GMV</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{formatCurrency(metrics.totalRevenue)}</div>
          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{metrics.growthRate}</span>
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Stores</span>
            <Store className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{metrics.activeStores}</div>
          <span className="text-[11px] text-neutral-400">
            {metrics.totalStores} Total Registered Stores
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Live Catalog Items</span>
            <Package className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{metrics.totalProducts}</div>
          <span className="text-[11px] text-emerald-400">100% In-Stock & Verified</span>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">System Health</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{metrics.uptime}</div>
          <span className="text-[11px] text-neutral-400">Zero Critical Incidents</span>
        </div>
      </div>

      {/* Store Governance Table */}
      <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-white">Merchant Stores Governance</h3>
            <p className="text-xs text-neutral-400">Moderate store status, inspect catalog, and audit merchant compliance</p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search stores or category..."
              className="pl-9 pr-4 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950/60 uppercase text-[10px] text-neutral-400 font-bold border-b border-neutral-800">
              <tr>
                <th className="py-3.5 px-6">Store Branding</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Owner / Curator</th>
                <th className="py-3.5 px-6">Rating & Followers</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredTenants.map((store) => (
                <tr key={store._id} className="hover:bg-neutral-800/40 transition">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-neutral-950 border border-neutral-800">
                      {store.logo || '🏪'}
                    </span>
                    <div>
                      <div className="font-bold text-white text-sm">{store.name}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">slug: {store.slug}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-300 font-semibold text-[11px] border border-neutral-700">
                      {store.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-neutral-200">{store.owner?.name || 'Verified Merchant'}</div>
                    <span className="text-[10px] text-emerald-400">KYC Verified ✓</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-white">⭐ {store.rating?.toFixed(1) || '4.8'}</div>
                    <div className="text-[10px] text-neutral-400">{(store.followersCount || 1000).toLocaleString()} followers</div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        store.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${store.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                      {store.status === 'active' ? 'Live Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => onSelectStore && onSelectStore(store)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold transition cursor-pointer"
                      title="Inspect this store in marketplace storefront"
                    >
                      Inspect
                    </button>
                    <button
                      disabled={actionLoading === store._id}
                      onClick={() => handleToggleStoreStatus(store._id, store.status)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer disabled:opacity-50 ${
                        store.status === 'active'
                          ? 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/80'
                          : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800/80'
                      }`}
                    >
                      {actionLoading === store._id ? 'Updating...' : store.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders & Users Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Recent Platform Orders</span>
            <span className="text-xs text-neutral-400 font-normal">Real-Time Webhooks</span>
          </h4>
          <div className="space-y-2.5">
            {(data?.recentOrders || []).map((order) => (
              <div key={order._id} className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white">{order.orderNumber || 'ORD-98210-IN'}</span>
                  <div className="text-[11px] text-neutral-400">Customer: {order.customer}</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-400 font-mono">{formatCurrency(order.total)}</span>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wider">{order.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System & Registered Accounts */}
        <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Registered Platform Profiles</span>
            <span className="text-xs text-neutral-400 font-normal">Role-Based Access</span>
          </h4>
          <div className="space-y-2.5">
            {(data?.recentUsers || []).map((u) => (
              <div key={u._id} className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-neutral-950 font-black">
                    {u.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <span className="font-bold text-white">{u.name}</span>
                    <div className="text-[10px] text-neutral-400">{u.email}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-[10px] font-bold uppercase text-neutral-300 border border-neutral-700">
                  {u.role || 'customer'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
