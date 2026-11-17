import React, { useState } from 'react';
import { X, Store, Sparkles, Plus } from 'lucide-react';
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
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
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
        alert(res.message || 'Failed to create store');
      }
    } catch (err) {
      alert('Error creating store: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0a0c18] border border-white/10 p-6 sm:p-8 shadow-2xl text-neutral-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 shadow-md shadow-purple-600/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#050508] rounded-[14px] flex items-center justify-center text-cyan-300">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">
              Launch New Tenant Storefront
            </h3>
            <p className="text-xs text-neutral-400">
              Spin up an isolated merchant database and custom domain slug
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-neutral-300 font-bold mb-1">Storefront Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Kyoto Artisan Matcha"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#050508] border border-white/10 text-white focus:outline-none focus:border-purple-500 shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-bold mb-1">
                Store Slug (Subdomain)
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="kyoto-matcha"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050508] border border-white/10 text-white font-mono focus:outline-none focus:border-purple-500 shadow-inner"
              />
            </div>
            <div>
              <label className="block text-neutral-300 font-bold mb-1">Logo Icon / Emoji</label>
              <input
                type="text"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="🍵"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050508] border border-white/10 text-white text-center focus:outline-none focus:border-purple-500 shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 font-bold mb-1">Marketing Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Ceremonial Grade First-Harvest Uji Teas"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#050508] border border-white/10 text-white focus:outline-none focus:border-purple-500 shadow-inner"
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-bold mb-1">Store Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Specialty Tea & Artisanal Food"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#050508] border border-white/10 text-white focus:outline-none focus:border-purple-500 shadow-inner"
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-bold mb-1">Overview Description</label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Direct-trade ceremonial teas and handcrafted tea sets..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#050508] border border-white/10 text-white focus:outline-none focus:border-purple-500 shadow-inner"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold transition cursor-pointer shadow-md shadow-purple-600/30 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Deploying...' : 'Deploy Storefront'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
