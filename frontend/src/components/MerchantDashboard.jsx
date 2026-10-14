import React, { useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Layers,
  TrendingUp,
  Plus,
  Trash2,
  Settings,
  RefreshCw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { api } from '../api';

export default function MerchantDashboard({ tenant, onTenantUpdated }) {
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
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

  React.useEffect(() => {
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

  const handleSyncDummyJSON = async () => {
    setSyncing(true);
    try {
      const res = await api.syncCatalog(tenant._id, 'all');
      if (res.success) {
        alert(res.message);
        loadData();
      } else {
        alert('Sync error: ' + res.message);
      }
    } catch (err) {
      alert('Failed to synchronize catalog: ' + err.message);
    } finally {
      setSyncing(false);
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
    try {
      const updated = await api.updateTenant(tenant._id, editStore);
      if (updated.success) {
        onTenantUpdated(updated.data);
        alert('Store settings updated successfully!');
      }
    } catch (err) {
      alert('Error updating store: ' + err.message);
    }
  };

  if (!tenant) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-indigo-400">
            Multi-Vendor Merchant Portal
          </span>
          <h1 className="text-3xl font-black text-white mt-1">{tenant.name} &bull; Dashboard</h1>
          <p className="text-xs text-neutral-400">
            Tenant-isolated catalog synchronization, sales metrics, and branding controls.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start">
          <button
            onClick={handleSyncDummyJSON}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-bold text-xs shadow-md transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync External Catalog API'}</span>
          </button>

          <button
            onClick={() => setShowAddProduct(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Total Store Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            ${analytics?.totalRevenue?.toFixed(2) || '0.00'}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-semibold">+22.5% vs previous period</p>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{analytics?.totalOrders || 0}</div>
          <p className="text-[11px] text-neutral-400 mt-1">Processed orders</p>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Active Products</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{products.length}</div>
          <p className="text-[11px] text-neutral-400 mt-1">Live in store catalog</p>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Average Order Value</span>
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white">
            ${analytics?.avgOrderValue?.toFixed(2) || '0.00'}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Per transaction</p>
        </div>
      </div>

      {/* Product Management Table */}
      <div className="rounded-3xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-white text-base">Store Catalog</h3>
            <p className="text-xs text-neutral-400">Scoped to {tenant.name}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/60 text-neutral-400 font-semibold border-b border-neutral-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-neutral-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.thumbnail || (p.images && p.images[0])}
                        alt={p.title}
                        className="w-10 h-10 object-cover rounded-xl bg-neutral-950"
                      />
                      <div>
                        <div className="font-bold text-white">{p.title}</div>
                        <div className="text-[11px] text-neutral-500 font-mono">
                          ID: {p._id.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-300 font-medium">{p.category}</td>
                  <td className="py-3.5 px-4 font-bold text-white">${p.price.toFixed(2)}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        p.stock > 10
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {p.stock} in stock
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-300 font-medium">
                    ★ {p.rating} ({p.reviewsCount || 0})
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDeleteProduct(p._id)}
                      className="p-2 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition"
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

      {/* Store Settings Form */}
      <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-indigo-400" />
          <h3 className="font-extrabold text-white text-base">Storefront Branding & Configuration</h3>
        </div>

        <form onSubmit={handleSaveStoreSettings} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-neutral-400 font-semibold mb-1">Store Name</label>
            <input
              type="text"
              value={editStore.name}
              onChange={(e) => setEditStore({ ...editStore, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-neutral-400 font-semibold mb-1">Category</label>
            <input
              type="text"
              value={editStore.category}
              onChange={(e) => setEditStore({ ...editStore, category: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-neutral-400 font-semibold mb-1">Tagline</label>
            <input
              type="text"
              value={editStore.tagline}
              onChange={(e) => setEditStore({ ...editStore, tagline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-neutral-400 font-semibold mb-1">Description</label>
            <textarea
              rows="3"
              value={editStore.description}
              onChange={(e) => setEditStore({ ...editStore, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
            >
              Save Store Changes
            </button>
          </div>
        </form>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl">
            <h3 className="text-lg font-black text-white mb-4">Add Product to {tenant.name}</h3>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  placeholder="e.g. Velocity Carbon Racer"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="129.99"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Compare At Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.compareAtPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, compareAtPrice: e.target.value })}
                    placeholder="159.99"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    placeholder="Apparel, Gear, etc."
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={newProduct.thumbnail}
                  onChange={(e) => setNewProduct({ ...newProduct, thumbnail: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Description</label>
                <textarea
                  rows="2"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
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
