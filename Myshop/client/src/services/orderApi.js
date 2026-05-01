import api from "./api";

const orderApi = {
  checkout(payload) {
    return api.post("/orders/checkout", payload);
  },
  paymentSuccess(id, payload) {
    return api.post(`/orders/${id}/payment-success`, payload);
  },
  paymentFailed(id, payload) {
    return api.post(`/orders/${id}/payment-failed`, payload);
  },
  markProcessing(id) {
    return api.post(`/orders/${id}/processing`);
  },
  ship(id, payload) {
    return api.post(`/orders/${id}/ship`, payload);
  },
  deliver(id) {
    return api.post(`/orders/${id}/deliver`);
  },
    getMyOrders() {
      return api.get("/orders/my-orders");
    },
};

export default orderApi;
