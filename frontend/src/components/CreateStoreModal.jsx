import React, { useState } from 'react';
import { X, Store, Sparkles } from 'lucide-react';
import { api } from '../api';

export default function CreateStoreModal({ isOpen, onClose, onStoreCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    category: 'Fashion & Lifestyle',
    logo: '🛍️',
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleNameChange = (name) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData({ ...formData, name, slug });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.createTenant(formData);
      if (res.success) {
        onStoreCreated(res.data);
        onClose();
      } else {
        alert(res.message || "Failed to create store");
      }
    } catch (err) {
      alert("Error creating store: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Store className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-black text-white">Create New Tenant Storefront</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-neutral-300 font-semibold mb-1">Store Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Kyoto Tea House"
              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Store Slug (Subdomain)</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="kyoto-tea"
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Logo Icon / Emoji</label>
              <input
                type="text"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="🍵"
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-white text-center focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1">Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Ceremonial Grade Matcha & Teaware"
              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Artisanal Food & Beverage"
              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Creating Store...' : 'Launch Storefront'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
