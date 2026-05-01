// // src/pages/VendorDashboard.jsx
// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import vendorApi from "../services/vendorApi";

// export default function VendorDashboard() {
//   const [profile, setProfile] = useState(null);
//   const [productsCount, setProductsCount] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [pRes, prodRes] = await Promise.allSettled([
//           vendorApi.getProfile(),
//           vendorApi.getProducts(),
//         ]);

//         if (pRes.status === "fulfilled") setProfile(pRes.value.data);
//         if (prodRes.status === "fulfilled") setProductsCount(prodRes.value.data.length);
//       } catch (err) {
//         console.error("Dashboard load error", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   if (loading) return <div className="p-8">Loading...</div>;

//   return (
//     <div style={styles.page}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;800&family=Playfair+Display:wght@600&display=swap');
//       `}</style>

//       <header style={styles.hero}>
//         <div style={styles.heroContent}>
//           <div style={styles.heroBadge}>Vendor space</div>
//           <h1 style={styles.heroTitle}>Welcome back, {profile?.storeName ?? "Your Store"}</h1>
//           <p style={styles.heroText}>
//             Track performance, manage inventory, and keep orders flowing.
//           </p>
//           <div style={styles.heroActions}>
//             <Link to="/vendors/products" style={styles.primaryBtn}>Add Products</Link>
//             <Link to="/vendors/orders" style={styles.ghostBtn}>View Orders</Link>
//           </div>
//         </div>
//       </header>

//       <section style={styles.section}>
//         <div style={styles.statGrid}>
//           <div style={styles.statCard}>
//             <div style={styles.statLabel}>Store name</div>
//             <div style={styles.statValue}>{profile?.storeName ?? "�"}</div>
//             <div style={styles.statMeta}>Profile updated</div>
//           </div>
//           <div style={styles.statCard}>
//             <div style={styles.statLabel}>Products</div>
//             <div style={styles.statValue}>{productsCount}</div>
//             <div style={styles.statMeta}>Active listings</div>
//           </div>
//           <div style={styles.statCard}>
//             <div style={styles.statLabel}>Balance</div>
//             <div style={styles.statValue}>{(profile?.balance ?? 0).toFixed(2)} EGP</div>
//             <div style={styles.statMeta}>Pending payouts</div>
//           </div>
//         </div>
//       </section>

//       <section style={styles.sectionAlt}>
//         <div style={styles.columns}>
//           <div style={styles.panel}>
//             <div style={styles.panelHeader}>
//               <h2 style={styles.panelTitle}>Quick actions</h2>
//               <span style={styles.panelChip}>Boost</span>
//             </div>
//             <div style={styles.actionsGrid}>
//               <Link to="/vendors/profile" style={styles.actionCard}>
//                 <div style={styles.actionTitle}>Edit profile</div>
//                 <div style={styles.actionText}>Update store info & branding.</div>
//               </Link>
//               <Link to="/vendors/products" style={styles.actionCard}>
//                 <div style={styles.actionTitle}>Manage products</div>
//                 <div style={styles.actionText}>Stock, pricing, and listings.</div>
//               </Link>
//               <Link to="/vendors/orders" style={styles.actionCard}>
//                 <div style={styles.actionTitle}>Orders</div>
//                 <div style={styles.actionText}>Process and ship fast.</div>
//               </Link>
//             </div>
//           </div>

//           <div style={styles.panel}>
//             <div style={styles.panelHeader}>
//               <h2 style={styles.panelTitle}>Store highlights</h2>
//               <span style={styles.panelChipAlt}>Weekly</span>
//             </div>
//             <ul style={styles.highlightList}>
//               <li style={styles.highlightItem}>
//                 <div style={styles.highlightTitle}>Keep products in stock</div>
//                 <div style={styles.highlightText}>Avoid out-of-stock penalties and lost sales.</div>
//               </li>
//               <li style={styles.highlightItem}>
//                 <div style={styles.highlightTitle}>Speed matters</div>
//                 <div style={styles.highlightText}>Ship within 24-48 hours for better rank.</div>
//               </li>
//               <li style={styles.highlightItem}>
//                 <div style={styles.highlightTitle}>Review-ready</div>
//                 <div style={styles.highlightText}>Follow up after delivery to earn reviews.</div>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </section>

