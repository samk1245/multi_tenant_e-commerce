import React, { useState } from 'react';
import {
  ShoppingBag,
  Store,
  ChevronDown,
  Plus,
  LayoutDashboard,
  ShoppingCart,
  User,
  Heart,
  Truck,
  LogOut,
  MapPin,
  Sparkles,
  Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({
  tenants,
  activeTenant,
  onSelectTenant,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenTracking,
  activeTab,
  onTabChange,
  onOpenCreateStore,
  currentUser,
  onOpenAuth,
  onLogout,
  deliveryLocation,
  onSelectLocation,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  const locations = [
    'New York, 10001',
    'Los Angeles, 90001',
    'Chicago, 60601',
    'San Francisco, 94105',
    'London, EC1A',
    'Mumbai, 400001',
  ];

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/85 backdrop-blur-2xl border-b border-neutral-800/80 shadow-2xl">
      {/* Top utility sub-bar inspired by Amazon/Flipkart */}
      <div className="bg-neutral-900/60 border-b border-neutral-800/50 py-1.5 px-4 sm:px-6 lg:px-8 text-[11px] text-neutral-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Delivery Location Selector */}
            <div className="relative">
              <button
                onClick={() => setLocationOpen(!locationOpen)}
                className="flex items-center gap-1.5 hover:text-white transition font-medium text-neutral-300"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deliver to: <strong className="text-white">{deliveryLocation || 'New York, 10001'}</strong></span>
                <ChevronDown className="w-3 h-3 text-neutral-500" />
              </button>

              <AnimatePresence>
                {locationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute left-0 mt-2 w-56 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl py-2 z-50 text-xs"
                  >
                    <div className="px-3 py-1 font-bold text-neutral-400 uppercase text-[10px]">Select Your Region</div>
                    {locations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          onSelectLocation(loc);
                          setLocationOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-neutral-800 text-neutral-200 transition"
                      >
                        {loc}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-neutral-400">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Multi-Vendor Unified Logistics & Real-Time Sync</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenTracking}
              className="flex items-center gap-1 hover:text-white transition font-medium"
            >
              <Truck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Track Orders</span>
            </button>

            <span className="text-neutral-700">|</span>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">Hi, {currentUser.name}</span>
                <button
                  onClick={onLogout}
                  className="hover:text-rose-400 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-3 h-3 inline" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="text-white font-bold hover:text-emerald-400 transition"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand & Storefront Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-2 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-inner">
                {activeTenant?.logo || '🛍️'}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl tracking-tight text-white">
                    {activeTenant?.name || 'OmniCommerce'}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
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
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 transition shadow-sm"
              >
                <Store className="w-3.5 h-3.5 text-emerald-400" />
                <span>Switch Store</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    className="absolute left-0 mt-2 w-72 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl py-2 z-50"
                  >
                    <div className="px-3 py-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
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
                          activeTenant?._id === t._id ? 'bg-neutral-800/80 text-white font-semibold' : 'text-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{t.logo || '🏪'}</span>
                          <div>
                            <div className="text-sm font-bold">{t.name}</div>
                            <div className="text-[11px] text-neutral-400">{t.category}</div>
                          </div>
                        </div>
                        {activeTenant?._id === t._id && (
                          <div className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
                        )}
                      </button>
                    ))}
                    <div className="border-t border-neutral-800 mt-2 pt-2 px-2">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onOpenCreateStore();
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition shadow-lg"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Create New Storefront
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Navigation & Interactive Action Controls */}
          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex p-1 rounded-2xl bg-neutral-900 border border-neutral-800">
              <button
                onClick={() => onTabChange('store')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  activeTab === 'store'
                    ? 'bg-neutral-800 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                Storefront
              </button>
              <button
                onClick={() => onTabChange('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  activeTab === 'admin'
                    ? 'bg-neutral-800 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                Merchant Dashboard
              </button>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-rose-400 border border-neutral-800 transition"
              title="My Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            {activeTab === 'store' && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onOpenCart}
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition shadow-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-xs font-black hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 text-xs font-black shadow-md">
                    {cartCount}
                  </span>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
