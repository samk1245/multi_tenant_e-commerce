import React, { useState } from 'react';
import { ShoppingBag, Store, Shield, Sparkles, ChevronDown, Plus, LayoutDashboard, ShoppingCart, User, Flame, Heart, Truck, Scale } from 'lucide-react';

export default function Navbar({
  tenants,
  activeTenant,
  onSelectTenant,
  cartCount,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
  compareCount,
  onOpenCompare,
  onOpenTracker,
  activeTab,
  onTabChange,
  onOpenCreateStore,
  onOpenProfile,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-neutral-900/90 backdrop-blur-xl border-b border-neutral-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Left: Brand & Store Selector */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-2 rounded-xl bg-neutral-800/90 border border-neutral-700/80 shadow-inner flex items-center justify-center">
                {activeTenant?.logo || '🛍️'}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-white">
                    {activeTenant?.name || 'OmniCommerce'}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline-block">
                    Live Store
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
                className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 text-xs font-bold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition shadow-sm cursor-pointer"
              >
                <Store className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Switch Store</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl py-2 z-50 overflow-hidden">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Select Tenant Storefront
                  </div>
                  {tenants.map((t) => (
                    <button
                      key={t._id}
                      onClick={() => {
                        onSelectTenant(t);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between hover:bg-neutral-800 transition ${
                        activeTenant?._id === t._id ? 'bg-neutral-800/90 text-white font-bold' : 'text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{t.logo || '🏪'}</span>
                        <div>
                          <div className="text-xs font-bold">{t.name}</div>
                          <div className="text-[10px] text-neutral-400">{t.category}</div>
                        </div>
                      </div>
                      {activeTenant?._id === t._id && (
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></div>
                      )}
                    </button>
                  ))}
                  <div className="border-t border-neutral-800 mt-2 pt-2 px-2">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenCreateStore();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create New Storefront
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Tabs, Wishlist, Profile & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Mode Switcher */}
            <div className="flex p-1 rounded-xl bg-neutral-800/90 border border-neutral-700/80">
              <button
                onClick={() => onTabChange('store')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'store'
                    ? 'bg-neutral-700 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Storefront</span>
              </button>
              <button
                onClick={() => onTabChange('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-neutral-700 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Merchant</span>
              </button>
            </div>

            {/* Live Track Shipment Button */}
            <button
              onClick={onOpenTracker}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800/90 hover:bg-neutral-700/90 text-neutral-300 hover:text-emerald-400 border border-neutral-700/80 transition text-xs font-bold cursor-pointer"
              title="Track any parcel by Order # or AWB"
            >
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Track Order</span>
            </button>

            {/* Compare Drawer Button */}
            {activeTab === 'store' && compareCount > 0 && (
              <button
                onClick={onOpenCompare}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 transition text-xs font-bold cursor-pointer animate-pulse"
                title="View Product Comparison"
              >
                <Scale className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden md:inline">Compare</span>
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-purple-500 text-white text-[10px] font-black">
                  {compareCount}
                </span>
              </button>
            )}

            {/* Wishlist Button */}
            {activeTab === 'store' && (
              <button
                onClick={onOpenWishlist}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800/90 hover:bg-neutral-700/90 text-neutral-300 hover:text-rose-400 border border-neutral-700/80 transition text-xs font-bold cursor-pointer"
                title="Saved Wishlist"
              >
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden md:inline">Saved</span>
                {wishlistCount > 0 && (
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black">
                    {wishlistCount}
                  </span>
                )}
              </button>
            )}

            {/* Profile Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800/90 hover:bg-neutral-700/90 text-neutral-300 hover:text-white border border-neutral-700/80 transition text-xs font-bold cursor-pointer"
              title="My Account, Orders & Rewards"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Profile</span>
            </button>

            {/* Shopping Cart Button */}
            {activeTab === 'store' && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition shadow-sm cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-xs font-bold hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 text-xs font-black shadow-md">
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
