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
};
