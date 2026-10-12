import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { api } from './api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import MerchantDashboard from './components/MerchantDashboard';
import CreateStoreModal from './components/CreateStoreModal';

export default function App() {
  const [tenants, setTenants] = useState([]);
  const [activeTenant, setActiveTenant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  // Cart & UI Modals
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
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
        setSelectedCategory('All');
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
  const categories = ['All', ...new Set(products.map((p) => p.category))];

  // Filtered & Sorted products
  const filteredProducts = products
    .filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
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
        items: checkoutData.items.map((i) => ({
          productId: i._id,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          thumbnail: i.thumbnail || i.images?.[0],
        })),
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

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
      {/* Top Navbar */}
      <Navbar
        tenants={tenants}
        activeTenant={activeTenant}
        onSelectTenant={setActiveTenant}
        cartCount={cart.reduce((c, i) => c + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenCreateStore={() => setIsCreateStoreOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'store' ? (
          <div>
            {/* Store Hero Banner */}
            <Hero tenant={activeTenant} />

            {/* Filter & Catalog Controls */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-neutral-800">
                
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={`Search ${activeTenant?.name || 'catalog'}...`}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition shadow-inner"
                  />
                </div>

                {/* Categories & Sorting */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                          selectedCategory === cat
                            ? 'bg-emerald-500 text-neutral-950 shadow-md'
                            : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Sort selector */}
                  <div className="flex items-center gap-2 border border-neutral-800 bg-neutral-900 rounded-lg px-3 py-1.5 text-xs">
                    <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-neutral-300 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="featured" className="bg-neutral-900">Featured</option>
                      <option value="price-low" className="bg-neutral-900">Price: Low to High</option>
                      <option value="price-high" className="bg-neutral-900">Price: High to Low</option>
                      <option value="rating" className="bg-neutral-900">Highest Rated</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Products Grid */}
              <div className="mt-8">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="h-96 rounded-2xl bg-neutral-900/50 animate-pulse border border-neutral-800" />
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-20 bg-neutral-900/40 rounded-3xl border border-neutral-800/80">
                    <p className="text-4xl mb-2">🔍</p>
                    <h3 className="text-lg font-bold text-white">No products found</h3>
                    <p className="text-xs text-neutral-400 mt-1">Try relaxing your search terms or category filter.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onQuickView={setViewProduct}
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
      />

      {/* Quick View Product Modal */}
      <ProductModal
        product={viewProduct}
        isOpen={!!viewProduct}
        onClose={() => setViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Create New Store Modal */}
      <CreateStoreModal
        isOpen={isCreateStoreOpen}
        onClose={() => setIsCreateStoreOpen(false)}
        onStoreCreated={handleStoreCreated}
      />

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-8 text-center text-xs text-neutral-500">
        <p className="font-semibold text-neutral-400">OmniStore &bull; Enterprise Multi-Tenant E-Commerce Platform</p>
        <p className="mt-1">Isolated Databases &bull; Subdomain Multi-tenancy &bull; Merchant Dashboards</p>
      </footer>
    </div>
  );
}