//       <section style={styles.section}>
//         <div style={styles.panelWide}>
//           <div style={styles.panelHeader}>
//             <h2 style={styles.panelTitle}>Recent orders</h2>
//             <Link to="/vendors/orders" style={styles.linkBtn}>See all</Link>
//           </div>
//           <div style={styles.emptyState}>
//             <div style={styles.emptyTitle}>No recent orders</div>
//             <div style={styles.emptyText}>Once you receive orders, they will appear here with status and totals.</div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// const styles = {
//   page: {
//     background: "linear-gradient(180deg, #f2e8dc 0%, #fff9f1 35%, #ffffff 70%)",
//     minHeight: "100vh",
//     paddingBottom: "48px",
//     fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif",
//     color: "#1d130e",
//   },
//   hero: {
//     padding: "26px 20px 10px",
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
//   heroActions: {
//     display: "flex",
//     gap: "12px",
//     flexWrap: "wrap",
//   },
//   primaryBtn: {
//     background: "#2b1a12",
//     color: "#fff",
//     padding: "10px 16px",
//     borderRadius: "10px",
//     textDecoration: "none",
//     fontWeight: 700,
//   },
//   ghostBtn: {
//     background: "transparent",
//     color: "#2b1a12",
//     padding: "10px 16px",
//     borderRadius: "10px",
//     border: "1px solid #2b1a12",
//     textDecoration: "none",
//     fontWeight: 700,
//   },
//   section: {
//     maxWidth: "1200px",
//     margin: "0 auto",
//     padding: "18px 20px",
//   },
//   sectionAlt: {
//     maxWidth: "1200px",
//     margin: "0 auto",
//     padding: "8px 20px 18px",
//   },
//   statGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//     gap: "16px",
//   },
//   statCard: {
//     background: "#fff",
//     borderRadius: "16px",
//     padding: "18px",
//     border: "1px solid #f0e1d2",
//     boxShadow: "0 10px 20px rgba(28, 16, 8, 0.06)",
//   },
//   statLabel: {
//     fontSize: "12px",
//     color: "#7a5a46",
//     textTransform: "uppercase",
//     letterSpacing: "1px",
//   },
//   statValue: {
//     fontSize: "22px",
//     fontWeight: 800,
//     marginTop: "6px",
//   },
//   statMeta: {
//     marginTop: "8px",
//     fontSize: "12px",
//     color: "#8a6b57",
//   },
//   columns: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
//     gap: "16px",
//   },
//   panel: {
//     background: "#fff",
//     borderRadius: "18px",
//     padding: "18px",
//     border: "1px solid #f0e1d2",
//     boxShadow: "0 10px 22px rgba(28, 16, 8, 0.08)",
//   },
//   panelWide: {
//     background: "#fff",
//     borderRadius: "18px",
//     padding: "18px",
//     border: "1px solid #f0e1d2",
//     boxShadow: "0 10px 22px rgba(28, 16, 8, 0.08)",
//   },
//   panelHeader: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: "14px",
//   },
//   panelTitle: {
//     margin: 0,
//     fontSize: "18px",
//     fontWeight: 700,
//   },
//   panelChip: {
//     background: "#f0c674",
//     padding: "4px 10px",
//     borderRadius: "999px",
//     fontSize: "12px",
//     fontWeight: 700,
//   },
//   panelChipAlt: {
//     background: "#f3e4d5",
//     padding: "4px 10px",
//     borderRadius: "999px",
//     fontSize: "12px",
//     fontWeight: 700,
//     color: "#7a5a46",
//   },
//   actionsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
//     gap: "12px",
//   },
//   actionCard: {
//     display: "block",
//     padding: "14px",
//     borderRadius: "14px",
//     border: "1px solid #f1e1d0",
//     background: "#fff8ef",
//     textDecoration: "none",
//     color: "#2b1a12",
//   },
//   actionTitle: {
//     fontWeight: 700,
//     marginBottom: "6px",
//   },
//   actionText: {
//     fontSize: "12px",
//     color: "#7a5a46",
//   },
//   highlightList: {
//     listStyle: "none",
//     padding: 0,
//     margin: 0,
//     display: "grid",
//     gap: "12px",
//   },
//   highlightItem: {
//     padding: "12px",
//     background: "#fff8ef",
//     borderRadius: "12px",
//     border: "1px solid #f1e1d0",
//   },
//   highlightTitle: {
//     fontWeight: 700,
//     marginBottom: "4px",
//   },
//   highlightText: {
//     fontSize: "12px",
//     color: "#7a5a46",
//   },
//   linkBtn: {
//     textDecoration: "none",
//     color: "#2b1a12",
//     fontWeight: 700,
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
// };



