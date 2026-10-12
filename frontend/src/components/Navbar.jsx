import React, { useState } from 'react';
import { ShoppingBag, Store, Shield, Sparkles, ChevronDown, Plus, LayoutDashboard, ShoppingCart } from 'lucide-react';

export default function Navbar({
  tenants,
  activeTenant,
  onSelectTenant,
  cartCount,
  onOpenCart,
  activeTab,
  onTabChange,
  onOpenCreateStore,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Left: Brand & Store Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl p-2 rounded-xl bg-neutral-800 border border-neutral-700 shadow-inner">
                {activeTenant?.logo || '🛍️'}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-white">
                    {activeTenant?.name || 'OmniCommerce'}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active Tenant
                  </span>
                </div>
                <p className="text-xs text-neutral-400 hidden sm:block truncate max-w-xs">
                  {activeTenant?.tagline || 'Multi-tenant flagship store'}
                </p>
              </div>
            </div>

            {/* Tenant Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition shadow-sm"
              >
                <Store className="w-3.5 h-3.5 text-emerald-400" />
                <span>Switch Store</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-xl bg-neutral-900 border border-neutral-700 shadow-2xl py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    All Available Stores
                  </div>
                  {tenants.map((t) => (
                    <button
                      key={t._id}
                      onClick={() => {
                        onSelectTenant(t);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-neutral-800 transition ${
                        activeTenant?._id === t._id ? 'bg-neutral-800/80 text-white font-medium' : 'text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{t.logo || '🏪'}</span>
                        <div>
                          <div className="text-sm font-semibold">{t.name}</div>
                          <div className="text-[11px] text-neutral-400">{t.category}</div>
                        </div>
                      </div>
                      {activeTenant?._id === t._id && (
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      )}
                    </button>
                  ))}
                  <div className="border-t border-neutral-800 mt-2 pt-2 px-2">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenCreateStore();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create New Storefront
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Tabs & Cart */}
          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex p-1 rounded-xl bg-neutral-800/90 border border-neutral-700/80">
              <button
                onClick={() => onTabChange('store')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'store'
                    ? 'bg-neutral-700 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                Storefront
              </button>
              <button
                onClick={() => onTabChange('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'admin'
                    ? 'bg-neutral-700 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                Merchant Dashboard
              </button>
            </div>

            {/* Shopping Cart Button */}
            {activeTab === 'store' && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition shadow-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-xs font-bold hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 text-xs font-black">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
