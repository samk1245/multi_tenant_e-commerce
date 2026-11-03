import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Store,
  Shield,
  Sparkles,
  ChevronDown,
  Plus,
  LayoutDashboard,
  ShoppingCart,
  User,
  Flame,
  Heart,
  Truck,
  Scale,
  Search,
  X,
  ShieldAlert,
  Sun,
  Moon,
  ArrowRight,
} from 'lucide-react';
import { api } from '../api';
import { formatCurrency } from '../utils/formatters';

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
  onSelectProduct,
  themeMode,
  onToggleTheme,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  // Autocomplete debounced lookup
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await api.getSearchSuggestions(searchQuery.trim());
        setSuggestions(results);
      } catch (e) {
        console.warn("Search suggestions error:", e);
      } finally {
        setIsSearching(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Announcement Bar */}
      {announcementVisible && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white text-xs font-bold py-1.5 px-4 flex items-center justify-between shadow-md relative z-50">
          <div className="flex-1 flex items-center justify-center gap-2 text-center text-[11px] sm:text-xs">
            <span className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
              <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
              <span>Festive Mega Sale</span>
            </span>
            <span>
              Flat 20% Instant Discount on orders over ₹2,499! Use code <span className="underline font-mono font-black text-amber-200">FESTIVE20</span>
            </span>
          </div>
          <button
            onClick={() => setAnnouncementVisible(false)}
            className="text-white/80 hover:text-white p-0.5 rounded-md hover:bg-black/10 transition cursor-pointer"
            title="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-40 bg-neutral-900/90 backdrop-blur-xl border-b border-neutral-800/80 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-3 sm:gap-4">
            
            {/* Left: Brand & Store Selector */}
            <div className="flex items-center gap-2.5 sm:gap-4 flex-shrink-0">
              <div
                onClick={() => onTabChange('store')}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <span className="text-2xl p-2 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-inner group-hover:scale-105 transition-transform flex items-center justify-center">
                  {activeTenant?.logo || '🛍️'}
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-emerald-400 transition">
                      {activeTenant?.name || 'OmniCommerce'}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline-block">
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 hidden sm:block truncate max-w-[180px]">
                    {activeTenant?.tagline || 'Curated flagship store'}
                  </p>
                </div>
              </div>

              {/* Store Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition shadow-sm cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">14 Stores</span>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-80 max-h-[80vh] overflow-y-auto rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl py-2 z-50">
                    <div className="px-3.5 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Flagship Brand Stores</span>
                      <span className="text-emerald-400 font-mono">{tenants.length} Active</span>
                    </div>

                    <div className="divide-y divide-neutral-800/60">
                      {tenants.map((t) => (
                        <button
                          key={t._id}
                          onClick={() => {
                            onSelectTenant(t);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between hover:bg-neutral-800 transition cursor-pointer ${
                            activeTenant?._id === t._id ? 'bg-neutral-800/90 text-white font-bold' : 'text-neutral-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xl p-1.5 rounded-xl bg-neutral-950 border border-neutral-800 flex-shrink-0">
                              {t.logo || '🏪'}
                            </span>
                            <div className="truncate">
                              <div className="text-xs font-bold text-white truncate">{t.name}</div>
                              <div className="text-[10px] text-emerald-400 font-medium truncate">{t.category}</div>
                            </div>
                          </div>
                          {activeTenant?._id === t._id && (
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 flex-shrink-0 ml-2" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-neutral-800 mt-2 pt-2 px-2">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onOpenCreateStore();
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-neutral-950 text-xs font-black transition cursor-pointer shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Launch New Storefront</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Middle: Autocomplete Search Input */}
            <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 125+ products across all 14 stores..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSuggestions([]);
                    }}
                    className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Instant Search Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl p-2 z-50 overflow-hidden space-y-1">
                  <div className="px-3 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Instant Matches</span>
                    <span className="text-emerald-400">{suggestions.length} items</span>
                  </div>
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={async () => {
                        const fullProd = await api.getProduct(item.id);
                        if (fullProd.success && onSelectProduct) {
                          onSelectProduct(fullProd.data);
                        }
                        setSuggestions([]);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-800 transition cursor-pointer"
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-10 h-10 object-cover rounded-lg bg-neutral-950"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                        <span className="text-[10px] text-neutral-400">{item.category}</span>
                      </div>
                      <span className="text-xs font-black text-emerald-400 font-mono">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: View Mode Tabs, Quick Actions, Wishlist & Cart */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
              
              {/* 3-Tab View Switcher */}
              <div className="flex p-0.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <button
                  onClick={() => onTabChange('store')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'store'
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Consumer Storefront"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden xl:inline">Store</span>
                </button>

                <button
                  onClick={() => onTabChange('admin')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Merchant Seller Studio"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden xl:inline">Seller</span>
                </button>

                <button
                  onClick={() => onTabChange('superadmin')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'superadmin'
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Super-Admin Platform Hub"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden xl:inline">Admin</span>
                </button>
              </div>

              {/* Theme Toggle (Dark / Light) */}
              <button
                onClick={onToggleTheme}
                className="p-2 rounded-xl bg-neutral-800/90 hover:bg-neutral-700 text-neutral-300 hover:text-amber-400 border border-neutral-700/80 transition cursor-pointer"
                title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {themeMode === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
              </button>

              {/* Live Track Shipment Button */}
              <button
                onClick={onOpenTracker}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800/90 hover:bg-neutral-700 text-neutral-300 hover:text-emerald-400 border border-neutral-700/80 transition text-xs font-bold cursor-pointer"
                title="Track any parcel by Order # or AWB"
              >
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden lg:inline">Track</span>
              </button>

              {/* Compare Button */}
              {activeTab === 'store' && compareCount > 0 && (
                <button
                  onClick={onOpenCompare}
                  className="relative flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 transition text-xs font-bold cursor-pointer animate-pulse"
                  title="View Product Comparison"
                >
                  <Scale className="w-3.5 h-3.5 text-purple-400" />
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-purple-500 text-white text-[10px] font-black">
                    {compareCount}
                  </span>
                </button>
              )}

              {/* Wishlist Button */}
              {activeTab === 'store' && (
                <button
                  onClick={onOpenWishlist}
                  className="relative flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-neutral-800/90 hover:bg-neutral-700 text-neutral-300 hover:text-rose-400 border border-neutral-700/80 transition text-xs font-bold cursor-pointer"
                  title="Saved Wishlist"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
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
                className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-neutral-800/90 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700/80 transition text-xs font-bold cursor-pointer"
                title="My Account, Addresses, Orders & Rewards"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Account</span>
              </button>

              {/* Shopping Cart Button */}
              {activeTab === 'store' && (
                <button
                  onClick={onOpenCart}
                  className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-black text-xs transition shadow-md active:scale-95 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">Cart</span>
                  {cartCount > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-950 text-emerald-400 text-[11px] font-black shadow">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

            </div>

          </div>
        </div>
      </header>
    </>
  );
}
