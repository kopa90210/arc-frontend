
// import { Link } from "react-router-dom";

// // import orderApi from "../services/orderApi";
// import { formatDate } from "../utils/outfithelpers";
// // import * as signalR from "@microsoft/signalr";

// import { statusText, formatMoney } from "../utils/orderhelper";
// import { STATUS_PALETTE } from "../constants/orderStatus";
// import { useVendorOrders} from "../hooks/usevendororder";




// export default function VendorOrders() {
//   const {orders, loading, error, metrics, handleAction} = useVendorOrders();



//   // Inside your component, add alongside your existing useEffect:
//   // const connectionRef = useRef(null);


//   //  const initializeSignalR = async () => {
//   //     const vendorId = getVendorIdFromToken();
//   //     if (!vendorId) {
//   //       console.warn("No vendor ID found, SignalR not starting");
//   //       return;
//   //     }

//   //     const baseUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "https://localhost:7000";

//   //   // const connection = new signalR.HubConnectionBuilder()
//   //   .withUrl(`${import.meta.env.VITE_API_URL?.replace("/api", "") || "https://localhost:7000"}/hubs/orders`, {
//   //     accessTokenFactory: () => localStorage.getItem("token") // your JWT
//   //   })
//   //   console.log(import.meta.env.VITE_API_URL?.replace("/api", "") + "/hubs/orders")
//   //   .withAutomaticReconnect()
//   //   .build();

//   //  connection = new HubConnectionBuilder()
//   //     .withUrl(`${baseUrl}/hubs/orders`, {
//   //       accessTokenFactory: () => localStorage.getItem("token"),
//   //       skipNegotiation: false,
//   //       transport: 1 // WebSocket only
//   //     })
//   // .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
//   // .configureLogging(LogLevel.Information)
//   // .build();

//   //     connection.on("newOrder", (data) => {
//   //       if (!isMounted) return;

//   //        console.log("🔔 NEW ORDER RECEIVED:", data);

//   //   new Audio("/notification.mp3").play().catch(() => {});

//   //   const playNotificationSound = () => {
//   //   try {
//   //     // Use simple beep if file doesn't exist
//   //     const audio = new Audio("data:audio/wav;base64,U3RlYWx0aCBub3RpZmljYXRpb24gc291bmQ=");
//   //     audio.volume = 0.5;
//   //     audio.play().catch(e => console.log("Audio play failed:", e));
//   //   } catch  {
//   //     console.log("Audio not supported");
//   //   }
//   // };

//   // playNotificationSound();
//   // const requestNotificationPermission = async () => {
//   //     if ("Notification" in window) {
//   //       const permission = await Notification.requestPermission();
//   //       console.log("Notification permission:", permission);
//   //     }
//   //   };

//   // requestNotificationPermission();

//   //     // Update orders list
//   //     setOrders(prev => {
//   //       const exists = prev.some(o => (o.id ?? o.Id) === data.orderId);
//   //       if (exists) return prev; // already fetched via API, skip
//   //       return [{
//   //         id: data.orderId,
//   //         total: data.total,
//   //         status: data.status ?? 1, 
//   //         items: [],
//   //         createdAt: data.createdAt ?? new Date().toISOString()
//   //       }, ...prev];
//   //     });




//   // Browser notification
//   //   if (Notification.permission === "granted") {
//   //     new Notification(`New Order #${data.orderId}`, {
//   //       body: `Total: ${data.total} EGP - ${data.itemCount} item(s)`,
//   //       icon: "/logo.png",
//   //        badge: "/logo.png",
//   //   requireInteraction: true // Stays until user interacts
//   //     });
//   //   }
//   // });

//   // connection.onreconnecting((error) => {
//   //   console.warn("SignalR reconnecting:", error);
//   // });

//   // connection.onreconnected((connectionId) => {
//   //   console.log("SignalR reconnected:", connectionId);
//   //   connection.invoke("JoinVendorGroup", vendorId).catch(console.error);
//   // });

//   // connection.onclose((error) => {
//   //   console.warn("SignalR closed:", error);
//   // });

//   // try {
//   //   await connection.start();
//   //   if (!isMounted) {          // ← add this check
//   //     connection.stop();
//   //     return;
//   //   }
//   //   console.log("SignalR connected successfully");
//   //   await connection.invoke("JoinVendorGroup", vendorId);
//   // } catch (err) {
//   //   if (err.name !== "AbortError") {   // ← suppress Strict Mode noise
//   //     console.error("SignalR connection failed:", err);
//   //   }
//   // }
//   //  }


//   //   initializeSignalR();

//   //   return () => {
//   //     isMounted = false;
//   //     if (connection) {
//   //       connection.stop().catch(console.error);
//   //     }
//   //   };
//   // }, []);

//   // useEffect(() => {
//   //   if (Notification.permission === "default") {
//   //     Notification.requestPermission();
//   //   }
//   // }, []);



//   // useEffect(()=> {
//   //   const load = async () => {
//   //     try {
//   //       const res = await vendorApi.getOrders();
//   //       setOrders(res.data || []);
//   //     } catch (err) {
//   //       const msg = err.response?.data?.message || err.message || "Failed to load orders";
//   //       setError(msg);
//   //     } finally { setLoading(false); }
//   //   };
//   //   load();
//   // }, []);


//   // const normalizeStatus = (s) => {
//   //   if (typeof s === "number") return STATUS_PALETTE[s] || String(s);
//   //   return s || "Unknown";
//   // };

//   // In VendorOrders.jsx, add an action handler:
//   // const handleAction = async (orderId, action, payload = {}) => {
//   //   try {
//   //     // ✅ Guard — never send if id is undefined
//   //     if (!orderId) {
//   //       setError("Order ID is missing.");
//   //       return;
//   //     }
//   //     let res;
//   //     if (action === "processing") res = await vendorApi.markProcessing(orderId);
//   //     if (action === "ship")       res = await vendorApi.shipOrder(orderId, payload?.trackingNumber, payload?.carrier);
//   //     if (action === "deliver")    res = await vendorApi.deliverOrder(orderId);

//   //     setOrders(prev => prev.map(o =>
//   //       (o.id ?? o.Id) === orderId ? { ...o, status: res.data.status ?? res.data.Status } : o
//   //     ));
//   //   } catch (err) {
//   //     const msg = err.response?.data;
//   //     setError(typeof msg === "string" ? msg : JSON.stringify(msg) || err.message);
//   //   }
//   // };
//   // const metrics = useMemo(() => {
//   //   const totals = { totalOrders: 0, newOrders: 0, paid: 0, processing: 0, shipped: 0, delivered: 0, revenue: 0 };
//   //   orders.forEach(o => {
//   //     totals.totalOrders += 1;
//   //     const status = statusText(o.status);
//   //     if (status === "PendingPayment" || status === "Paid") totals.newOrders += 1;
//   //     if (status === "Paid") totals.paid += 1;
//   //     if (status === "Processing") totals.processing += 1;
//   //     if (status === "Shipped") totals.shipped += 1;
//   //     if (status === "Delivered") totals.delivered += 1;
//   //     const total = o.total ?? o.Total ?? 0;
//   //     totals.revenue += Number(total) || 0;
//   //   });
//   //   return totals;
//   // }, [orders]);