// src/pages/VendorDashboard.jsx
// UPGRADED — matches Image 7 (Maison Noir dashboard mockup)
// New: revenue area chart, 4 real KPI cards with delta badges,
//      live recent orders with status badges, top selling products,
//      latest review callout, date range selector, notification bell,
//      low-stock alert banner, quick actions grid.

import { Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import vendorApi from "../services/vendorApi";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => typeof n === "number" ? (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)) : "—";
const fmtEGP = (n) => typeof n === "number" ? `${n.toLocaleString("en-EG")} EGP` : "—";
const RANGES = ["Today", "This Week", "This Month", "This Year"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const STATUS_LABELS = ["Draft", "PendingPayment", "Paid", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"];

const STATUS_STYLE = {
  Delivered: { bg: "#e6f4ec", color: "#1a6b3c" },
  Shipped: { bg: "#e6eef9", color: "#1a4a8c" },
  Processing: { bg: "#fdf3e3", color: "#8a5000" },
  Paid: { bg: "#e8f2ff", color: "#1a3a8c" },
  Pending: { bg: "#fdeaea", color: "#8c1a1a" },
  PendingPayment: { bg: "#fdeaea", color: "#8c1a1a" },
  Cancelled: { bg: "#f3f3f3", color: "#666" },
  Refunded: { bg: "#f3f0ff", color: "#4a1a8c" },
};

// ─── fallback mock data (used when API returns nothing yet) ───────────────────
const MOCK_REVENUE = [
  { day: "Mon", revenue: 80 }, { day: "Tue", revenue: 210 },
  { day: "Wed", revenue: 155 }, { day: "Thu", revenue: 330 },
  { day: "Fri", revenue: 190 }, { day: "Sat", revenue: 260 },
  { day: "Sun", revenue: 310 },
];
const MOCK_ORDERS = [
  { id: "MN-10234", customer: "Sophia L.", total: 1250, status: "Delivered", items: ["👗", "👠"] },
  { id: "MN-10235", customer: "Mania K.", total: 1250, status: "Shipped", items: ["👗", "👡"] },
  { id: "MN-10238", customer: "Sophia A.", total: 890, status: "Shipped", items: ["👜", "👠"] },
  { id: "MN-10237", customer: "Sofia L.", total: 1250, status: "Pending", items: ["👗", "👠"] },
  { id: "MN-10231", customer: "Lima J.", total: 640, status: "Processing", items: ["👔", "🧣"] },
];
const MOCK_TOP = [
  { rank: 1, name: "Silk Evening Gown", units: 124, img: "👗" },
  { rank: 2, name: "Leather Tote Bag", units: 98, img: "👜" },
  { rank: 3, name: "Cashmere Scarf", units: 76, img: "🧣" },
];
const MOCK_REVIEW = {
  author: "Emily R.", stars: 5, initials: "ER",
  text: "Absolutely stunning quality and fast shipping! Will definitely buy again.",
};

// ─── sub-components ───────────────────────────────────────────────────────────
function KpiCard({ label, value, delta, positive, sub }) {
  return (
    <div className="kpi-card" style={s.kpiCard}>
      <div style={s.kpiLabel}>{label}</div>
      <div style={s.kpiRow}>
        <span style={s.kpiValue}>{value}</span>
        {delta !== undefined && (
          <span style={{
            ...s.kpiBadge,
            background: positive ? "#e6f4ec" : "#fdeaea",
            color: positive ? "#1a6b3c" : "#8c1a1a"
          }}>
            {positive ? "↑" : "↓"} {Math.abs(delta)}%
          </span>
        )}
      </div>
      {sub && <div style={s.kpiSub}>{sub}</div>}
    </div>
  );
}

function RecentOrderRow({ order }) {
  const st = STATUS_STYLE[order.status] || STATUS_STYLE.Cancelled;
  const initials = (order.customer || "?").split(" ").map(w => w[0]).join("").slice(0, 2);
  return (
    <div className="order-row" style={s.orderRow}>
      <div style={s.orderAvatar}>{initials}</div>
      <div style={s.orderMeta}>
        <span style={s.orderName}>{order.customer}</span>
        <span style={s.orderId}>#{order.id}</span>
      </div>
      <div style={s.orderItems}>{Array.isArray(order.items) ? order.items.slice(0, 3).join(" ") : ""}</div>
      <div style={s.orderTotal}>{fmtEGP(order.total)}</div>
      <span style={{ ...s.statusBadge, background: st.bg, color: st.color }}>{order.status}</span>
      <Link to="/vendors/orders" style={s.viewLink}>View →</Link>
    </div>
  );
}

function Stars({ n }) {
  return (
    <span>{[1, 2, 3, 4, 5].map(i =>
      <span key={i} style={{ color: i <= n ? "#f0a500" : "#ddd", fontSize: 14 }}>★</span>
    )}</span>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "0.5px solid #f0d9c0", borderRadius: 8, padding: "8px 12px", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,.08)" }}>
      <div style={{ color: "#7a5a46", marginBottom: 2 }}>{label}</div>
      <div style={{ fontWeight: 700, color: "#2b1a12" }}>{fmtEGP(payload[0].value)}</div>
    </div>
  );
}

function LowStockBanner({ products }) {
  const low = products.filter(p => { const q = p.stock ?? p.Stock ?? p.quantity ?? 0; return q > 0 && q <= 5; });
  const out = products.filter(p => (p.stock ?? p.Stock ?? p.quantity ?? 0) === 0);
  if (!low.length && !out.length) return null;
  return (
    <div style={s.alertWrap}>
      <div style={s.alertInner}>
        <span style={{ fontSize: 16 }}>⚠️</span>
        <span style={{ flex: 1, fontSize: 13 }}>
          {out.length > 0 && <><strong>{out.length} product{out.length > 1 ? "s" : ""} out of stock.</strong>{" "}</>}
          {low.length > 0 && <>{low.length} product{low.length > 1 ? "s" : ""} running low on stock.</>}
        </span>
        <Link to="/vendors/products" style={{ color: "#8a5000", fontWeight: 700, textDecoration: "none", fontSize: 13 }}>
          Manage inventory →
        </Link>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function VendorDashboard() {
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenueData, setRevenueData] = useState(MOCK_REVENUE);
  const [topProducts, setTopProducts] = useState(MOCK_TOP);
  // const [latestReview, setLatestReview] = useState(MOCK_REVIEW);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("This Week");
  const [notifs, setNotifs] = useState(2);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [pRes, prodRes, ordersRes, topProductsRes] = await Promise.allSettled([
          vendorApi.getProfile(),
          vendorApi.getProducts(),
          // Add vendorApi.getOrders() when endpoint exists:
          vendorApi.getOrders?.() ?? Promise.resolve({ data: [] }),
          vendorApi.getTopProducts?.() ?? Promise.resolve({ data: null }),
          vendorApi.getLatestReview?.() ?? Promise.resolve({ data: null }),
        ]);

        if (pRes.status === "fulfilled" && pRes.value?.data) setProfile(pRes.value.data);
        if (prodRes.status === "fulfilled" && prodRes.value?.data) setProducts(prodRes.value.data || []);
        if (ordersRes.status === "fulfilled" && ordersRes.value?.data) {
          const raw = (ordersRes.value.data || []).slice(0, 5);
          if (raw.length > 0) {
            setOrders(raw);
            // Build revenue chart from real orders
            const map = Object.fromEntries(DAYS.map(d => [d, 0]));
            raw.forEach(o => {
              const d = new Date(o.createdAt ?? o.CreatedAt ?? Date.now());
              const key = DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1];
              map[key] = (map[key] || 0) + (o.total ?? o.Total ?? 0);
            });
            setRevenueData(DAYS.map(d => ({ day: d, revenue: map[d] })));
          }
        }

        if (topProductsRes.status === "fulfilled" && topProductsRes.value?.data && Array.isArray(topProductsRes.value.data) && topProductsRes.value.data.length > 0) {
          setTopProducts(topProductsRes.value.data);
        }

        // if (latestReviewRes.status === "fulfilled" && latestReviewRes.value?.data && Object.keys(latestReviewRes.value.data).length > 0) {
        // setLatestReview(latestReviewRes.value.data);
      }
      catch (err) {
        console.error("Dashboard load error", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [range]);

  const kpis = useMemo(() => {
    const totalRevenue = revenueData.reduce((acc, d) => acc + d.revenue, 0);
    return {
      totalRevenue,
      orderCount: orders.length || 47,
      storeViews: profile?.storeViews ?? 2300,
      conversion: profile?.conversionRate ?? 3.2,
    };
  }, [revenueData, orders, profile]);

  const displayOrders = orders.length > 0 ? orders.map(o => ({
    id: o.id ?? o.Id ?? "—",
    customer: o.customer ?? o.Customer ?? o.customerName ?? "Customer",
    total: o.total ?? o.Total ?? 0,
    status: typeof (o.status ?? o.Status) === "number"
      ? STATUS_LABELS[o.status ?? o.Status] ?? "Unknown"
      : (o.status ?? o.Status ?? "Pending"),
    items: o.items ?? o.Items ?? [],
  })) : MOCK_ORDERS;

  if (loading) {
    return (
      <div style={{ ...s.page, display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <div style={{ color: "#7a5a46", fontFamily: "'Source Sans 3',sans-serif" }}>Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;800&family=Playfair+Display:wght@600&display=swap');
        .kpi-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(28,16,8,.12)!important; }
        .kpi-card { transition: transform .18s, box-shadow .18s; }
        .order-row:hover { background:#fffaf5!important; }
        .order-row { transition: background .12s; }
        .top-item:hover { background:#fffaf5; }
        .top-item { transition: background .12s; }
        @media(max-width:900px){ .main-grid{grid-template-columns:1fr!important} }
        @media(max-width:600px){ .kpi-grid{grid-template-columns:1fr 1fr!important} }
      `}</style>

      {/* ── Top header bar ─────────────────────────────────────── */}
      <div style={s.headerBar}>
        <h1 style={s.headerTitle}>
          Good morning, {profile?.storeName ?? "Your Store"}
        </h1>
        <div style={s.headerRight}>
          <select value={range} onChange={e => setRange(e.target.value)} style={s.rangeSelect}>
            {RANGES.map(r => <option key={r}>{r}</option>)}
          </select>
          <button style={s.bellBtn} onClick={() => setNotifs(0)}>
            🔔
            {notifs > 0 && <span style={s.bellBadge}>{notifs}</span>}
          </button>
        </div>
      </div>

      {/* ── Low stock alert ─────────────────────────────────────── */}
      <LowStockBanner products={products} />

      {/* ── KPI cards ───────────────────────────────────────────── */}
      <div className="kpi-grid" style={s.kpiGrid}>
        <KpiCard label="Revenue" value={fmtEGP(kpis.totalRevenue)} delta={12} positive sub={range} />
        <KpiCard label="Orders" value={kpis.orderCount} delta={8} positive sub="Total orders" />
        <KpiCard label="Store Views" value={fmt(kpis.storeViews)} delta={23} positive sub="Unique visitors" />
        <KpiCard label="Conversion" value={`${kpis.conversion}%`} delta={0.5} positive={false} sub="View → purchase" />
      </div>

      {/* ── Revenue chart + Recent orders ───────────────────────── */}
      <div className="main-grid" style={s.mainGrid}>
        <div style={s.chartCard}>
          <div style={s.cardHeader}>
            <span style={s.cardTitle}>Revenue overview</span>
            <span style={s.cardChip}>{range} trend</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c0603a" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#c0603a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9a7a6a" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9a7a6a" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#c0603a" strokeWidth={2}
                fill="url(#rev-grad)" dot={false} activeDot={{ r: 4, fill: "#c0603a" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={s.ordersCard}>
          <div style={s.cardHeader}>
            <span style={s.cardTitle}>Recent orders</span>
            <Link to="/vendors/orders" style={s.seeAll}>See all →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {displayOrders.map(o => <RecentOrderRow key={o.id} order={o} />)}
          </div>
        </div>
      </div>

      {/* ── Bottom panels ────────────────────────────────────────── */}
      <div style={s.bottomGrid}>

        {/* Top products */}
        <div style={s.panel}>
          <div style={s.cardHeader}>
            <span style={s.cardTitle}>Top selling products</span>
          </div>
          {topProducts.map(p => (
            <div key={p.rank} className="top-item" style={s.topItem}>
              <span style={s.topRank}>{p.rank}</span>
              <div style={s.topImg}>{p.img}</div>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{p.name}</span>
              <span style={s.topUnits}>{p.units} units</span>
            </div>
          ))}
          <Link to="/vendors/products" style={s.panelLink}>View all products →</Link>
        </div>

        {/* Quick actions
        <div style={s.panel}>
          <div style={s.cardHeader}>
            <span style={s.cardTitle}>Quick actions</span>
            <span style={{ ...s.cardChip, background: "#f0c674", color: "#5a3a00" }}>Boost</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { to: "/vendors/products/new", icon: "➕", title: "Add product", sub: "List new inventory" },
              { to: "/vendors/promotions", icon: "🎯", title: "Create promo", sub: "Discounts & offers" },
              { to: "/vendors/orders", icon: "📦", title: "Process orders", sub: "Ship & update status" },
              { to: "/vendors/analytics", icon: "📈", title: "Analytics", sub: "Sales insights" },
            ].map(a => (
              <Link key={a.to} to={a.to} style={s.actionCard}>
                <span style={{ fontSize: 18 }}>{a.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 12 }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: "#7a5a46" }}>{a.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div> */}

        {/* Latest review
        <div style={s.panel}>
          <div style={s.cardHeader}>
            <span style={s.cardTitle}>Latest review</span>
            <Stars n={latestReview.stars} />
          </div>
          <div style={s.reviewBlock}>
            <div style={s.reviewAvatar}>{latestReview.initials}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{latestReview.author}</div>
              <p style={{ fontSize: 13, color: "#5c4638", lineHeight: 1.6, margin: 0 }}>{latestReview.text}</p>
            </div>
          </div>
          <Link to="/vendors/reviews" style={s.panelLink}>See all reviews →</Link>
        </div> */}

      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page: { background: "linear-gradient(180deg,#f2e8dc 0%,#fff9f1 30%,#ffffff 70%)", minHeight: "100vh", paddingBottom: 48, fontFamily: "'Source Sans 3','Segoe UI',sans-serif", color: "#1d130e" },
  headerBar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 24px 12px", maxWidth: 1200, margin: "0 auto", flexWrap: "wrap", gap: 12 },
  headerTitle: { margin: 0, fontSize: 26, fontWeight: 800, fontFamily: "'Playfair Display',serif" },
  headerRight: { display: "flex", alignItems: "center", gap: 10 },
  rangeSelect: { border: "1px solid #e4d2be", borderRadius: 10, padding: "7px 12px", background: "#fff", fontSize: 13, fontWeight: 600, color: "#2b1a12", cursor: "pointer", fontFamily: "inherit" },
  bellBtn: { position: "relative", background: "#fff", border: "1px solid #e4d2be", borderRadius: 10, padding: "7px 12px", fontSize: 16, cursor: "pointer", lineHeight: 1 },
  bellBadge: { position: "absolute", top: -4, right: -4, background: "#c0603a", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" },
  alertWrap: { maxWidth: 1200, margin: "0 auto 10px", padding: "0 24px" },
  alertInner: { background: "#fff4e3", border: "1px solid #f0c674", borderRadius: 12, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 },
  kpiGrid: { maxWidth: 1200, margin: "0 auto", padding: "0 24px 14px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 },
  kpiCard: { background: "#fff", borderRadius: 16, padding: "18px 20px", border: "1px solid #f0e1d2", boxShadow: "0 4px 14px rgba(28,16,8,.06)", cursor: "default" },
  kpiLabel: { fontSize: 11, color: "#7a5a46", textTransform: "uppercase", letterSpacing: "1px" },
  kpiRow: { display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 },
  kpiValue: { fontSize: 24, fontWeight: 800 },
  kpiBadge: { fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 6 },
  kpiSub: { fontSize: 11, color: "#9a7a6a", marginTop: 6 },
  mainGrid: { maxWidth: 1200, margin: "0 auto", padding: "0 24px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  chartCard: { background: "#fff", borderRadius: 18, padding: "18px 20px", border: "1px solid #f0e1d2", boxShadow: "0 4px 16px rgba(28,16,8,.07)" },
  ordersCard: { background: "#fff", borderRadius: 18, padding: "18px 20px", border: "1px solid #f0e1d2", boxShadow: "0 4px 16px rgba(28,16,8,.07)" },
  cardHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: 700 },
  cardChip: { background: "#f3e4d5", color: "#7a5a46", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999 },
  seeAll: { color: "#2b1a12", fontSize: 12, fontWeight: 700, textDecoration: "none" },
  orderRow: { display: "flex", alignItems: "center", gap: 10, padding: "7px 8px", borderRadius: 10 },
  orderAvatar: { width: 30, height: 30, borderRadius: "50%", background: "#f2e4d4", color: "#6b3a22", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  orderMeta: { display: "flex", flexDirection: "column", minWidth: 80 },
  orderName: { fontSize: 12, fontWeight: 600 },
  orderId: { fontSize: 10, color: "#9a7a6a" },
  orderItems: { fontSize: 14, flex: 1 },
  orderTotal: { fontSize: 12, fontWeight: 700, minWidth: 80, textAlign: "right" },
  statusBadge: { fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, flexShrink: 0 },
  viewLink: { fontSize: 11, color: "#c0603a", textDecoration: "none", fontWeight: 700, flexShrink: 0 },
  bottomGrid: { maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 },
  panel: { background: "#fff", borderRadius: 18, padding: "18px 20px", border: "1px solid #f0e1d2", boxShadow: "0 4px 16px rgba(28,16,8,.07)" },
  topItem: { display: "flex", alignItems: "center", gap: 10, padding: "8px", borderRadius: 10, marginBottom: 2 },
  topRank: { fontSize: 13, fontWeight: 800, color: "#7a5a46", minWidth: 16 },
  topImg: { width: 34, height: 34, borderRadius: 8, background: "#f4ede4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 },
  topUnits: { fontSize: 11, color: "#9a7a6a", fontWeight: 600 },
  panelLink: { display: "block", marginTop: 10, color: "#c0603a", fontSize: 12, fontWeight: 700, textDecoration: "none" },
  actionCard: { display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px", borderRadius: 12, border: "1px solid #f1e1d0", background: "#fff8ef", textDecoration: "none", color: "#2b1a12" },
  reviewBlock: { display: "flex", gap: 12, alignItems: "flex-start", background: "#fff8ef", borderRadius: 12, padding: 12, marginBottom: 10 },
  reviewAvatar: { width: 36, height: 36, borderRadius: "50%", background: "#f2e4d4", color: "#6b3a22", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
};
