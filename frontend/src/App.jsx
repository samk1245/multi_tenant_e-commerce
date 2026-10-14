import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  TrendingUp,
  X,
  Layers,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from './api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import MerchantDashboard from './components/MerchantDashboard';
import CreateStoreModal from './components/CreateStoreModal';
import AuthModal from './components/AuthModal';
import OrderTrackingModal from './components/OrderTrackingModal';
import WishlistModal from './components/WishlistModal';

export default function App() {
  const [tenants, setTenants] = useState([]);
  const [activeTenant, setActiveTenant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // User & Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('omnistore_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState('New York, 10001');

  // Filters, Autocomplete & Search
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all'); // 'all', 'under50', '50to150', 'above150'
  const searchContainerRef = useRef(null);

  // Cart & Wishlist
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [isCreateStoreOpen, setIsCreateStoreOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('store'); // 'store' | 'admin'

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
        console.error('Failed to load tenants:', err);
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
        setSelectedCategory('All');
        setSearch('');
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [activeTenant?._id]);

  // Debounced search suggestions lookup
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (search.trim().length > 1 && activeTenant) {
        const list = await api.getSearchSuggestions(search, activeTenant.slug);
        setSuggestions(list);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [search, activeTenant?.slug]);

  // Derived categories for the active store
  const categories = ['All', ...new Set(products.map((p) => p.category))];

  // Filtered & Sorted products
  const filteredProducts = products
    .filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()) ||
        p.brand?.toLowerCase().includes(search.toLowerCase());

      let matchesPrice = true;
      if (priceRange === 'under50') matchesPrice = p.price < 50;
      else if (priceRange === '50to150') matchesPrice = p.price >= 50 && p.price <= 150;
      else if (priceRange === 'above150') matchesPrice = p.price > 150;

      return matchesCategory && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // default featured
    });

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

  // Wishlist toggle
  const handleToggleWishlist = async (product) => {
    const isExisted = wishlist.some((w) => w._id === product._id);
    if (isExisted) {
      setWishlist((prev) => prev.filter((w) => w._id !== product._id));
    } else {
      setWishlist((prev) => [product, ...prev]);
    }

    if (currentUser) {
      try {
        await api.toggleWishlist(product._id);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleStartCheckout = (data) => {
    setCheckoutData(data);
    setIsCartOpen(false);
    setOrderSuccess(null);
  };

  const handlePlaceOrder = async (customerData) => {
    if (!activeTenant || !checkoutData) return;

    try {
      const orderPayload = {
        tenantId: activeTenant._id,
        customer: customerData,
        couponCode: checkoutData.appliedCoupon || '',
        items: checkoutData.items.map((i) => ({
          productId: i._id,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          thumbnail: i.thumbnail || (i.images && i.images[0]),
        })),
        paymentMethod: customerData.paymentMethod || 'card',
        subtotal: checkoutData.subtotal,
        shipping: checkoutData.shipping,
        tax: checkoutData.tax,
        totalAmount: checkoutData.total,
      };

      const res = await api.createOrder(activeTenant._id, orderPayload);
      if (res.success) {
        setOrderSuccess(res.data);
        setCart([]); // Clear cart
      } else {
        alert(res.message || 'Failed to place order');
      }
    } catch (err) {
      alert('Error placing order: ' + err.message);
    }
  };

  const handleStoreCreated = (newStore) => {
    setTenants((prev) => [newStore, ...prev]);
    setActiveTenant(newStore);
  };

  const handleLogout = () => {
    localStorage.removeItem('omnistore_token');
    localStorage.removeItem('omnistore_user');
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Main Navigation */}
      <Navbar
        tenants={tenants}
        activeTenant={activeTenant}
        onSelectTenant={setActiveTenant}
        cartCount={cart.reduce((c, i) => c + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenCreateStore={() => setIsCreateStoreOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        deliveryLocation={deliveryLocation}
        onSelectLocation={setDeliveryLocation}
      />

      {/* Main Content View */}
      <main className="flex-1 pb-20">
        {activeTab === 'store' ? (
          <div>
            {/* Store Hero Banner */}
            <Hero tenant={activeTenant} />

            {/* Filter & Catalog Controls (Amazon/Flipkart inspired) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-neutral-800">
                
                {/* Search Bar with Autocomplete Suggestions */}
                <div ref={searchContainerRef} className="relative flex-1 max-w-lg">
                  <div className="relative">
                    <Search className="w-4 h-4 text-neutral-500 absolute left-4 top-3.5" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                      placeholder={`Search in ${activeTenant?.name || 'store'} (e.g. shoes, coffee, ceramics)...`}
                      className="w-full pl-11 pr-10 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition shadow-inner"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="absolute right-3.5 top-3.5 text-neutral-500 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Autocomplete Dropdown */}
                  <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute left-0 right-0 mt-2 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl py-2 z-30"
                      >
                        <div className="px-4 py-1 text-[10px] font-black uppercase text-neutral-500 tracking-wider">
                          Suggested Matching Products
                        </div>
                        {suggestions.map((item) => (
                          <div
                            key={item._id}
                            onClick={() => {
                              setViewProduct(item);
                              setShowSuggestions(false);
                            }}
                            className="flex items-center justify-between px-4 py-2 hover:bg-neutral-800 cursor-pointer transition text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              {item.thumbnail && (
                                <img
                                  src={item.thumbnail}
                                  alt=""
                                  className="w-7 h-7 rounded-lg object-cover"
                                />
                              )}
                              <span className="font-bold text-white">{item.title}</span>
                              <span className="text-[10px] text-neutral-400">({item.category})</span>
                            </div>
                            <span className="font-mono font-bold text-emerald-400">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Filter Chips & Sorting */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-md">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition whitespace-nowrap ${
                          selectedCategory === cat
                            ? 'bg-emerald-500 text-neutral-950 shadow-md'
                            : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Price Filter Selector */}
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="border border-neutral-800 bg-neutral-900 rounded-xl px-3 py-2 text-xs text-neutral-300 font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Prices</option>
                    <option value="under50">Under $50</option>
                    <option value="50to150">$50 to $150</option>
                    <option value="above150">Above $150</option>
                  </select>

                  {/* Sort selector */}
                  <div className="flex items-center gap-2 border border-neutral-800 bg-neutral-900 rounded-xl px-3 py-2 text-xs">
                    <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-neutral-300 font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="featured" className="bg-neutral-900">Featured</option>
                      <option value="price-low" className="bg-neutral-900">Price: Low to High</option>
                      <option value="price-high" className="bg-neutral-900">Price: High to Low</option>
                      <option value="rating" className="bg-neutral-900">Highest Rated</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Products Catalog Grid */}
              <div className="mt-8">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="h-96 rounded-3xl bg-neutral-900/50 animate-pulse border border-neutral-800"
                      />
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-20 bg-neutral-900/40 rounded-3xl border border-neutral-800/80">
                    <p className="text-4xl mb-2">🔍</p>
                    <h3 className="text-lg font-bold text-white">No products match your criteria</h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Try resetting your price filter or search query.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onQuickView={setViewProduct}
                        onToggleWishlist={handleToggleWishlist}
                        isWishlisted={wishlist.some((w) => w._id === product._id)}
                      />
                    ))}
                  </div>
                )}
              </div>
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

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={!!checkoutData}
        onClose={() => setCheckoutData(null)}
        cartData={checkoutData}
        onPlaceOrder={handlePlaceOrder}
        orderSuccess={orderSuccess}
        currentUser={currentUser}
      />

      {/* Quick View Product Modal */}
      <ProductModal
        product={viewProduct}
        isOpen={!!viewProduct}
        onClose={() => setViewProduct(null)}
        onAddToCart={handleAddToCart}
        onReviewSubmitted={(updated) => {
          setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
          setViewProduct(updated);
        }}
      />

      {/* Create New Store Modal */}
      <CreateStoreModal
        isOpen={isCreateStoreOpen}
        onClose={() => setIsCreateStoreOpen(false)}
        onStoreCreated={handleStoreCreated}
      />

      {/* Customer Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
        currentUser={currentUser}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onAddToCart={handleAddToCart}
        onRemoveWishlist={(id) => setWishlist((prev) => prev.filter((w) => w._id !== id))}
      />

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-10 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛍️</span>
            <span className="font-black text-white text-sm">OmniStore Next-Gen Marketplace</span>
          </div>
          <div className="flex gap-6 text-[11px] text-neutral-400 font-semibold">
            <span>Multi-Tenant Architecture</span>
            <span>Verified Adapters</span>
            <span>Live Carrier Tracking</span>
            <span>Real-Time Catalog Sync</span>
          </div>
          <p className="text-[11px] text-neutral-600">&copy; {new Date().getFullYear()} OmniStore Platform.</p>
        </div>
      </footer>
    </div>
  );
}
