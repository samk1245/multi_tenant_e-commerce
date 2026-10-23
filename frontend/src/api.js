const BASE_URL = 'http://localhost:5000/api';

export const api = {
  async getTenants() {
    const res = await fetch(`${BASE_URL}/tenants`);
    const data = await res.json();
    return data.data || [];
  },

  async createTenant(tenantData) {
    const res = await fetch(`${BASE_URL}/tenants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tenantData),
    });
    return await res.json();
  },

  async updateTenant(id, tenantData) {
    const res = await fetch(`${BASE_URL}/tenants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tenantData),
    });
    return await res.json();
  },

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

  async createProduct(tenantId, productData) {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
      },
      body: JSON.stringify({ ...productData, tenantId }),
    });
    return await res.json();
  },

  async deleteProduct(productId) {
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
      method: 'DELETE',
    });
    return await res.json();
  },

  async getProduct(productId) {
    const res = await fetch(`${BASE_URL}/products/${productId}`);
    return await res.json();
  },

  async addProductReview(productId, reviewData) {
    const res = await fetch(`${BASE_URL}/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    return await res.json();
  },

  async getTenantAnalytics(tenantId) {
    const res = await fetch(`${BASE_URL}/tenants/${tenantId}/analytics`);
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
      },
      body: JSON.stringify({ ...orderData, tenantId }),
    });
    return await res.json();
  },

  async getUserOrders(email) {
    const res = await fetch(`${BASE_URL}/orders?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    return data.data || [];
  },

  async getOrderTracking(orderId) {
    const res = await fetch(`${BASE_URL}/orders/${orderId}/tracking`);
    return await res.json();
  },

  async createTicket(ticketData) {
    const res = await fetch(`${BASE_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData),
    });
    return await res.json();
  },

  async getUserTickets(email) {
    const res = await fetch(`${BASE_URL}/tickets?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    return data.data || [];
  },

  async getAddresses(email = 'customer@example.com') {
    try {
      const res = await fetch(`${BASE_URL}/auth/addresses?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  async addAddress(email = 'customer@example.com', addressData) {
    const res = await fetch(`${BASE_URL}/auth/addresses?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...addressData, email }),
    });
    return await res.json();
  },

  async updateAddress(email = 'customer@example.com', addressId, addressData) {
    const res = await fetch(`${BASE_URL}/auth/addresses/${addressId}?email=${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressData),
    });
    return await res.json();
  },

  async deleteAddress(email = 'customer@example.com', addressId) {
    const res = await fetch(`${BASE_URL}/auth/addresses/${addressId}?email=${encodeURIComponent(email)}`, {
      method: 'DELETE',
    });
    return await res.json();
  },

  async setDefaultAddress(email = 'customer@example.com', addressId) {
    const res = await fetch(`${BASE_URL}/auth/addresses/${addressId}/default?email=${encodeURIComponent(email)}`, {
      method: 'PATCH',
    });
    return await res.json();
  },
};
