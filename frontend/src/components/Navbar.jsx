import React, { useState } from 'react';
import {
  X,
  Store,
  ChevronDown,
  Plus,
  LayoutDashboard,
  ShoppingCart,
  Heart,
  Truck,
  MapPin,
  Sparkles,
  Search,
  Menu,
  Clock,
  Zap,
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
  search,
  setSearch,
  suggestions,
  showSuggestions,
  setShowSuggestions,
  onSelectSuggestion,
  categories,
  selectedCategory,
  onSelectCategory,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState('All');

  const locations = [
    'Mumbai, 400001',
    'Delhi NCR, 110001',
    'Bengaluru, 560001',
    'Hyderabad, 500001',
    'Chennai, 600001',
    'Kolkata, 700001',
  ];

  return (
    <header className="sticky top-0 z-40 shadow-md">
      {/* 1. Main Navigation Bar (Midnight Slate Header) */}
      <div className="bg-[#0f172a] text-white px-3 sm:px-6 py-2.5">
        <div className="max-w-[1500px] mx-auto flex items-center gap-3 lg:gap-6">
          
          {/* Marketplace Brand / Storefront Logo */}
          <div className="flex items-center gap-2 cursor-pointer flex-shrink-0">
            <span className="text-2xl p-1.5 rounded-xl bg-slate-800 border border-slate-700">
              {activeTenant?.logo || '🛍️'}
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  {activeTenant?.name || 'OmniMarket'}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  Store
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block -mt-0.5">
                .in Prime Marketplace
              </span>
            </div>
          </div>

          {/* Amazon-style "Deliver to [City, Pin]" Box */}
          <div className="relative hidden md:block flex-shrink-0">
            <button
              onClick={() => setLocationOpen(!locationOpen)}
              className="flex items-center gap-1.5 p-1.5 rounded-lg hover:outline hover:outline-1 hover:outline-cyan-400 text-left transition"
            >
              <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="text-slate-400 block">Deliver to {currentUser?.name?.split(' ')[0] || 'Guest'}</span>
                <span className="font-bold text-white flex items-center gap-1">
                  {deliveryLocation || 'Mumbai, 400001'}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </span>
              </div>
            </button>

            <AnimatePresence>
              {locationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute left-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 text-xs"
                >
                  <div className="px-3 py-1 font-bold text-slate-400 uppercase text-[10px]">Select Indian Region</div>
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        onSelectLocation(loc);
                        setLocationOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-200 transition font-medium"
                    >
                      {loc}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Amazon-style Integrated Search Bar with Dropdown & Search Button */}
          <div className="flex-1 relative max-w-3xl">
            <div className="flex items-center rounded-xl overflow-hidden bg-white shadow-inner focus-within:ring-2 focus-within:ring-cyan-400 transition">
              {/* Category Scope Selector */}
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-2.5 py-2.5 border-r border-slate-300 outline-none cursor-pointer hidden sm:block"
              >
                <option value="All">All Categories</option>
                {categories?.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Main Search Input */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => suggestions?.length > 0 && setShowSuggestions(true)}
                placeholder={`Search in ${activeTenant?.name || 'marketplace'}...`}
                className="flex-1 px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none font-medium"
              />

              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="px-2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Cyan Search Button */}
              <button
                className="bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-slate-950 px-4 py-2.5 transition flex items-center justify-center font-bold"
                title="Search"
              >
                <Search className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </button>
            </div>

            {/* Autocomplete Dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50 text-slate-800"
                >
                  <div className="px-3 py-1 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Matching Products
                  </div>
                  {suggestions.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => onSelectSuggestion(item)}
                      className="flex items-center justify-between px-3 py-2 hover:bg-slate-100 cursor-pointer transition text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        {item.thumbnail && (
                          <img src={item.thumbnail} alt="" className="w-8 h-8 rounded object-cover border border-slate-200" />
                        )}
                        <div>
                          <span className="font-bold text-slate-900 block">{item.title}</span>
                          <span className="text-[10px] text-slate-500 font-medium">in {item.category}</span>
                        </div>
                      </div>
                      <span className="font-bold text-cyan-700 font-mono">
                        ₹{item.price?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Action Icons: Store Switcher, Account, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            
            {/* Store Switcher */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 p-1.5 rounded-lg hover:outline hover:outline-1 hover:outline-cyan-400 text-left transition"
              >
                <Store className="w-4 h-4 text-cyan-400" />
                <div className="text-[11px] leading-tight hidden lg:block">
                  <span className="text-slate-400 block text-[10px]">Seller Store</span>
                  <span className="font-bold text-white flex items-center gap-0.5">
                    {activeTenant?.name?.split(' ')[0] || 'Store'}
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </span>
                </div>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 text-xs"
                  >
                    <div className="px-3 py-1 font-bold text-slate-400 uppercase text-[10px]">Available Stores</div>
                    {tenants.map((t) => (
                      <button
                        key={t._id}
                        onClick={() => {
                          onSelectTenant(t);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-slate-800 transition ${
                          activeTenant?._id === t._id ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{t.logo || '🏪'}</span>
                          <div>
                            <div className="font-bold">{t.name}</div>
                            <div className="text-[10px] text-slate-400">{t.category}</div>
                          </div>
                        </div>
                        {activeTenant?._id === t._id && (
                          <div className="w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-cyan-400/30" />
                        )}
                      </button>
                    ))}
                    <div className="border-t border-slate-800 mt-2 pt-2 px-2">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onOpenCreateStore();
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black text-xs transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Create New Store
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Account & Lists */}
            <div className="p-1.5 rounded-lg hover:outline hover:outline-1 hover:outline-cyan-400 cursor-pointer text-left transition">
              {currentUser ? (
                <div onClick={onOpenAuth} className="text-[11px] leading-tight">
                  <span className="text-slate-400 block text-[10px]">Hello, {currentUser.name?.split(' ')[0]}</span>
                  <span className="font-bold text-white flex items-center gap-1">
                    Account & Details
                  </span>
                </div>
              ) : (
                <button onClick={onOpenAuth} className="text-[11px] leading-tight text-left">
                  <span className="text-slate-400 block text-[10px]">Hello, Sign in</span>
                  <span className="font-bold text-white">Account & Lists</span>
                </button>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 rounded-lg hover:outline hover:outline-1 hover:outline-cyan-400 text-slate-200 hover:text-rose-400 transition"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button with Bold Quantity */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:outline hover:outline-1 hover:outline-cyan-400 transition"
            >
              <div className="relative">
                <ShoppingCart className="w-7 h-7 text-white" />
                <span className="absolute -top-1 left-3 bg-cyan-500 text-slate-950 text-xs font-black rounded-full px-1.5 py-0.2 shadow">
                  {cartCount}
                </span>
              </div>
              <span className="text-xs font-black hidden sm:inline text-white mt-2">
                Cart
              </span>
            </button>

          </div>

        </div>
      </div>

      {/* 2. Amazon-style Sub-navigation Category Bar (Midnight Slate Lighter) */}
      <div className="bg-[#1e293b] text-slate-200 px-3 sm:px-6 py-2 border-t border-slate-700/60 text-xs">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-4 overflow-x-auto">
          
          <div className="flex items-center gap-3 sm:gap-5 whitespace-nowrap">
            {/* "All" Category Hamburger */}
            <button
              onClick={() => onSelectCategory('All')}
              className={`flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-md transition ${
                selectedCategory === 'All'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'hover:outline hover:outline-1 hover:outline-cyan-400'
              }`}
            >
              <Menu className="w-3.5 h-3.5" />
              <span>All Products</span>
            </button>

            {/* Category links inspired by Amazon pills */}
            {categories?.filter(c => c !== 'All').map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`font-semibold px-2 py-1 rounded-md transition ${
                  selectedCategory === cat
                    ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold'
                    : 'text-slate-300 hover:text-white hover:underline'
                }`}
              >
                {cat}
              </button>
            ))}

            <button
              onClick={onOpenTracking}
              className="flex items-center gap-1 text-slate-300 hover:text-cyan-400 font-medium px-2 py-1"
            >
              <Truck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Track Orders</span>
            </button>
          </div>

          {/* View Tab Switcher: Storefront vs Merchant Dashboard */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-slate-900 rounded-lg p-0.5 border border-slate-700 flex">
              <button
                onClick={() => onTabChange('store')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold transition ${
                  activeTab === 'store'
                    ? 'bg-cyan-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Storefront
              </button>
              <button
                onClick={() => onTabChange('admin')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-bold transition ${
                  activeTab === 'admin'
                    ? 'bg-cyan-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3 h-3 text-cyan-300" />
                Merchant Hub
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