//   //   const formatMoney = (value) => {
//   //   const num = Number(value) || 0;
//   //   return `${num.toFixed(2)} EGP`;
//   // };

//   if (loading) return <div className="p-6">Loading...</div>;

//   return (
//     <div style={styles.page}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;800&family=Playfair+Display:wght@600&display=swap');
//       `}</style>

//       <header style={styles.hero}>
//         <div style={styles.heroContent}>
//           <div style={styles.heroTop}>
//             <div>
//               <div style={styles.heroBadge}>Vendor operations</div>
//               <h1 style={styles.heroTitle}>Orders command center</h1>
//               <p style={styles.heroText}>Track fulfillment, watch revenue, and stay ahead of customer expectations.</p>
//             </div>
//             <Link to="/vendors/products" style={styles.heroBtn}>Manage products</Link>
//           </div>

//           <div style={styles.metricGrid}>
//             <div style={styles.metricCard}>
//               <div style={styles.metricLabel}>Total orders</div>
//               <div style={styles.metricValue}>{metrics.totalOrders}</div>
//             </div>
//             <div style={styles.metricCard}>
//               <div style={styles.metricLabel}>New orders</div>
//               <div style={styles.metricValue}>{metrics.newOrders}</div>
//             </div>
//             <div style={styles.metricCard}>
//               <div style={styles.metricLabel}>In progress</div>
//               <div style={styles.metricValue}>{metrics.processing + metrics.shipped}</div>
//             </div>
//             <div style={styles.metricCard}>
//               <div style={styles.metricLabel}>Revenue</div>
//               <div style={styles.metricValue}>{formatMoney(metrics.revenue)}</div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <section style={styles.section}>
//         <div style={styles.sectionHeader}>
//           <h2 style={styles.sectionTitle}>Order stream</h2>
//           {metrics.newOrders > 0 && (
//             <span style={styles.newBadge}>{metrics.newOrders} new</span>
//           )}
//         </div>

//         {error && <div style={styles.error}>{error}</div>}

//         {orders.length === 0 ? (
//           <div style={styles.emptyState}>
//             <div style={styles.emptyTitle}>No orders yet</div>
//             <div style={styles.emptyText}>Once customers place orders, they will appear here with status and totals.</div>
//           </div>
//         ) : (
//           <div style={styles.cards}>
//             {orders.map(o => {
//               const status = statusText(o.status);
//               const palette = STATUS_PALETTE[status] || STATUS_PALETTE.Draft;
//               const total = o.total ?? o.Total ?? 0;
//               const items = o.items || o.Items || [];
//               return (
//                 <div key={o.id ?? o.Id} style={styles.card}>
//                   <div style={styles.cardHeader}>
//                     <div>
//                       <div style={styles.orderId}>Order #{o.id ?? o.Id}</div>
//                       <div style={styles.orderMeta}>Placed: {formatDate(o.createdAt || o.CreatedAt)}</div>
//                     </div>
//                     <div style={{ ...styles.statusBadge, background: palette.bg, color: palette.color }}>
//                       {status}
//                     </div>
//                   </div>

//                   <div style={styles.cardBody}>
//                     <div style={styles.cardStat}>
//                       <div style={styles.cardLabel}>Total</div>
//                       <div style={styles.cardValue}>{formatMoney(total)}</div>
//                     </div>
//                     <div style={styles.cardStat}>
//                       <div style={styles.cardLabel}>Items</div>
//                       <div style={styles.cardValue}>{items.length}</div>
//                     </div>
//                     <div style={styles.cardStat}>
//                       <div style={styles.cardLabel}>Payment</div>
//                       <div style={styles.cardValue}>{o.payment?.status || o.Payment?.Status || "�"}</div>
//                     </div>
//                   </div>

//                   {items.length > 0 && (
//                     <div style={styles.itemList}>
//                       {items.slice(0, 3).map((it, idx) => (
//                         <div key={it.id ?? it.productId ?? `item-${idx}-${it.productId}`} style={styles.itemRow}>
//                           <span>{it.product?.name || it.Product?.Name || `Product #${it.productId || it.ProductId}`}</span>
//                           <span style={styles.itemQty}>x{it.quantity || it.Quantity || 1}</span>
//                         </div>

//                       ))}
//                       {items.length > 3 && <div style={styles.moreItems}>+{items.length - 3} more</div>}
//                     </div>
//                   )}

//                   <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
//                     {status === "Paid" && (
//                       <button onClick={() => handleAction((o.id ?? o.Id), "processing")} style={{ ...styles.actionBtn, background: "#1e3a8a", color: "#fff" }}>Mark Processing</button>
//                     )}
//                     {status === "Processing" && (
//                       <button onClick={() => handleAction((o.id ?? o.Id), "ship")} style={{ ...styles.actionBtn, background: "#9d174d", color: "#fff" }}>Ship</button>
//                     )}
//                     {status === "Shipped" && (
//                       <button onClick={() => handleAction((o.id ?? o.Id), "deliver")} style={{ ...styles.actionBtn, background: "#065f46", color: "#fff" }}>Deliver</button>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }

