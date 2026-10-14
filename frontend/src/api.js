const BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('omnistore_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('omnistore_token', data.token);
      localStorage.setItem('omnistore_user', JSON.stringify(data.user));
    }
    return data;
  },

  async register(name, email, password) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role: 'customer' }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('omnistore_token', data.token);
      localStorage.setItem('omnistore_user', JSON.stringify(data.user));
    }
    return data;
  },

  async getMe() {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { ...getAuthHeaders() },
    });
    return await res.json();
  },

  async updateProfile(profileData) {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (data.success && data.data) {
      localStorage.setItem('omnistore_user', JSON.stringify(data.data));
    }
    return data;
  },

  async toggleWishlist(productId) {
    const res = await fetch(`${BASE_URL}/auth/wishlist/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ productId }),
    });
    return await res.json();
  },

  async getMyOrders() {
    const res = await fetch(`${BASE_URL}/auth/orders`, {
      headers: { ...getAuthHeaders() },
    });
    const data = await res.json();
    return data.data || [];
  },

  // Tenants
  async getTenants() {
    const res = await fetch(`${BASE_URL}/tenants`);
    const data = await res.json();
    return data.data || [];
  },

  async createTenant(tenantData) {
    const res = await fetch(`${BASE_URL}/tenants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(tenantData),
    });
    return await res.json();
  },

  async updateTenant(id, tenantData) {
    const res = await fetch(`${BASE_URL}/tenants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(tenantData),
    });
    return await res.json();
  },

  // Products
  async getProducts(tenantSlug, queryParams = {}) {
    const params = new URLSearchParams(queryParams);
    if (tenantSlug) params.append('tenantSlug', tenantSlug);

    const res = await fetch(`${BASE_URL}/products?${params.toString()}`, {
      headers: {
        'x-tenant-slug': tenantSlug || '',
      },
    });
    const data = await res.json();
    return data.data || [];
  },

  async getSearchSuggestions(query, tenantSlug) {
    if (!query || query.trim().length === 0) return [];
    const params = new URLSearchParams({ q: query });
    if (tenantSlug) params.append('tenantSlug', tenantSlug);

    try {
      const res = await fetch(`${BASE_URL}/products/suggestions?${params.toString()}`);
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  async addProductReview(productId, reviewData) {
    const res = await fetch(`${BASE_URL}/products/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(reviewData),
    });
    return await res.json();
  },

  async createProduct(tenantId, productData) {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ ...productData, tenantId }),
    });
    return await res.json();
  },

  async deleteProduct(productId) {
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    return await res.json();
  },

  async syncCatalog(tenantId, category = 'all') {
    const res = await fetch(`${BASE_URL}/products/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ category, limit: 12 }),
    });
    return await res.json();
  },

  // Coupons
  async validateCoupon(code, orderAmount, tenantId) {
    const res = await fetch(`${BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, orderAmount, tenantId }),
    });
    return await res.json();
  },

  // Analytics & Orders
  async getTenantAnalytics(tenantId) {
    const res = await fetch(`${BASE_URL}/tenants/${tenantId}/analytics`, {
      headers: { ...getAuthHeaders() },
    });
    const data = await res.json();
    return data.data || {
      productsCount: 0,
      totalOrders: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
      recentOrders: [],
    };
  },

  async createOrder(tenantId, orderData) {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ ...orderData, tenantId }),
    });
    return await res.json();
  },

  async getOrderTracking(orderId) {
    const res = await fetch(`${BASE_URL}/orders/${orderId}/tracking`);
    return await res.json();
  },

  async cancelOrder(orderId) {
    const res = await fetch(`${BASE_URL}/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
    });
    return await res.json();
  },
};
