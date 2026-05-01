// ─── All cart + checkout logic ─────────────────────────────────────────────
import { useEffect, useMemo,useState} from "react";
import api from "../services/api";
import orderApi from "../services/orderApi";
import { API_HOST } from "../config/env";
// import { statusText } from "../utils/orderHelpers";
// import { extractError } from "../utils/orderHelpers";

export function useCart() {
  const [items, setItems]           = useState([]);
  const [orderId, setOrderId]       = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [message, setMessage]       = useState("");
  const [error, setError]           = useState("");
 
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [currency, setCurrency]           = useState("EGP");
  const [shipping, setShipping] = useState({
    recipientName: "", phone: "", addressLine1: "",
    addressLine2: "", city: "", state: "", postalCode: "", country: "",
  });


   const load = async () => {
    try {
      const res = await api.get("/cart");
      setItems(res.data || []);
    } catch (err) {
      console.error("Error loading cart:", err);
    }
  };

   useEffect(() => { load(); }, []);
 
  const updateQty = async (id, qty) => {
    if (qty < 1) return;
    try {
      await api.put(`/cart/items/${id}`, { quantity: qty });
      load();
    } catch (err) { console.error(err); }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/cart/items/${id}`);
      load();
    } catch (err) { console.error(err); }
  };
 
  const total = useMemo(() =>
    items.reduce((s, i) => s + ((i.product?.price || 0) * (i.quantity || i.Quantity || 0)), 0),
    [items]
  );

   const onCheckout = async () => {
    setError(""); setMessage("");
    const payloadItems = items
      .map((i) => ({ productId: i.productId ?? i.ProductId ?? i.product?.id, quantity: i.quantity || i.Quantity || 1 }))
      .filter((i) => !!i.productId);
 
    if (payloadItems.length === 0) { setError("Cart is empty or items are invalid."); return; }
 
    setLoading(true);
    try {
      const res = await orderApi.checkout({ customerId: null, paymentMethod, currency, shipping, items: payloadItems });
      setOrderId(res.data?.id ?? res.data?.Id);
      setOrderStatus(res.data?.status ?? res.data?.Status);
      setMessage("Checkout created. Awaiting payment.");
    } catch (err) {
      const msg = err.response?.data || err.message;
      setError(typeof msg === "string" ? msg : "Checkout failed.");
    } finally { setLoading(false); }
  };
 
  const onPaymentSuccess = async () => {
    if (!orderId) return;
    setError(""); setMessage(""); setPayLoading(true);
    try {
      const res = await orderApi.paymentSuccess(orderId, { provider: paymentMethod, transactionId: `TX-${Date.now()}` });
      setOrderStatus(res.data?.status ?? res.data?.Status);
      setMessage("Payment confirmed. Stock reduced.");
      await Promise.all(items.map((it) => api.delete(`/cart/items/${it.id}`)));
      setItems([]);
    } catch (err) {
      const msg = err.response?.data || err.message;
      setError(typeof msg === "string" ? msg : "Payment confirmation failed.");
    } finally { setPayLoading(false); }
  };
 
  const onPaymentFailed = async () => {
    if (!orderId) return;
    setError(""); setMessage(""); setPayLoading(true);
    try {
      const res = await orderApi.paymentFailed(orderId, { provider: paymentMethod, transactionId: `TX-${Date.now()}` });
      setOrderStatus(res.data?.status ?? res.data?.Status);
      setMessage("Payment failed. Order cancelled.");
    } catch (err) {
      const msg = err.response?.data || err.message;
      setError(typeof msg === "string" ? msg : "Payment failure update failed.");
    } finally { setPayLoading(false); }
  };
  return {
    items, orderId, orderStatus, total,
    loading, payLoading, message, error,
    paymentMethod, setPaymentMethod,
    currency, setCurrency,
    shipping, setShipping,
    updateQty, remove,
    onCheckout, onPaymentSuccess, onPaymentFailed,
  };
}