// const styles = {
//   page: {
//     background: "linear-gradient(180deg, #efe4d7 0%, #fff7ee 35%, #ffffff 70%)",
//     minHeight: "100vh",
//     paddingBottom: "48px",
//     fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif",
//     color: "#1d130e",
//   },
//   hero: {
//     padding: "26px 20px 8px",
//   },
//   heroContent: {
//     maxWidth: "1200px",
//     margin: "0 auto",
//     background: "radial-gradient(circle at top right, #f1d2b1 0%, #fdf6ec 55%)",
//     borderRadius: "20px",
//     padding: "28px",
//     boxShadow: "0 16px 30px rgba(28, 16, 8, 0.12)",
//     border: "1px solid #f0d9c0",
//   },
//   heroTop: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     gap: "16px",
//     flexWrap: "wrap",
//   },
//   heroBadge: {
//     display: "inline-block",
//     background: "#2b1a12",
//     color: "#fff1e6",
//     fontSize: "12px",
//     padding: "6px 12px",
//     borderRadius: "999px",
//     marginBottom: "10px",
//     textTransform: "uppercase",
//     letterSpacing: "1.2px",
//   },
//   heroTitle: {
//     margin: "0 0 8px",
//     fontSize: "30px",
//     fontWeight: 800,
//     fontFamily: "'Playfair Display', serif",
//   },
//   heroText: {
//     margin: "0 0 16px",
//     color: "#5c4638",
//     maxWidth: "520px",
//   },
//   heroBtn: {
//     background: "#2b1a12",
//     color: "#fff",
//     padding: "10px 16px",
//     borderRadius: "10px",
//     textDecoration: "none",
//     fontWeight: 700,
//   },
//   metricGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
//     gap: "14px",
//     marginTop: "16px",
//   },
//   metricCard: {
//     background: "#fff",
//     borderRadius: "14px",
//     padding: "14px",
//     border: "1px solid #f0e1d2",
//     boxShadow: "0 8px 16px rgba(28, 16, 8, 0.06)",
//   },
//   metricLabel: {
//     fontSize: "12px",
//     color: "#7a5a46",
//     textTransform: "uppercase",
//     letterSpacing: "1px",
//   },
//   metricValue: {
//     fontSize: "20px",
//     fontWeight: 800,
//     marginTop: "6px",
//   },
//   section: {
//     maxWidth: "1200px",
//     margin: "0 auto",
//     padding: "18px 20px",
//   },
//   sectionHeader: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: "16px",
//   },
//   sectionTitle: {
//     margin: 0,
//     fontSize: "20px",
//     fontWeight: 700,
//   },
//   newBadge: {
//     background: "#b91c1c",
//     color: "#fff",
//     padding: "4px 10px",
//     borderRadius: "999px",
//     fontSize: "12px",
//     fontWeight: 700,
//   },
//   error: {
//     marginBottom: "12px",
//     color: "#b91c1c",
//   },
//   emptyState: {
//     padding: "20px",
//     borderRadius: "14px",
//     border: "1px dashed #d8c1ac",
//     background: "#fffdf9",
//     textAlign: "center",
//   },
//   emptyTitle: {
//     fontWeight: 700,
//     marginBottom: "6px",
//   },
//   emptyText: {
//     fontSize: "12px",
//     color: "#7a5a46",
//   },
//   cards: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
//     gap: "16px",
//   },
//   card: {
//     background: "#fff",
//     borderRadius: "16px",
//     border: "1px solid #f0e1d2",
//     boxShadow: "0 10px 22px rgba(28, 16, 8, 0.08)",
//     padding: "16px",
//     display: "flex",
//     flexDirection: "column",
//     gap: "12px",
//   },
//   cardHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   orderId: {
//     fontWeight: 700,
//   },
//   orderMeta: {
//     fontSize: "12px",
//     color: "#7a5a46",
//   },
//   statusBadge: {
//     padding: "4px 10px",
//     borderRadius: "999px",
//     fontSize: "12px",
//     fontWeight: 700,
//   },
//   cardBody: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
//     gap: "12px",
//   },
//   cardStat: {
//     background: "#fff8ef",
//     borderRadius: "12px",
//     padding: "10px",
//     border: "1px solid #f1e1d0",
//   },
//   cardLabel: {
//     fontSize: "11px",
//     color: "#7a5a46",
//     textTransform: "uppercase",
//     letterSpacing: "0.8px",
//   },
//   cardValue: {
//     fontWeight: 700,
//     marginTop: "4px",
//   },
//   itemList: {
//     borderTop: "1px dashed #e1cbb5",
//     paddingTop: "10px",
//     display: "grid",
//     gap: "6px",
//   },
//   itemRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     fontSize: "12px",
//     color: "#4b3426",
//   },
//   itemQty: {
//     fontWeight: 700,
//   },
//   moreItems: {
//     fontSize: "12px",
//     color: "#7a5a46",
//   },
//   actionBtn: {
//     padding: "6px 12px",
//     borderRadius: "8px",
//     border: "none",
//     fontSize: "12px",
//     fontWeight: 700,
//     cursor: "pointer",
//     flex: 1,
//   },
// };


import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { withHost } from "../config/env";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_TABS = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_META = {
  Draft: { label: "Draft", bg: "#f3f4f6", color: "#6b7280", dot: "#9ca3af" },
  PendingPayment: { label: "Pending", bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
  Paid: { label: "Paid", bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
  Processing: { label: "Processing", bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
  Shipped: { label: "Shipped", bg: "#ede9fe", color: "#5b21b6", dot: "#8b5cf6" },
  Delivered: { label: "Delivered", bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
  Cancelled: { label: "Cancelled", bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
  Refunded: { label: "Refunded", bg: "#fce7f3", color: "#9d174d", dot: "#ec4899" },
};

// Map tab label → API status strings
const TAB_STATUS_MAP = {
  All: null,
  Pending: ["PendingPayment", "Paid"],
  Processing: ["Processing"],
  Shipped: ["Shipped"],
  Delivered: ["Delivered"],
  Cancelled: ["Cancelled", "Refunded"],
};

// ─── Utilities ────────────────────────────────────────────────────────────────

const fmt = (n) =>
  n == null
    ? "—"
    : Number(n).toLocaleString("en-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " EGP";

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-EG", { day: "2-digit", month: "short", year: "numeric" });
};

const normalizeStatus = (s) => {
  if (typeof s === "number") {
    const map = { 0: "Draft", 1: "PendingPayment", 2: "Paid", 3: "Processing", 4: "Shipped", 5: "Delivered", 6: "Cancelled", 7: "Refunded" };
    return map[s] || "Draft";
  }
  return s || "Draft";
};

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.Draft;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: meta.bg, color: meta.color,
      borderRadius: 999, padding: "3px 10px",
      fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: meta.dot, flexShrink: 0 }} />
      {meta.label}
    </span>
  );
}

function Avatar({ name, imageUrl, size = 32 }) {
  const [err, setErr] = useState(false);
  if (imageUrl && !err) {
    return (
      <img
        src={withHost(imageUrl)}
        alt={name}
        onError={() => setErr(true)}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg,#c09070,#8a5a3a)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700, color: "#fff", flexShrink: 0,
    }}>
      {getInitials(name)}
    </div>
  );
}

function ProductThumb({ item }) {
  const [err, setErr] = useState(false);
  const src = item?.product?.imageUrl || item?.Product?.ImageUrl;
  if (src && !err) {
    return (
      <img
        src={withHost(src)}
        alt={item?.product?.name || "Product"}
        onError={() => setErr(true)}
        style={{ width: 32, height: 32, borderRadius: 6, objectFit: "cover", border: "1px solid #ede0d4" }}
      />
    );
  }
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 6,
      background: "#f4ede4", display: "flex",
      alignItems: "center", justifyContent: "center",
      fontSize: 14, border: "1px solid #ede0d4",
    }}>
      👔
    </div>
  );
}

