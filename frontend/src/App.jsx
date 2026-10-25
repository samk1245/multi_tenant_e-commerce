import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Star, RotateCcw, Filter, Tag, Check, IndianRupee, Clock, Heart } from 'lucide-react';
import { api } from './api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import MerchantDashboard from './components/MerchantDashboard';
import CreateStoreModal from './components/CreateStoreModal';
import ProfileModal from './components/ProfileModal';
import WishlistDrawer from './components/WishlistDrawer';
import SupportWidget from './components/SupportWidget';
import ComparisonModal from './components/ComparisonModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import { formatCurrency } from './utils/formatters';

const PRICE_PRESETS = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under-1k', label: 'Under ₹1,000', min: 0, max: 1000 },
  { id: '1k-5k', label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
  { id: '5k-15k', label: '₹5,000 - ₹15,000', min: 5000, max: 15000 },
  { id: 'above-15k', label: 'Above ₹15,000', min: 15000, max: Infinity },
];

const RATING_PRESETS = [
  { id: 'all', label: 'All Ratings', min: 0 },
  { id: '4.5', label: '4.5★ & above', min: 4.5 },
  { id: '4.0', label: '4.0★ & above', min: 4.0 },
  { id: '3.5', label: '3.5★ & above', min: 3.5 },
];

