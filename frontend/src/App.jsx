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
  Zap,
  Shield,
  Truck,
  RotateCcw,
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
  const [deliveryLocation, setDeliveryLocation] = useState('Mumbai, 400001');

  // Filters, Autocomplete & Search
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');

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
  const [activeTab, setActiveTab] = useState('store');

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
      if (priceRange === 'under1000') matchesPrice = p.price < 1000;
      else if (priceRange === '1000to5000') matchesPrice = p.price >= 1000 && p.price <= 5000;
      else if (priceRange === '5000to15000') matchesPrice = p.price > 5000 && p.price <= 15000;
      else if (priceRange === 'above15000') matchesPrice = p.price > 15000;

      return matchesCategory && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
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
        paymentMethod: customerData.paymentMethod || 'online',
        subtotal: checkoutData.subtotal,
        shipping: checkoutData.shipping,
        tax: checkoutData.tax,
        totalAmount: checkoutData.total,
      };

      const res = await api.createOrder(activeTenant._id, orderPayload);
      if (res.success) {
        setOrderSuccess(res.data);
        setCart([]);
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
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 selection:bg-cyan-400 selection:text-slate-950">
      {/* Top Amazon-style Navbar */}
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
        search={search}
        setSearch={setSearch}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        onSelectSuggestion={(item) => {
          setViewProduct(item);
          setShowSuggestions(false);
        }}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main Content View */}
      <main className="flex-1 pb-16">
        {activeTab === 'store' ? (
          <div>
            {/* Amazon-style Promotional Banner */}
            <Hero tenant={activeTenant} />

            {/* Marketplace Body Container */}
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
              
              {/* Category Quick Shortcut Strip (Flipkart/Amazon circle style) */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-6 flex items-center justify-between gap-4 overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex flex-col items-center gap-1.5 min-w-[70px] py-1 px-2 rounded-xl transition ${
                      selectedCategory === cat
                        ? 'text-cyan-700 font-extrabold'
                        : 'text-slate-600 hover:text-slate-900 font-semibold'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg border transition ${
                        selectedCategory === cat
                          ? 'bg-cyan-50 border-cyan-500 shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat === 'All' ? '⚡' : cat.includes('Coffee') ? '☕' : cat.includes('Tops') || cat.includes('Runners') ? '👟' : '🛋️'}
                    </div>
                    <span className="text-[11px] whitespace-nowrap">{cat}</span>
                  </button>
                ))}
              </div>

              {/* Filter & Sorting Controls Strip */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="text-xs text-slate-600">
                  Showing <strong className="text-slate-900">{filteredProducts.length}</strong> items in{' '}
                  <span className="text-cyan-700 font-bold">{selectedCategory}</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Price Filter Selector */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-500 font-semibold">Price:</span>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                    >
                      <option value="all">All Prices</option>
                      <option value="under1000">Under ₹1,000</option>
                      <option value="1000to5000">₹1,000 to ₹5,000</option>
                      <option value="5000to15000">₹5,000 to ₹15,000</option>
                      <option value="above15000">Above ₹15,000</option>
                    </select>
                  </div>

                  {/* Sort selector */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-500 font-semibold">Sort:</span>
                    <div className="flex items-center gap-1.5 border border-slate-200 bg-slate-50 rounded-xl px-3 py-2">
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Avg. Customer Review</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Catalog Grid */}
              <div>
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="h-96 rounded-2xl bg-white border border-slate-200 animate-pulse"
                      />
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-5xl mb-3">🔍</p>
                    <h3 className="text-lg font-bold text-slate-900">No matching products found</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Try clearing your search terms or selecting "All Prices".
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

      {/* Amazon-style Structured Footer */}
      <footer className="bg-[#0f172a] text-slate-300 text-xs">
        {/* Back to top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-full py-3.5 bg-[#1e293b] hover:bg-slate-700 text-center font-bold text-white transition text-xs"
        >
          Back to top
        </button>

        <div className="max-w-[1500px] mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-slate-800">
          <div>
            <h5 className="font-black text-white text-sm mb-3">Get to Know Us</h5>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white cursor-pointer">About Multi-Tenant Market</li>
              <li className="hover:text-white cursor-pointer">Careers & Leadership</li>
              <li className="hover:text-white cursor-pointer">Press Releases</li>
              <li className="hover:text-white cursor-pointer">Omni Science</li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-white text-sm mb-3">Connect with Us</h5>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white cursor-pointer">Facebook</li>
              <li className="hover:text-white cursor-pointer">Twitter / X</li>
              <li className="hover:text-white cursor-pointer">Instagram</li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-white text-sm mb-3">Make Money with Us</h5>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white cursor-pointer" onClick={() => setIsCreateStoreOpen(true)}>
                Sell on OmniMarket
              </li>
              <li className="hover:text-white cursor-pointer">Protect and Build Your Brand</li>
              <li className="hover:text-white cursor-pointer">Supply to OmniMarket</li>
              <li className="hover:text-white cursor-pointer">Fulfillment by Omni</li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-white text-sm mb-3">Let Us Help You</h5>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white cursor-pointer" onClick={() => setIsAuthOpen(true)}>Your Account</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setIsTrackingOpen(true)}>Returns Centre & Tracking</li>
              <li className="hover:text-white cursor-pointer">100% Purchase Protection</li>
              <li className="hover:text-white cursor-pointer">Help & FAQs</li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1500px] mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛍️</span>
            <span className="font-black text-white text-sm">OmniMarket Prime</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer">Conditions of Use & Sale</span>
            <span className="hover:text-white cursor-pointer">Privacy Notice</span>
            <span className="hover:text-white cursor-pointer">Interest-Based Ads</span>
          </div>
          <p>© {new Date().getFullYear()}, OmniMarket.in, Inc. or its affiliates</p>
        </div>
      </footer>
    </div>
  );
}