function ShipModal({ orderId, onConfirm, onClose }) {
  const [tracking, setTracking] = useState("");
  const [carrier, setCarrier] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onConfirm(orderId, tracking, carrier);
    setLoading(false);
    onClose();
  };

  return (
    <div style={modal.overlay} onClick={onClose}>
      <div style={modal.box} onClick={(e) => e.stopPropagation()}>
        <div style={modal.header}>
          <h3 style={modal.title}>Ship Order #{orderId}</h3>
          <button style={modal.close} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit} style={modal.body}>
          <label style={modal.field}>
            <span style={modal.label}>Tracking number</span>
            <input
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="e.g. EG123456789EG"
              style={modal.input}
              autoFocus
            />
          </label>
          <label style={modal.field}>
            <span style={modal.label}>Carrier</span>
            <select value={carrier} onChange={(e) => setCarrier(e.target.value)} style={modal.input}>
              <option value="">Select carrier</option>
              {["EMS Egypt", "Aramex", "DHL", "FedEx", "Bosta", "Other"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button type="submit" disabled={loading} style={modal.primaryBtn}>
              {loading ? "Shipping…" : "Confirm shipment"}
            </button>
            <button type="button" onClick={onClose} style={modal.ghostBtn}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Expandable Order Row ─────────────────────────────────────────────────────

function OrderRow({ order, checked, onCheck, onAction, actionLoading, isExpanded, onToggle }) {
  const status = normalizeStatus(order.status ?? order.Status);
  const total = order.total ?? order.Total ?? 0;
  const items = order.items || order.Items || [];
  const shipping = order.shipping || order.Shipping || {};
  const payment = order.payment || order.Payment || {};
  const customer = order.customer || order.AppUser || order.appUser || {};
  const createdAt = order.createdAt || order.CreatedAt;
  const orderId = order.id ?? order.Id;

  const customerName = customer.fullName || customer.FullName || customer.email || customer.Email || "Customer";
  const customerImg = customer.profileImage || customer.ProfileImage || null;

  const canProcess = status === "Paid";
  const canShip = status === "Processing";
  const canDeliver = status === "Shipped";

  return (
    <>
      {/* ── Main row ── */}
      <tr
        style={{
          ...t.tr,
          background: checked ? "#fdf6ef" : isExpanded ? "#fffdf9" : "#fff",
          cursor: "pointer",
        }}
        onClick={() => onToggle(orderId)}
      >
        {/* Checkbox */}
        <td style={t.td} onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onCheck(orderId)}
            style={{ width: 15, height: 15, accentColor: "#c7622a", cursor: "pointer" }}
          />
        </td>

        {/* Order # */}
        <td style={t.td}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1e1008" }}>#{orderId}</span>
            {isExpanded && <span style={{ fontSize: 10, color: "#c7622a" }}>▲</span>}
            {!isExpanded && <span style={{ fontSize: 10, color: "#a08070" }}>▼</span>}
          </div>
          <span style={{ fontSize: 11, color: "#a08070" }}>{fmtDate(createdAt)}</span>
        </td>

        {/* Customer */}
        <td style={t.td}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar name={customerName} imageUrl={customerImg} size={30} />
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 130 }}>
                {customerName}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#a08070", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 130 }}>
                {customer.email || customer.Email || ""}
              </p>
            </div>
          </div>
        </td>

        {/* Items thumbnails */}
        <td style={t.td}>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {items.slice(0, 3).map((it, i) => (
              <ProductThumb key={i} item={it} />
            ))}
            {items.length > 3 && (
              <div style={{
                width: 32, height: 32, borderRadius: 6,
                background: "#f4ede4", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#5a3a26",
              }}>
                +{items.length - 3}
              </div>
            )}
          </div>
        </td>

        {/* Total */}
        <td style={t.td}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1e1008" }}>{fmt(total)}</span>
        </td>

        {/* Status */}
        <td style={t.td}><StatusBadge status={status} /></td>

        {/* Actions */}
        <td style={t.td} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {canProcess && (
              <button
                style={actionBtn("#1e3a8a")}
                disabled={actionLoading === orderId}
                onClick={() => onAction(orderId, "processing")}
              >
                {actionLoading === orderId ? "…" : "Process"}
              </button>
            )}
            {canShip && (
              <button
                style={actionBtn("#7c3aed")}
                disabled={actionLoading === orderId}
                onClick={() => onAction(orderId, "ship")}
              >
                {actionLoading === orderId ? "…" : "Ship"}
              </button>
            )}
            {canDeliver && (
              <button
                style={actionBtn("#065f46")}
                disabled={actionLoading === orderId}
                onClick={() => onAction(orderId, "deliver")}
              >
                {actionLoading === orderId ? "…" : "Delivered"}
              </button>
            )}
            {!canProcess && !canShip && !canDeliver && (
              <span style={{ fontSize: 11, color: "#c0a88a" }}>—</span>
            )}
          </div>
        </td>
      </tr>

      {/* ── Expanded detail row ── */}
      {isExpanded && (
        <tr style={{ background: "#fffdf9" }}>
          <td colSpan={7} style={{ padding: 0, borderBottom: "2px solid #ede0d4" }}>
            <div style={expand.wrap}>

              {/* Items breakdown */}
              <div style={expand.section}>
                <p style={expand.sectionTitle}>Order Items</p>
                {items.map((it, i) => {
                  const name = it.product?.name || it.Product?.Name || `Product #${it.productId || it.ProductId}`;
                  const price = it.priceAtPurchase ?? it.PriceAtPurchase ?? it.product?.price ?? 0;
                  const qty = it.quantity || it.Quantity || 1;
                  return (
                    <div key={i} style={expand.itemRow}>
                      <ProductThumb item={it} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={expand.itemName}>{name}</p>
                        <p style={expand.itemMeta}>Qty: {qty}</p>
                      </div>
                      <span style={expand.itemPrice}>{fmt(price * qty)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Shipping address */}
              <div style={expand.section}>
                <p style={expand.sectionTitle}>Shipping Address</p>
                {shipping.recipientName || shipping.RecipientName ? (
                  <div style={expand.infoBlock}>
                    <p style={expand.infoLine}><strong>{shipping.recipientName || shipping.RecipientName}</strong></p>
                    <p style={expand.infoLine}>{shipping.phone || shipping.Phone || "—"}</p>
                    <p style={expand.infoLine}>{shipping.addressLine1 || shipping.AddressLine1 || "—"}</p>
                    {(shipping.addressLine2 || shipping.AddressLine2) && (
                      <p style={expand.infoLine}>{shipping.addressLine2 || shipping.AddressLine2}</p>
                    )}
                    <p style={expand.infoLine}>
                      {[
                        shipping.city || shipping.City,
                        shipping.state || shipping.State,
                        shipping.postalCode || shipping.PostalCode,
                      ].filter(Boolean).join(", ")}
                    </p>
                    <p style={expand.infoLine}>{shipping.country || shipping.Country || "Egypt"}</p>
                    {(shipping.trackingNumber || shipping.TrackingNumber) && (
                      <div style={expand.trackingBadge}>
                        📦 {shipping.carrier || shipping.Carrier || "Carrier"} · {shipping.trackingNumber || shipping.TrackingNumber}
                      </div>
                    )}
                  </div>
                ) : (
                  <p style={expand.noData}>No shipping address provided.</p>
                )}
              </div>

              {/* Payment info */}
              <div style={expand.section}>
                <p style={expand.sectionTitle}>Payment</p>
                <div style={expand.infoBlock}>
                  <div style={expand.payRow}>
                    <span style={expand.payLabel}>Method</span>
                    <span style={expand.payValue}>{payment.provider || payment.Provider || "—"}</span>
                  </div>
                  <div style={expand.payRow}>
                    <span style={expand.payLabel}>Status</span>
                    <span style={expand.payValue}>{payment.status || payment.Status || "—"}</span>
                  </div>
                  <div style={expand.payRow}>
                    <span style={expand.payLabel}>Amount</span>
                    <span style={expand.payValue}>{fmt(payment.amount || payment.Amount || total)}</span>
                  </div>
                  {(payment.transactionId || payment.TransactionId) && (
                    <div style={expand.payRow}>
                      <span style={expand.payLabel}>Txn ID</span>
                      <span style={{ ...expand.payValue, fontFamily: "monospace", fontSize: 11 }}>
                        {payment.transactionId || payment.TransactionId}
                      </span>
                    </div>
                  )}
                  {(payment.paidAt || payment.PaidAt) && (
                    <div style={expand.payRow}>
                      <span style={expand.payLabel}>Paid at</span>
                      <span style={expand.payValue}>{fmtDate(payment.paidAt || payment.PaidAt)}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [shipModal, setShipModal] = useState(null); // orderId | null
  const [toast, setToast] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // ── load ──────────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await api.get("/vendors/orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── toast helper ──────────────────────────────────────────────────────────

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  }, []);

  // ── single action ─────────────────────────────────────────────────────────

  const handleAction = useCallback(async (orderId, action, tracking = "", carrier = "") => {
    setActionLoading(orderId);
    try {
      let res;
      if (action === "processing") res = await api.post(`/vendors/orders/${orderId}/processing`);
      if (action === "ship") res = await api.post(`/vendors/orders/${orderId}/ship`, { trackingNumber: tracking, carrier });
      if (action === "deliver") res = await api.post(`/vendors/orders/${orderId}/deliver`);

      const newStatus = res?.data?.status ?? res?.data?.Status;
      setOrders((prev) =>
        prev.map((o) =>
          (o.id ?? o.Id) === orderId
            ? { ...o, status: newStatus ?? o.status }
            : o
        )
      );
      showToast(`✓ Order #${orderId} updated`);
    } catch (err) {
      showToast(`✗ ${err.response?.data || "Action failed"}`);
    } finally { setActionLoading(null); setShipModal(null); }
  }, [showToast]);

  // Intercept ship action to open modal
  const handleActionOrModal = useCallback((orderId, action) => {
    if (action === "ship") { setShipModal(orderId); return; }
    handleAction(orderId, action);
  }, [handleAction]);

  // ── bulk actions ──────────────────────────────────────────────────────────

  const handleBulkShip = useCallback(async () => {
    if (!selected.size) return;
    setBulkLoading(true);
    try {
      const res = await api.post("/vendors/orders/bulk-ship", {
        orderIds: [...selected],
        trackingNumber: "",
        carrier: "Bosta",
      });
      const updated = res.data?.updated || 0;
      await load();
      setSelected(new Set());
      showToast(`✓ ${updated} order${updated !== 1 ? "s" : ""} marked as shipped`);
    } catch (err) {
      showToast(`✗ ${err.response?.data?.message || "Bulk ship failed"}`);
    } finally { setBulkLoading(false); }
  }, [selected, load, showToast]);

  const handleBulkProcess = useCallback(async () => {
    if (!selected.size) return;
    setBulkLoading(true);
    try {
      const res = await api.post("/vendors/orders/bulk-process", { orderIds: [...selected] });
      const updated = res.data?.updated || 0;
      await load();
      setSelected(new Set());
      showToast(`✓ ${updated} order${updated !== 1 ? "s" : ""} moved to Processing`);
    } catch (err) {
      showToast(`✗ ${err.response?.data?.message || "Bulk action failed"}`);
    } finally { setBulkLoading(false); }
  }, [selected, load, showToast]);

  // ── export ────────────────────────────────────────────────────────────────

  const handleExport = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo) params.set("to", dateTo);
      if (activeTab !== "All") params.set("status", activeTab);

      const res = await api.get(`/vendors/orders/export?${params}`, { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "text/csv" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      showToast("✓ Export downloaded");
    } catch {
      showToast("✗ Export failed — check your filters");
    }
  }, [dateFrom, dateTo, activeTab, showToast]);

  // ── filtering ─────────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let list = [...orders];

    // Tab filter
    const allowedStatuses = TAB_STATUS_MAP[activeTab];
    if (allowedStatuses) {
      list = list.filter((o) => {
        const s = normalizeStatus(o.status ?? o.Status);
        return allowedStatuses.includes(s);
      });
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) => {
        const id = String(o.id ?? o.Id ?? "");
        const cust = (o.customer?.fullName || o.AppUser?.FullName || o.customer?.email || "").toLowerCase();
        return id.includes(q) || cust.includes(q);
      });
    }

    // Date range
    if (dateFrom) {
      const from = new Date(dateFrom);
      list = list.filter((o) => new Date(o.createdAt || o.CreatedAt) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59);
      list = list.filter((o) => new Date(o.createdAt || o.CreatedAt) <= to);
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt || b.CreatedAt || 0) - new Date(a.createdAt || a.CreatedAt || 0));
    return list;
  }, [orders, activeTab, search, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [activeTab, search, dateFrom, dateTo]);

  // ── select helpers ────────────────────────────────────────────────────────

  const allPageIds = paginated.map((o) => o.id ?? o.Id);
  const allPageChecked = allPageIds.length > 0 && allPageIds.every((id) => selected.has(id));

  const toggleAll = () => {
    if (allPageChecked) {
      setSelected((prev) => { const n = new Set(prev); allPageIds.forEach((id) => n.delete(id)); return n; });
    } else {
      setSelected((prev) => { const n = new Set(prev); allPageIds.forEach((id) => n.add(id)); return n; });
    }
  };

  const toggleOne = (id) => {
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  // ── metrics ───────────────────────────────────────────────────────────────

  const metrics = useMemo(() => {
    const m = { total: 0, pending: 0, processing: 0, shipped: 0, delivered: 0, revenue: 0 };
    orders.forEach((o) => {
      m.total++;
      const s = normalizeStatus(o.status ?? o.Status);
      if (["PendingPayment", "Paid"].includes(s)) m.pending++;
      if (s === "Processing") m.processing++;
      if (s === "Shipped") m.shipped++;
      if (s === "Delivered") m.delivered++;
      if (s === "Delivered") m.revenue += Number(o.total ?? o.Total ?? 0);
    });
    return m;
  }, [orders]);

  // ── pending message ───────────────────────────────────────────────────────

  const pendingInfo = useMemo(() => {
    const pendingOrders = orders.filter((o) => {
      const s = normalizeStatus(o.status ?? o.Status);
      return ["PendingPayment", "Paid"].includes(s);
    });
    const revenue = pendingOrders.reduce((sum, o) => sum + Number(o.total ?? o.Total ?? 0), 0);
    const readyToShip = orders.filter((o) => normalizeStatus(o.status ?? o.Status) === "Processing").length;
    return { count: pendingOrders.length, revenue, readyToShip };
  }, [orders]);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={pg.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .vo-tr:hover { background: #fdf9f5 !important; }
        .vo-tab:hover { color: #3d2514 !important; }
        .vo-page-btn:hover:not(:disabled) { background: #f4ede4 !important; }
        .vo-action-btn:hover:not(:disabled) { filter: brightness(1.12); }
        .vo-bulk-btn:hover:not(:disabled) { background: #ede0d4 !important; }
        .vo-export-btn:hover { background: #3d2514 !important; color: #fff !important; }

        @keyframes fadeDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes expandRow { from{opacity:0;transform:scaleY(.96);transform-origin:top} to{opacity:1;transform:scaleY(1)} }
        @keyframes toastIn  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

        .vo-expanded { animation: expandRow .2s ease; }
        .toast { animation: toastIn .25s ease; }

        /* scrollbar */
        .vo-scroll::-webkit-scrollbar { height: 4px; }
        .vo-scroll::-webkit-scrollbar-track { background: transparent; }
        .vo-scroll::-webkit-scrollbar-thumb { background: #d0b8a4; border-radius: 2px; }
      `}</style>

      {/* ── Toast ── */}
      {toast && (
        <div className="toast" style={pg.toast}>
          {toast}
        </div>
      )}

      {/* ── Ship modal ── */}
      {shipModal && (
        <ShipModal
          orderId={shipModal}
          onConfirm={handleAction}
          onClose={() => setShipModal(null)}
        />
      )}

      {/* ── Hero header ── */}
      <header style={pg.hero}>
        <div style={pg.heroInner}>
          <div style={pg.heroTop}>
            <div>
              <div style={pg.heroBadge}>Vendor Operations</div>
              <h1 style={pg.heroTitle}>Orders Command Center</h1>
              <p style={pg.heroSub}>
                Fulfil faster. Ship smarter. Grow revenue.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to="/vendors/products" style={pg.ghostLink}>Manage Products</Link>
              <Link to="/vendors/dashboard" style={pg.ghostLink}>Dashboard</Link>
            </div>
          </div>

          {/* Metric cards */}
          <div style={pg.metricRow}>
            {[
              { label: "Total orders", value: metrics.total, accent: "#3d2514" },
              { label: "Pending", value: metrics.pending, accent: "#d97706" },
              { label: "Processing", value: metrics.processing, accent: "#3b82f6" },
              { label: "Shipped", value: metrics.shipped, accent: "#8b5cf6" },
              { label: "Delivered", value: metrics.delivered, accent: "#10b981" },
              { label: "Delivered rev.", value: fmt(metrics.revenue), accent: "#c7622a", wide: true },
            ].map((m) => (
              <div key={m.label} style={{ ...pg.metricCard, flex: m.wide ? "1.4" : "1" }}>
                <div style={pg.metricLabel}>{m.label}</div>
                <div style={{ ...pg.metricValue, color: m.accent }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <div style={pg.content}>

        {/* Pending alert bar */}
        {pendingInfo.count > 0 && (
          <div style={pg.alertBar}>
            <span style={{ fontWeight: 600 }}>
              {pendingInfo.count} order{pendingInfo.count > 1 ? "s" : ""} pending
            </span>
            <span style={{ opacity: .75 }}>·</span>
            <span>{fmt(pendingInfo.revenue)} revenue pending</span>
            {pendingInfo.readyToShip > 0 && (
              <>
                <span style={{ opacity: .75 }}>·</span>
                <span style={{ fontWeight: 600, color: "#7c3aed" }}>
                  {pendingInfo.readyToShip} ready to ship
                </span>
              </>
            )}
          </div>
        )}

        {/* ── Status tabs ── */}
        <div style={pg.tabBar}>
          {STATUS_TABS.map((tab) => {
            const count = tab === "All"
              ? orders.length
              : orders.filter((o) => {
                const s = normalizeStatus(o.status ?? o.Status);
                return TAB_STATUS_MAP[tab]?.includes(s);
              }).length;

            return (
              <button
                key={tab}
                className="vo-tab"
                onClick={() => setActiveTab(tab)}
                style={{
                  ...pg.tab,
                  borderBottom: activeTab === tab ? "2px solid #c7622a" : "2px solid transparent",
                  color: activeTab === tab ? "#1e1008" : "#8a6455",
                  fontWeight: activeTab === tab ? 700 : 500,
                }}
              >
                {tab}
                {count > 0 && (
                  <span style={{
                    ...pg.tabCount,
                    background: activeTab === tab ? "#c7622a" : "#f4ede4",
                    color: activeTab === tab ? "#fff" : "#5a3a26",
                  }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Toolbar ── */}
        <div style={pg.toolbar}>
          {/* Search */}
          <div style={pg.searchWrap}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a08070" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order # or customer…"
              style={pg.searchInput}
            />
          </div>

          {/* Date range */}
          <div style={pg.dateRange}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a08070" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <input
              type="date" value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={pg.dateInput}
            />
            <span style={{ color: "#c0a88a", fontSize: 12 }}>→</span>
            <input
              type="date" value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={pg.dateInput}
            />
            {(dateFrom || dateTo) && (
              <button onClick={() => { setDateFrom(""); setDateTo(""); }} style={pg.clearDate}>
                ✕
              </button>
            )}
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {/* Export */}
            <button className="vo-export-btn" onClick={handleExport} style={pg.exportBtn}>
              ↓ Export CSV
            </button>
          </div>
        </div>

        {/* ── Bulk action bar ── */}
        {selected.size > 0 && (
          <div style={pg.bulkBar}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              {selected.size} selected
            </span>
            <button
              className="vo-bulk-btn"
              style={pg.bulkBtn}
              onClick={handleBulkProcess}
              disabled={bulkLoading}
            >
              Mark Processing
            </button>
            <button
              className="vo-bulk-btn"
              style={{ ...pg.bulkBtn, background: "#ede9fe", color: "#5b21b6" }}
              onClick={handleBulkShip}
              disabled={bulkLoading}
            >
              {bulkLoading ? "Shipping…" : "Mark as Shipped"}
            </button>
            <button
              style={{ ...pg.bulkBtn, background: "transparent", color: "#8a6455" }}
              onClick={() => setSelected(new Set())}
            >
              Clear
            </button>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 14 }}>
            {error}
            <button onClick={load} style={{ marginLeft: 12, fontWeight: 700, background: "none", border: "none", color: "#b91c1c", cursor: "pointer" }}>
              Retry
            </button>
          </div>
        )}

        {/* ── Table ── */}
        <div style={pg.tableWrap}>
          <div className="vo-scroll" style={{ overflowX: "auto" }}>
            <table style={t.table}>
              <thead>
                <tr style={t.thead}>
                  <th style={t.th}>
                    <input
                      type="checkbox"
                      checked={allPageChecked}
                      onChange={toggleAll}
                      style={{ width: 15, height: 15, accentColor: "#c7622a", cursor: "pointer" }}
                    />
                  </th>
                  <th style={t.th}>Order</th>
                  <th style={t.th}>Customer</th>
                  <th style={t.th}>Items</th>
                  <th style={t.th}>Total</th>
                  <th style={t.th}>Status</th>
                  <th style={t.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={7} style={{ padding: "60px 0", textAlign: "center", color: "#a08070", fontSize: 14 }}>
                      Loading orders…
                    </td>
                  </tr>
                )}

                {!loading && paginated.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <div style={{ padding: "60px 20px", textAlign: "center" }}>
                        <div style={{ fontSize: 40, marginBottom: 12, opacity: .4 }}>📦</div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "#5a3a26", margin: "0 0 6px" }}>
                          {search || dateFrom || dateTo ? "No orders match your filters" : "No orders yet"}
                        </p>
                        <p style={{ fontSize: 13, color: "#a08070", margin: 0 }}>
                          {search || dateFrom || dateTo
                            ? "Try adjusting your search or date range"
                            : "Once customers place orders, they'll appear here"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

                {!loading && paginated.map((order) => {
                  const orderId = order.id ?? order.Id;
                  return (
                    <OrderRow
                      key={orderId}
                      order={order}
                      checked={selected.has(orderId)}
                      onCheck={toggleOne}
                      onAction={handleActionOrModal}
                      actionLoading={actionLoading}
                      isExpanded={expandedId === orderId}
                      onToggle={(id) => setExpandedId((prev) => prev === id ? null : id)}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && filtered.length > 0 && (
            <div style={pg.paginationBar}>
              <span style={{ fontSize: 13, color: "#8a6455" }}>
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} orders
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="vo-page-btn"
                  style={pg.pageBtn}
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ‹ Prev
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pg_n;
                  if (totalPages <= 7) {
                    pg_n = i + 1;
                  } else if (page <= 4) {
                    pg_n = i < 6 ? i + 1 : totalPages;
                  } else if (page >= totalPages - 3) {
                    pg_n = i === 0 ? 1 : totalPages - 6 + i;
                  } else {
                    const center = [1, page - 1, page, page + 1, totalPages];
                    pg_n = center[i] ?? null;
                  }
                  if (!pg_n) return null;
                  return (
                    <button
                      key={pg_n}
                      className="vo-page-btn"
                      onClick={() => setPage(pg_n)}
                      style={{
                        ...pg.pageBtn,
                        background: page === pg_n ? "#c7622a" : "#fff",
                        color: page === pg_n ? "#fff" : "#3d2514",
                        fontWeight: page === pg_n ? 700 : 500,
                        borderColor: page === pg_n ? "#c7622a" : "#ddd0c8",
                      }}
                    >
                      {pg_n}
                    </button>
                  );
                })}
                <button
                  className="vo-page-btn"
                  style={pg.pageBtn}
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const actionBtn = (bg) => ({
  background: bg, color: "#fff", border: "none",
  borderRadius: 7, padding: "4px 10px",
  fontSize: 11, fontWeight: 700, cursor: "pointer",
  fontFamily: "'DM Sans', sans-serif",
  transition: "filter .15s",
  whiteSpace: "nowrap",
});

const pg = {
  page: { fontFamily: "'DM Sans', sans-serif", color: "#1e1008", minHeight: "100vh", background: "#faf5ef", paddingBottom: 48 },
  toast: {
    position: "fixed", bottom: 24, right: 24, zIndex: 9999,
    background: "#1e1008", color: "#fff",
    borderRadius: 12, padding: "12px 20px",
    fontSize: 13, fontWeight: 600,
    boxShadow: "0 8px 24px rgba(0,0,0,.2)",
  },
  hero: { padding: "0 0 0" },
  heroInner: {
    background: "linear-gradient(135deg,#2b1a0f 0%,#5a3318 60%,#3d2514 100%)",
    padding: "28px 28px 24px",
    color: "#fff",
  },
  heroTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 20 },
  heroBadge: {
    display: "inline-block", background: "rgba(255,255,255,.15)",
    borderRadius: 999, padding: "4px 12px",
    fontSize: 11, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "1.5px",
    marginBottom: 10, color: "#f4d5b4",
  },
  heroTitle: { margin: "0 0 6px", fontSize: 28, fontWeight: 400, fontFamily: "'DM Serif Display', serif" },
  heroSub: { margin: 0, fontSize: 14, opacity: .75 },
  ghostLink: {
    border: "1px solid rgba(255,255,255,.3)", borderRadius: 10,
    padding: "8px 16px", color: "#fff", textDecoration: "none",
    fontSize: 13, fontWeight: 600, background: "rgba(255,255,255,.08)",
    backdropFilter: "blur(4px)",
  },
  metricRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 10 },
  metricCard: {
    background: "rgba(255,255,255,.1)", borderRadius: 12,
    padding: "12px 14px", backdropFilter: "blur(6px)",
    border: "1px solid rgba(255,255,255,.12)",
  },
  metricLabel: { fontSize: 11, opacity: .7, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 },
  metricValue: { fontSize: 20, fontWeight: 700, fontFamily: "'DM Serif Display', serif" },
  content: { padding: "20px 24px" },
  alertBar: {
    display: "flex", gap: 12, alignItems: "center",
    background: "#fffbeb", border: "1px solid #fde68a",
    borderRadius: 10, padding: "10px 16px",
    fontSize: 13, color: "#92400e", marginBottom: 16,
    flexWrap: "wrap",
  },
  tabBar: {
    display: "flex", gap: 0, borderBottom: "1px solid #ede0d4",
    marginBottom: 16, background: "#fff",
    borderRadius: "12px 12px 0 0", overflow: "hidden",
    border: "1px solid #ede0d4", borderBottomColor: "#ede0d4",
  },
  tab: {
    padding: "12px 16px", background: "none", border: "none",
    cursor: "pointer", fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    display: "flex", alignItems: "center", gap: 6,
    transition: "color .15s", whiteSpace: "nowrap",
  },
  tabCount: {
    fontSize: 11, fontWeight: 700, borderRadius: 999,
    padding: "1px 7px", transition: "all .15s",
  },
  toolbar: {
    display: "flex", gap: 10, alignItems: "center",
    flexWrap: "wrap", marginBottom: 12,
  },
  searchWrap: {
    display: "flex", alignItems: "center", gap: 8,
    border: "1px solid #ddd0c8", borderRadius: 10,
    padding: "7px 12px", background: "#fff", flex: "0 0 220px",
  },
  searchInput: {
    border: "none", outline: "none", fontSize: 13,
    fontFamily: "'DM Sans', sans-serif", background: "transparent",
    color: "#1e1008", width: "100%",
  },
  dateRange: {
    display: "flex", alignItems: "center", gap: 6,
    border: "1px solid #ddd0c8", borderRadius: 10,
    padding: "6px 12px", background: "#fff",
  },
  dateInput: {
    border: "none", outline: "none", fontSize: 12,
    fontFamily: "'DM Sans', sans-serif", background: "transparent",
    color: "#1e1008", cursor: "pointer",
  },
  clearDate: {
    background: "none", border: "none", cursor: "pointer",
    fontSize: 12, color: "#a08070", padding: 0,
  },
  exportBtn: {
    border: "1px solid #3d2514", borderRadius: 10,
    background: "#fff", color: "#3d2514",
    padding: "8px 16px", fontSize: 13, fontWeight: 700,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    transition: "all .15s",
  },
  bulkBar: {
    display: "flex", gap: 10, alignItems: "center",
    background: "#fff", border: "1px solid #ddd0c8",
    borderRadius: 10, padding: "10px 14px", marginBottom: 12,
    animation: "fadeDown .2s ease",
  },
  bulkBtn: {
    border: "1px solid #ddd0c8", borderRadius: 8,
    background: "#f4ede4", color: "#3d2514",
    padding: "6px 14px", fontSize: 12, fontWeight: 700,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    transition: "background .15s",
  },
  tableWrap: { background: "#fff", borderRadius: 12, border: "1px solid #ede0d4", overflow: "hidden" },
  paginationBar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 20px", borderTop: "1px solid #ede0d4",
  },
  pageBtn: {
    border: "1px solid #ddd0c8", borderRadius: 8,
    background: "#fff", color: "#3d2514",
    padding: "6px 12px", fontSize: 12, fontWeight: 500,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    transition: "background .15s",
  },
};

const t = {
  table: { width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans', sans-serif" },
  thead: { borderBottom: "2px solid #ede0d4" },
  th: {
    padding: "12px 14px", fontSize: 11, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "1px",
    color: "#8a6455", textAlign: "left", whiteSpace: "nowrap",
    background: "#faf5ef",
  },
  tr: { borderBottom: "1px solid #f0e8e0", transition: "background .15s" },
  td: { padding: "13px 14px", verticalAlign: "middle", fontSize: 13 },
};

const expand = {
  wrap: {
    display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
    gap: 0, padding: "20px 20px 20px 60px",
    animation: "expandRow .2s ease",
    borderTop: "1px solid #f0e8e0",
  },
  section: {
    padding: "0 20px 0 0",
    borderRight: "1px solid #f0e8e0",
    "&:last-child": { borderRight: "none" },
  },
  sectionTitle: {
    margin: "0 0 12px", fontSize: 11, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "1px", color: "#8a6455",
  },
  itemRow: {
    display: "flex", gap: 10, alignItems: "center",
    marginBottom: 8, padding: "6px 8px",
    background: "#faf5ef", borderRadius: 8,
  },
  itemName: { margin: "0 0 2px", fontSize: 12, fontWeight: 600, color: "#1e1008" },
  itemMeta: { margin: 0, fontSize: 11, color: "#8a6455" },
  itemPrice: { fontSize: 12, fontWeight: 700, color: "#3d2514", whiteSpace: "nowrap" },
  infoBlock: { display: "grid", gap: 2 },
  infoLine: { margin: 0, fontSize: 12, color: "#5a3a26", lineHeight: 1.6 },
  trackingBadge: {
    marginTop: 8, display: "inline-flex", gap: 6,
    background: "#ede9fe", color: "#5b21b6",
    borderRadius: 999, padding: "4px 12px",
    fontSize: 11, fontWeight: 700,
  },
  noData: { margin: 0, fontSize: 12, color: "#a08070" },
  payRow: {
    display: "flex", justifyContent: "space-between",
    padding: "4px 0", borderBottom: "1px solid #f0e8e0",
  },
  payLabel: { fontSize: 11, color: "#8a6455", textTransform: "uppercase", letterSpacing: "0.5px" },
  payValue: { fontSize: 12, fontWeight: 600, color: "#1e1008" },
};

const modal = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(28,16,8,.55)",
    zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center",
    padding: 20,
  },
  box: {
    background: "#fff", borderRadius: 18, width: "100%", maxWidth: 420,
    boxShadow: "0 24px 60px rgba(0,0,0,.25)", animation: "fadeDown .2s ease",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "18px 20px 0",
  },
  title: { margin: 0, fontSize: 18, fontWeight: 700 },
  close: {
    background: "none", border: "none", fontSize: 18,
    cursor: "pointer", color: "#8a6455", padding: 4,
  },
  body: { padding: 20, display: "grid", gap: 14 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#7a5a46" },
  input: {
    border: "1px solid #d9c8b8", borderRadius: 10, padding: "10px 12px",
    fontSize: 13, outline: "none", fontFamily: "'DM Sans', sans-serif",
    background: "#fffdf9", color: "#1e1008",
  },
  primaryBtn: {
    flex: 1, border: "none", borderRadius: 10, background: "#7c3aed",
    color: "#fff", padding: "11px 20px", fontWeight: 700,
    cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
  },
  ghostBtn: {
    border: "1px solid #ddd0c8", borderRadius: 10, background: "#fff",
    color: "#5a3a26", padding: "11px 20px", fontWeight: 600,
    cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
  },
};