export default function App() {
  const [tenants, setTenants] = useState([]);
  const [activeTenant, setActiveTenant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPricePreset, setSelectedPricePreset] = useState('all');
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Cart & UI Modals
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [isCreateStoreOpen, setIsCreateStoreOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('store'); // 'store' | 'admin'

  // Wishlist & Recently Viewed
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Product Comparison & Order Tracking States
  const [comparedProducts, setComparedProducts] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  // Load Tenants on mount
  useEffect(() => {
    async function loadTenants() {
      try {
        const tenantList = await api.getTenants();
        setTenants(tenantList);
        if (tenantList.length > 0) {
          setActiveTenant(tenantList[0]);
        }
      } catch (err) {
        console.error("Failed to load tenants:", err);
      }
    }
    loadTenants();
  }, []);

  // Load Products whenever activeTenant changes
  useEffect(() => {
    async function loadProducts() {
      if (!activeTenant) return;
      setLoading(true);
      try {
        const productList = await api.getProducts(activeTenant.slug);
        setProducts(productList);
        // Reset category and search on store change
        setSelectedCategory('All');
        setSelectedPricePreset('all');
        setMinPriceInput('');
        setMaxPriceInput('');
        setSelectedRating('all');
        setSearch('');
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [activeTenant?._id]);

  // Derived categories for the active store
  const categories = useMemo(() => {
    return ['All', ...new Set(products.map((p) => p.category))];
  }, [products]);

  // Active filters count
  const isFiltered = useMemo(() => {
    return (
      selectedCategory !== 'All' ||
      selectedPricePreset !== 'all' ||
      minPriceInput !== '' ||
      maxPriceInput !== '' ||
      selectedRating !== 'all' ||
      search.trim() !== ''
    );
  }, [selectedCategory, selectedPricePreset, minPriceInput, maxPriceInput, selectedRating, search]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedPricePreset('all');
    setMinPriceInput('');
    setMaxPriceInput('');
    setSelectedRating('all');
    setSearch('');
    setSortBy('featured');
  };

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }

        // Search filter
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchCat = p.category?.toLowerCase().includes(q);
          const matchBrand = p.brand?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat && !matchBrand) return false;
        }

        // Price range filter
        let minP = 0;
        let maxP = Infinity;

        if (minPriceInput !== '' && !isNaN(Number(minPriceInput))) {
          minP = Number(minPriceInput);
        }
        if (maxPriceInput !== '' && !isNaN(Number(maxPriceInput))) {
          maxP = Number(maxPriceInput);
        }

        if (selectedPricePreset !== 'all' && minPriceInput === '' && maxPriceInput === '') {
          const preset = PRICE_PRESETS.find((pr) => pr.id === selectedPricePreset);
          if (preset) {
            minP = preset.min;
            maxP = preset.max;
          }
        }

        if (p.price < minP || p.price > maxP) {
          return false;
        }

        // Rating filter
        if (selectedRating !== 'all') {
          const minRating = Number(selectedRating);
          if ((p.rating || 0) < minRating) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'reviews') return (b.reviewsCount || b.reviews?.length || 0) - (a.reviewsCount || a.reviews?.length || 0);
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        return 0; // default featured
      });
  }, [products, selectedCategory, search, selectedPricePreset, minPriceInput, maxPriceInput, selectedRating, sortBy]);

  // Cart operations
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
    } else {
      setCart((prev) =>
        prev.map((item) => (item._id === id ? { ...item, quantity } : item))
      );
    }
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const handleStartCheckout = (data) => {
    setCheckoutData(data);
    setIsCartOpen(false);
    setOrderSuccess(null);
  };

  const handlePlaceOrder = async (customerData) => {
    if (!activeTenant || !checkoutData) return;

    try {
      const totalDiscount = (checkoutData.discount || 0) + (customerData.appliedOmniCoins || 0);
      const computedTotal = Math.max(0, (checkoutData.total || 0) - (customerData.appliedOmniCoins || 0));

      const orderPayload = {
        tenantId: activeTenant._id,
        customer: {
          name: customerData.name || 'Rahul Verma',
          email: customerData.email || 'customer@example.com',
          phone: customerData.phone || '+91 91234 56789',
          address: customerData.address || {
            street: customerData.street || 'Flat 402, Sea View Apartments',
            city: customerData.city || 'Mumbai',
            state: customerData.state || 'Maharashtra',
            zip: customerData.zip || '400050',
            country: 'India',
          },
        },
        items: checkoutData.items.map((i) => ({
          productId: i._id,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          thumbnail: i.thumbnail || i.images?.[0],
        })),
        subtotal: checkoutData.subtotal,
        discount: totalDiscount,
        couponCode: checkoutData.couponCode || '',
        shipping: checkoutData.shipping,
        tax: checkoutData.tax,
        totalAmount: computedTotal,
        paymentMethod: customerData.paymentMethod || 'upi',
        paymentDetails: customerData.paymentDetails || {},
        currency: 'INR',
      };

      const res = await api.createOrder(activeTenant._id, orderPayload);
      if (res.success) {
        setOrderSuccess(res.data);
        setCart([]); // Clear cart
      } else {
        alert(res.message || "Failed to place order");
      }
    } catch (err) {
      alert("Error placing order: " + err.message);
    }
  };

  const handleStoreCreated = (newStore) => {
    setTenants((prev) => [newStore, ...prev]);
    setActiveTenant(newStore);
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item._id === product._id);
      if (exists) {
        return prev.filter((item) => item._id !== product._id);
      }
      return [product, ...prev];
    });
  };

  const handleRemoveFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item._id !== productId));
  };

  const handleClearWishlist = () => {
    setWishlist([]);
  };

  // Comparison Handlers
  const handleToggleCompare = (product) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p._id === product._id);
      if (exists) {
        return prev.filter((p) => p._id !== product._id);
      }
      if (prev.length >= 4) {
        alert("You can compare up to 4 products simultaneously.");
        return prev;
      }
      return [...prev, product];
    });
  };

  const handleRemoveCompare = (productId) => {
    setComparedProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  const handleClearCompare = () => {
    setComparedProducts([]);
  };

  // Quick View + Recently Viewed tracking
  const handleQuickView = (product) => {
    setViewProduct(product);
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p._id !== product._id);
      return [product, ...filtered].slice(0, 6);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
      {/* Top Navbar with Multi-Tenant Switcher, Wishlist, Profile & Cart */}
      <Navbar
        tenants={tenants}
        activeTenant={activeTenant}
        onSelectTenant={setActiveTenant}
        cartCount={cart.reduce((c, i) => c + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        compareCount={comparedProducts.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenCreateStore={() => setIsCreateStoreOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'store' ? (
          <div>
            {/* Store Hero Banner */}
            <Hero tenant={activeTenant} />

            {/* Filter & Catalog Controls */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
              
              {/* Search, Categories & Quick Sort Bar */}
              <div className="flex flex-col gap-4 pb-6 border-b border-neutral-800">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={`Search ${activeTenant?.name || 'catalog'} by title, brand, tag...`}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition shadow-inner"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-2.5 text-xs text-neutral-500 hover:text-white cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Mobile Filters Toggle & Sort */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                      className={`md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                        isFiltered
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-neutral-900 text-neutral-300 border-neutral-800'
                      }`}
                    >
                      <Filter className="w-3.5 h-3.5" />
                      <span>Filters {isFiltered && '•'}</span>
                    </button>

                    {/* Sort selector */}
                    <div className="flex items-center gap-2 border border-neutral-800 bg-neutral-900 rounded-xl px-3 py-2 text-xs">
                      <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-transparent text-neutral-300 font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="featured" className="bg-neutral-900">Featured Collections</option>
                        <option value="price-low" className="bg-neutral-900">Price: Low to High</option>
                        <option value="price-high" className="bg-neutral-900">Price: High to Low</option>
                        <option value="rating" className="bg-neutral-900">Customer Rating (Highest)</option>
                        <option value="reviews" className="bg-neutral-900">Most Customer Reviews</option>
                        <option value="newest" className="bg-neutral-900">Newest Arrivals</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Category Pills Slider */}
                <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1 mr-1">
                    <Tag className="w-3 h-3" /> Categories:
                  </span>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-emerald-500 text-neutral-950 shadow-md font-extrabold'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                    >
                      {cat}
                      {cat !== 'All' && (
                        <span className={`text-[10px] px-1 rounded ${
                          selectedCategory === cat ? 'bg-neutral-950/30 text-neutral-950' : 'bg-neutral-800 text-neutral-500'
                        }`}>
                          {products.filter((p) => p.category === cat).length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Comprehensive Secondary Filter Bar (Price Ranges & Rating Filters) */}
                <div className={`pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-4 ${showFiltersMobile ? 'block' : 'hidden md:flex'}`}>
                  
                  {/* Left: Price Range Preset Chips */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mr-1 flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" /> Price:
                    </span>
                    {PRICE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setSelectedPricePreset(preset.id);
                          setMinPriceInput('');
                          setMaxPriceInput('');
                        }}
                        className={`px-2.5 py-1 rounded-md text-xs transition cursor-pointer ${
                          selectedPricePreset === preset.id && minPriceInput === '' && maxPriceInput === ''
                            ? 'bg-neutral-100 text-neutral-950 font-bold'
                            : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}

                    {/* Custom Min / Max Price Inputs */}
                    <div className="flex items-center gap-1.5 ml-2">
                      <input
                        type="number"
                        placeholder="Min ₹"
                        value={minPriceInput}
                        onChange={(e) => {
                          setMinPriceInput(e.target.value);
                          setSelectedPricePreset('custom');
                        }}
                        className="w-18 px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                      />
                      <span className="text-neutral-500 text-xs">-</span>
                      <input
                        type="number"
                        placeholder="Max ₹"
                        value={maxPriceInput}
                        onChange={(e) => {
                          setMaxPriceInput(e.target.value);
                          setSelectedPricePreset('custom');
                        }}
                        className="w-18 px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Right: Minimum Rating Filter */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mr-1 flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Rating:
                    </span>
                    {RATING_PRESETS.map((rp) => (
                      <button
                        key={rp.id}
                        onClick={() => setSelectedRating(rp.id)}
                        className={`px-2.5 py-1 rounded-md text-xs transition flex items-center gap-1 cursor-pointer ${
                          selectedRating === rp.id
                            ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40'
                            : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                        }`}
                      >
                        {rp.label}
                      </button>
                    ))}

                    {/* Reset Filters Button */}
                    {isFiltered && (
                      <button
                        onClick={handleResetFilters}
                        className="ml-2 flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-rose-400 text-xs font-semibold transition cursor-pointer"
                        title="Clear all active filters"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>

                </div>

                {/* Filter Summary */}
                <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                  <div>
                    Showing <span className="font-bold text-white">{filteredProducts.length}</span> of {products.length} products
                    {selectedCategory !== 'All' && <span> in <span className="text-emerald-400 font-semibold">{selectedCategory}</span></span>}
                  </div>
                  {isFiltered && (
                    <span className="text-emerald-400 text-[11px] font-semibold">
                      Filters applied
                    </span>
                  )}
                </div>

              </div>

              {/* Products Grid */}
              <div className="mt-8">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <div key={n} className="h-96 rounded-2xl bg-neutral-900/50 animate-pulse border border-neutral-800" />
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-20 bg-neutral-900/40 rounded-3xl border border-neutral-800/80">
                    <p className="text-5xl mb-3">🔍</p>
                    <h3 className="text-lg font-bold text-white">No products found matching filters</h3>
                    <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                      Try adjusting or resetting your price range, star rating, or category selection.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onQuickView={handleQuickView}
                        onToggleWishlist={handleToggleWishlist}
                        isWishlisted={wishlist.some((w) => w._id === product._id)}
                        onToggleCompare={handleToggleCompare}
                        isCompared={comparedProducts.some((c) => c._id === product._id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Recently Viewed Shelf (if any) */}
              {recentlyViewed.length > 0 && (
                <div className="mt-16 pt-8 border-t border-neutral-800/80">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-base font-bold text-white">Recently Viewed Products</h3>
                    </div>
                    <span className="text-xs text-neutral-500">{recentlyViewed.length} items</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {recentlyViewed.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleQuickView(item)}
                        className="p-3 rounded-2xl bg-neutral-900/70 border border-neutral-800/80 hover:border-emerald-500/40 transition cursor-pointer flex flex-col justify-between"
                      >
                        <div className="aspect-square rounded-xl overflow-hidden bg-neutral-950 mb-2">
                          <img
                            src={item.thumbnail || item.images?.[0]}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                          <span className="text-xs text-emerald-400 font-extrabold mt-0.5 block">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        ) : (
          /* Merchant Dashboard View */
          <MerchantDashboard
            tenant={activeTenant}
            onTenantUpdated={setActiveTenant}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleStartCheckout}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlist}
        onAddToCart={handleAddToCart}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onClearWishlist={handleClearWishlist}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={!!checkoutData}
        onClose={() => setCheckoutData(null)}
        cartData={checkoutData}
        onPlaceOrder={handlePlaceOrder}
        orderSuccess={orderSuccess}
        tenant={activeTenant}
      />

      {/* Quick View Product Modal with Reviews, Wishlist & Share */}
      <ProductModal
        product={viewProduct}
        isOpen={!!viewProduct}
        onClose={() => setViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={wishlist.some((w) => w._id === viewProduct?._id)}
        onToggleCompare={handleToggleCompare}
        isCompared={comparedProducts.some((c) => c._id === viewProduct?._id)}
      />

      {/* Floating Bottom Comparison Dock */}
      {comparedProducts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-neutral-900/95 backdrop-blur-xl border border-purple-500/40 shadow-2xl rounded-2xl p-3 px-5 flex items-center gap-4 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-purple-300 flex items-center gap-1.5">
              <span>Compare:</span>
            </span>
            <div className="flex -space-x-2">
              {comparedProducts.map((p) => (
                <img
                  key={p._id}
                  src={p.thumbnail || p.images?.[0]}
                  alt={p.title}
                  className="w-8 h-8 rounded-full border-2 border-neutral-900 object-cover bg-neutral-950 shadow-md"
                  title={p.title}
                />
              ))}
            </div>
            <span className="text-xs text-neutral-300 font-bold ml-1">
              ({comparedProducts.length}/4)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCompareOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              Compare Now
            </button>
            <button
              onClick={handleClearCompare}
              className="px-2.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white text-xs font-semibold transition cursor-pointer"
              title="Clear comparison list"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Product Comparison Modal Matrix */}
      <ComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        products={comparedProducts}
        onRemoveProduct={handleRemoveCompare}
        onAddToCart={handleAddToCart}
        onClearAll={handleClearCompare}
      />

      {/* Real-time Order Shipment Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />

      {/* Create New Store Modal */}
      <CreateStoreModal
        isOpen={isCreateStoreOpen}
        onClose={() => setIsCreateStoreOpen(false)}
        onStoreCreated={handleStoreCreated}
      />

      {/* User Profile, Orders & Rewards Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        tenant={activeTenant}
        onApplyCoupon={(code) => {
          setIsCartOpen(true);
        }}
      />

      {/* 24/7 AI Customer Support & Help Center Widget */}
      <SupportWidget
        activeTenant={activeTenant}
        onOpenOrders={() => setIsProfileOpen(true)}
      />

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-10 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-semibold text-neutral-400">
            OmniStore &bull; Enterprise Multi-Tenant E-Commerce Platform
          </p>
          <div className="flex items-center gap-4 text-[11px] text-neutral-400">
            <span>₹ INR Verified Pricing</span>
            <span>&bull;</span>
            <span>24/7 AI Live Support</span>
            <span>&bull;</span>
            <span>Instant Ratings & Reviews</span>
            <span>&bull;</span>
            <span>Customer Cart & Wishlist</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
