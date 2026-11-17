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
  Check,
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
  const dropdownRef = useRef(null);

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
        console.warn('Search suggestions error:', e);
      } finally {
        setIsSearching(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Announcement Bar */}
      {announcementVisible && (
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-cyan-600 text-white text-xs font-bold py-1.5 px-4 flex items-center justify-between shadow-md relative z-50">
          <div className="flex-1 flex items-center justify-center gap-2 text-center text-[11px] sm:text-xs">
            <span className="flex items-center gap-1 bg-black/25 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider border border-white/10">
              <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
              <span>Festive Mega Drop</span>
            </span>
            <span>
              Flat 20% Instant Discount on orders over ₹2,499! Use code{' '}
              <span className="underline font-mono font-black text-amber-200">FESTIVE20</span>
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
      <header className="sticky top-0 z-40 bg-[#070810]/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-3 sm:gap-4">
            {/* Left: ShopSphere Logo & Tenant Brand Dropdown */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              {/* ShopSphere Platform Logo */}
              <div
                onClick={() => onTabChange('store')}
                className="flex items-center gap-2.5 cursor-pointer group"
                title="ShopSphere Digital Commerce Platform"
              >
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 shadow-md shadow-purple-600/30 group-hover:scale-105 transition-transform flex items-center justify-center">
                  <div className="w-full h-full bg-[#070810] rounded-[10px] flex items-center justify-center">
                    <span className="text-base font-black text-white tracking-tighter">S</span>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-base tracking-tight text-white group-hover:text-purple-300 transition-colors">
                      ShopSphere
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      3D
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-mono tracking-tight">
                    Multi-Tenant Cloud
                  </p>
                </div>
              </div>

              {/* Active Boutique Switcher Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 border border-white/10 transition shadow-sm cursor-pointer"
                >
                  <span className="text-base">{activeTenant?.logo || '🛍️'}</span>
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-black text-white leading-tight truncate max-w-[120px]">
                      {activeTenant?.name || 'OmniStore'}
                    </div>
                    <div className="text-[9px] text-cyan-400 font-medium">
                      {tenants.length} Boutiques
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-80 max-h-[80vh] overflow-y-auto rounded-2xl bg-[#0b0d18] border border-white/10 shadow-2xl py-2 z-50 backdrop-blur-2xl">
                    <div className="px-3.5 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between border-b border-white/5 pb-2">
                      <span>Flagship Boutiques</span>
                      <span className="text-cyan-400 font-mono">{tenants.length} Active</span>
                    </div>

                    <div className="divide-y divide-white/5 mt-1">
                      {tenants.map((t) => (
                        <button
                          key={t._id}
                          onClick={() => {
                            onSelectTenant(t);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between hover:bg-white/5 transition cursor-pointer ${
                            activeTenant?._id === t._id
                              ? 'bg-purple-600/15 text-white font-bold'
                              : 'text-neutral-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xl p-1.5 rounded-xl bg-[#050508] border border-white/10 flex-shrink-0">
                              {t.logo || '🏪'}
                            </span>
                            <div className="truncate">
                              <div className="text-xs font-bold text-white truncate">{t.name}</div>
                              <div className="text-[10px] text-cyan-400 font-medium truncate">
                                {t.category}
                              </div>
                            </div>
                          </div>
                          {activeTenant?._id === t._id && (
                            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 flex-shrink-0 ml-2 animate-pulse" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-white/10 mt-2 pt-2 px-2">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onOpenCreateStore();
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-purple-600/30"
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
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#050508]/90 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition shadow-inner"
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
                <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-[#0b0d18] border border-white/10 shadow-2xl p-2 z-50 overflow-hidden space-y-1 backdrop-blur-2xl">
                  <div className="px-3 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Instant Matches</span>
                    <span className="text-cyan-400">{suggestions.length} items</span>
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
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition cursor-pointer"
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-10 h-10 object-cover rounded-lg bg-[#050508]"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                        <span className="text-[10px] text-neutral-400">{item.category}</span>
                      </div>
                      <span className="text-xs font-black text-cyan-400 font-mono">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: View Mode Tabs, Quick Actions, Wishlist & Cart */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* 3-Role View Mode Tabs (Store, Vendor Studio, Super Admin) */}
              <div className="flex p-0.5 rounded-xl bg-[#050508] border border-white/10">
                <button
                  onClick={() => onTabChange('store')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'store'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Consumer Storefront"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-cyan-300" />
                  <span className="hidden xl:inline">Store</span>
                </button>

                <button
                  onClick={() => onTabChange('admin')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Vendor Seller Studio"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-indigo-300" />
                  <span className="hidden xl:inline">Seller</span>
                </button>

                <button
                  onClick={() => onTabChange('superadmin')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'superadmin'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Super-Admin Platform Hub"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden xl:inline">Admin</span>
                </button>
              </div>

              {/* Theme Toggle (Dark / Light) */}
              <button
                onClick={onToggleTheme}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-amber-400 border border-white/10 transition cursor-pointer"
                title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {themeMode === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                )}
              </button>

              {/* Live Track Shipment */}
              <button
                onClick={onOpenTracker}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-cyan-400 border border-white/10 transition text-xs font-bold cursor-pointer"
                title="Track any parcel by Order # or AWB"
              >
                <Truck className="w-3.5 h-3.5 text-cyan-400" />
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
                  className="relative flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-rose-400 border border-white/10 transition text-xs font-bold cursor-pointer"
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

              {/* Profile Account Button */}
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition text-xs font-bold cursor-pointer"
                title="Customer Profile, Addresses, Orders & Rewards"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Account</span>
              </button>

              {/* Shopping Cart Button */}
              {activeTab === 'store' && (
                <button
                  onClick={onOpenCart}
                  className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black text-xs transition duration-200 shadow-md shadow-purple-600/30 active:scale-95 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">Cart</span>
                  {cartCount > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#050508] text-cyan-400 text-[11px] font-black shadow-inner">
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
