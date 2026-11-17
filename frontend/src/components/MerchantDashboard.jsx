import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Layers,
  TrendingUp,
  Plus,
  Trash2,
  Edit3,
  Settings,
  Package,
  Star,
  Check,
  X,
  Sparkles,
  BarChart3,
  Store,
  Upload,
} from 'lucide-react';
import { api } from '../api';
import { formatCurrency } from '../utils/formatters';

export default function MerchantDashboard({ tenant, onTenantUpdated }) {
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [isSavingStore, setIsSavingStore] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    compareAtPrice: '',
    category: 'General',
    description: '',
    thumbnail: '',
    stock: 20,
    badge: 'NEW',
  });

  const [editStore, setEditStore] = useState({
    name: tenant?.name || '',
    tagline: tenant?.tagline || '',
    description: tenant?.description || '',
    category: tenant?.category || '',
  });

  const loadData = async () => {
    if (!tenant?._id) return;
    setLoading(true);
    try {
      const [analyticsData, productsData] = await Promise.all([
        api.getTenantAnalytics(tenant._id),
        api.getProducts(tenant.slug),
      ]);
      setAnalytics(analyticsData);
      setProducts(productsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (tenant) {
      setEditStore({
        name: tenant.name,
        tagline: tenant.tagline,
        description: tenant.description,
        category: tenant.category,
      });
    }
  }, [tenant?._id]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.createProduct(tenant._id, {
        ...newProduct,
        price: parseFloat(newProduct.price),
        compareAtPrice: newProduct.compareAtPrice ? parseFloat(newProduct.compareAtPrice) : null,
        stock: parseInt(newProduct.stock),
      });
      setShowAddProduct(false);
      setNewProduct({
        title: '',
        price: '',
        compareAtPrice: '',
        category: 'General',
        description: '',
        thumbnail: '',
        stock: 20,
        badge: 'NEW',
      });
      loadData();
    } catch (err) {
      alert('Error adding product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await api.deleteProduct(id);
      loadData();
    }
  };

  const handleSaveStoreSettings = async (e) => {
    e.preventDefault();
    setIsSavingStore(true);
    try {
      const updated = await api.updateTenant(tenant._id, editStore);
      if (updated.success) {
        onTenantUpdated(updated.data);
        alert('Store settings updated successfully!');
      }
    } catch (err) {
      alert('Error updating store: ' + err.message);
    } finally {
      setIsSavingStore(false);
    }
  };

  if (!tenant) return null;

  // Best selling products derived from inventory
  const bestSellers = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);

  const weeklyData = [
    { day: 'Mon', gmv: 34000, orders: 4, height: '45%' },
    { day: 'Tue', gmv: 52000, orders: 7, height: '65%' },
    { day: 'Wed', gmv: 41000, orders: 5, height: '52%' },
    { day: 'Thu', gmv: 68000, orders: 9, height: '80%' },
    { day: 'Fri', gmv: 89000, orders: 12, height: '95%' },
    { day: 'Sat', gmv: 94000, orders: 14, height: '100%' },
    { day: 'Sun', gmv: 76000, orders: 10, height: '88%' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#090b16]/90 border border-white/10 shadow-2xl backdrop-blur-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
              Vendor Merchant Studio
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
              Tenant #{tenant.slug}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{tenant.logo}</span>
            <span>{tenant.name}</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Real-time merchant sales performance, catalog management, order volume & storefront configuration
          </p>
        </div>

        <button
          onClick={() => setShowAddProduct(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition self-start cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0a0c18]/90 border border-white/10 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Store Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {formatCurrency(analytics?.totalRevenue || 0)}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% MoM</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a0c18]/90 border border-white/10 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {analytics?.totalOrders || 0}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Processed transactions</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a0c18]/90 border border-white/10 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Inventory</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{products.length}</div>
          <p className="text-[11px] text-cyan-400 mt-1">SKUs live in storefront</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a0c18]/90 border border-white/10 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Order Value (AOV)</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {formatCurrency(analytics?.avgOrderValue || 0)}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Per checkout basket</p>
        </div>
      </div>

      {/* Sales Performance & Best-Selling Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Performance Chart (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0a0c18]/90 border border-white/10 shadow-2xl backdrop-blur-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <h3 className="font-black text-white text-base">Store Sales & Revenue Velocity</h3>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Weekly GMV tracking with multi-tier payment breakdown
              </p>
            </div>
            <div className="flex items-center gap-1 bg-[#050508] p-1 rounded-xl border border-white/10 text-[10px] font-bold">
              {['24h', '7d', '30d', '1y'].map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPeriod(p)}
                  className={`px-2.5 py-1 rounded-lg uppercase transition cursor-pointer ${
                    selectedPeriod === p
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-44 w-full flex items-end gap-2 pt-6 pb-2 px-2 border-b border-white/10">
            {weeklyData.map((bar) => (
              <div
                key={bar.day}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#050508] border border-white/10 px-2 py-1 rounded text-[10px] text-cyan-400 font-mono text-center whitespace-nowrap shadow-lg">
                  {formatCurrency(bar.gmv)} ({bar.orders} ord)
                </div>
                <div
                  className="w-full bg-gradient-to-t from-purple-700 via-indigo-600 to-cyan-400 rounded-xl group-hover:brightness-125 transition-all duration-300 shadow-md group-hover:shadow-cyan-500/20"
                  style={{ height: bar.height }}
                />
                <span className="text-[11px] font-bold text-neutral-400 group-hover:text-white transition">
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Best-Selling Products Leaderboard (1 col) */}
        <div className="p-6 rounded-3xl bg-[#0a0c18]/90 border border-white/10 shadow-2xl backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-black text-white">Best-Selling Products</h3>
          </div>

          <div className="space-y-3">
            {bestSellers.map((item, idx) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#050508] border border-white/5 text-xs hover:border-purple-500/30 transition"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center font-mono font-black text-[10px] text-neutral-400">
                    {idx + 1}
                  </span>
                  <img
                    src={item.thumbnail || item.images?.[0]}
                    alt={item.title}
                    className="w-8 h-8 rounded-lg object-cover bg-neutral-950 flex-shrink-0"
                  />
                  <div className="truncate">
                    <h5 className="font-bold text-white truncate max-w-[120px]">{item.title}</h5>
                    <span className="text-[10px] text-neutral-500">{item.stock} in stock</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-cyan-400">
                  {formatCurrency(item.price)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Management Table */}
      <div className="rounded-3xl bg-[#0a0c18]/90 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="font-black text-white text-base">Store Catalog</h3>
            <p className="text-xs text-neutral-400">
              Manage inventory and product specifications strictly scoped to this boutique.
            </p>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            {products.length} Products Scoped
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050508]/70 text-neutral-400 font-bold border-b border-white/10 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Product Item</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Price</th>
                <th className="py-3.5 px-6">Stock Status</th>
                <th className="py-3.5 px-6">Customer Rating</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-white/5 transition">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.thumbnail || p.images?.[0]}
                        alt={p.title}
                        className="w-10 h-10 object-cover rounded-xl bg-[#050508] border border-white/10"
                      />
                      <div>
                        <div className="font-bold text-white text-sm">{p.title}</div>
                        <div className="text-[11px] text-neutral-500 font-mono">
                          SKU #{p._id.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="px-2.5 py-1 rounded-md bg-[#121422] text-cyan-300 font-medium text-[11px] border border-cyan-500/20">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-mono font-bold text-white">
                    {formatCurrency(p.price)}
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5 ${
                        p.stock > 10
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : p.stock > 0
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          p.stock > 10 ? 'bg-emerald-400' : p.stock > 0 ? 'bg-amber-400' : 'bg-rose-400'
                        }`}
                      />
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-neutral-300 font-medium">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{(p.rating || 4.8).toFixed(1)}</span>
                      <span className="text-[11px] text-neutral-500 font-normal">
                        ({p.reviewsCount || 12})
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => handleDeleteProduct(p._id)}
                      className="p-2 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Store Branding & Configuration */}
      <div className="rounded-3xl bg-[#0a0c18]/90 border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/10">
          <Settings className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="font-black text-white text-base">Storefront Identity & Configuration</h3>
            <p className="text-xs text-neutral-400">
              Customize name, category, and marketing positioning
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveStoreSettings} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-neutral-400 font-bold mb-1.5">Storefront Name</label>
            <input
              type="text"
              value={editStore.name}
              onChange={(e) => setEditStore({ ...editStore, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#050508] border border-white/10 text-white focus:outline-none focus:border-purple-500 shadow-inner"
            />
          </div>

          <div>
            <label className="block text-neutral-400 font-bold mb-1.5">Marketplace Category</label>
            <input
              type="text"
              value={editStore.category}
              onChange={(e) => setEditStore({ ...editStore, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#050508] border border-white/10 text-white focus:outline-none focus:border-purple-500 shadow-inner"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-neutral-400 font-bold mb-1.5">Tagline & Motto</label>
            <input
              type="text"
              value={editStore.tagline}
              onChange={(e) => setEditStore({ ...editStore, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#050508] border border-white/10 text-white focus:outline-none focus:border-purple-500 shadow-inner"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-neutral-400 font-bold mb-1.5">Boutique Description</label>
            <textarea
              rows="3"
              value={editStore.description}
              onChange={(e) => setEditStore({ ...editStore, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#050508] border border-white/10 text-white focus:outline-none focus:border-purple-500 shadow-inner"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isSavingStore}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition cursor-pointer active:scale-95"
            >
              {isSavingStore ? 'Saving Changes...' : 'Save Store Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="w-full max-w-lg rounded-3xl bg-[#0a0c18] border border-white/10 p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
              <h3 className="text-lg font-black text-white">Add Product to {tenant.name}</h3>
              <button
                onClick={() => setShowAddProduct(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  placeholder="e.g. Apex Titanium Headphones"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050508] border border-white/10 text-white focus:outline-none focus:border-purple-500 shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="2499"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050508] border border-white/10 text-white focus:outline-none focus:border-purple-500 shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    Compare At Price (₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={newProduct.compareAtPrice}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, compareAtPrice: e.target.value })
                    }
                    placeholder="3499"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050508] border border-white/10 text-white focus:outline-none focus:border-purple-500 shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    placeholder="Electronics, Fashion..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050508] border border-white/10 text-white focus:outline-none focus:border-purple-500 shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Initial Stock Count</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050508] border border-white/10 text-white focus:outline-none focus:border-purple-500 shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Product Image URL</label>
                <input
                  type="url"
                  value={newProduct.thumbnail}
                  onChange={(e) => setNewProduct({ ...newProduct, thumbnail: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050508] border border-white/10 text-white focus:outline-none focus:border-purple-500 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Description</label>
                <textarea
                  rows="2"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Key features and specifications..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050508] border border-white/10 text-white focus:outline-none focus:border-purple-500 shadow-inner"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold transition cursor-pointer shadow-md shadow-purple-600/30"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
