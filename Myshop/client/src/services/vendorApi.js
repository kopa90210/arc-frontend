


import api from "./api";  // to ensure API_HOST is loaded if needed


function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default {
  // ── Profile ───────────────────────────────────────────────────────────────
  getProfile: () => api.get("/vendors/profile", { headers: authHeaders() }),
  saveProfile: (data) => api.post("/vendors/profile", data, { headers: authHeaders() }),

  // ── Vendor products ───────────────────────────────────────────────────────
  getProducts() {
    return api.get("/vendors/products", { headers: authHeaders() });
  },
  createProduct(formData) {
    return api.post("/vendors/products", formData, { headers: authHeaders() });
  },
  updateProduct(id, formData) {
    return api.put(`/vendors/products/${id}`, formData, { headers: authHeaders() });
  },
  deleteProduct(id) {
    return api.delete(`/vendors/products/${id}`, { headers: authHeaders() });
  },

  // ── Vendor orders ─────────────────────────────────────────────────────────
  // GET api/vendors/orders
  getOrders() {
    return api.get("/vendors/orders", { headers: authHeaders() });
  },
  // POST api/vendors/orders/{id}/processing
  markProcessing(id) {
    return api.post(`/vendors/orders/${id}/processing`, {}, { headers: authHeaders() });
  },
  // POST api/vendors/orders/{id}/ship
  shipOrder(id, trackingNumber, carrier) {
    return api.post(
      `/vendors/orders/${id}/ship`,
      { trackingNumber, carrier },
      { headers: authHeaders() }
    );
  },
  // POST api/vendors/orders/{id}/deliver
  deliverOrder(id) {
    return api.post(`/vendors/orders/${id}/deliver`, {}, { headers: authHeaders() });
  },

  //  getOrders: () =>
  //   api.get("/vendors/orders"),

  getRevenueChart: (range = "This Week") =>
    api.get(`/vendors/analytics/revenue?range=${encodeURIComponent(range)}`, { headers: authHeaders() }),
  // Returns: [{ day: "Mon", revenue: 210 }, ...]

  getTopProducts: () =>
    api.get("/vendors/products/top-selling", { headers: authHeaders() }),
  // Returns: [{ rank: 1, name: "Silk Gown", units: 124 }, ...]

  getLatestReview: () =>
    api.get("/vendors/reviews/latest", { headers: authHeaders() }),
  // Returns: { author, stars, text, initials }
};
