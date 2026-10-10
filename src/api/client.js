/**
 * Nailsbyhelina Frontend-to-Backend API Client
 * Seamlessly interfaces with backend REST API (/api/*) and Supabase
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.error || `API Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.warn(`[API Client] ${endpoint} request failed:`, err.message);
    throw err;
  }
}

export const apiClient = {
  /**
   * Health & Backend Status Check
   */
  async getHealth() {
    return request('/health');
  },

  /**
   * Fetch Products from Backend API
   */
  async getProducts({ category, search } = {}) {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await request(`/products${queryString}`);
    return res?.products || [];
  },

  /**
   * Get Single Product by ID or Slug
   */
  async getProduct(idOrSlug) {
    const res = await request(`/products/${encodeURIComponent(idOrSlug)}`);
    return res?.product || null;
  },

  /**
   * Fetch Categories from Backend API
   */
  async getCategories() {
    const res = await request('/categories');
    return res?.categories || [];
  },

  /**
   * Fetch Global Site Settings
   */
  async getSettings() {
    const res = await request('/settings');
    return res?.settings || null;
  },

  /**
   * Update Global Site Settings (Admin)
   */
  async updateSettings(data) {
    return request('/settings', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Fetch All Orders (Admin or Customer)
   */
  async getOrders() {
    const res = await request('/orders');
    return res?.orders || [];
  },

  /**
   * Create New Order via Backend API
   */
  async createOrder(orderData) {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  /**
   * Track Single Order by Order Number (e.g. NH-12345 or HLN-582914)
   */
  async trackOrder(orderNumber) {
    const res = await request(`/orders/${encodeURIComponent(orderNumber)}`);
    return res?.order || null;
  },

  /**
   * Submit Customer Inquiry (Contact Form)
   */
  async submitContact(inquiryData) {
    return request('/contact', {
      method: 'POST',
      body: JSON.stringify(inquiryData)
    });
  },

  /**
   * Subscribe to Newsletter
   */
  async subscribeNewsletter(email) {
    return request('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }
};
