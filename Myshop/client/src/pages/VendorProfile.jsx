import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import vendorApi from "../services/vendorApi";
import "./VendorProfile.css";
import { withHost } from "../utils/outfitHelpers";

// ── Icons (SVG placeholders) ────────────────────────────────────────────────
const IconDashboard = () => <span>📊</span>;
const IconOrders    = () => <span>📦</span>;
const IconProducts  = () => <span>🏷️</span>;
const IconAnalytics = () => <span>📈</span>;
const IconMessages  = () => <span>✉️</span>;
const IconPromos    = () => <span>🏷️</span>;
const IconSettings  = () => <span>⚙️</span>;

const NAV_ITEMS = [
  { label: "Dashboard",   icon: <IconDashboard /> },
  { label: "Orders",      icon: <IconOrders /> },
  { label: "Products",    icon: <IconProducts /> },
  { label: "Analytics",   icon: <IconAnalytics /> },
  { label: "Messages",    icon: <IconMessages />, badge: 4 },
  { label: "Promotions",  icon: <IconPromos /> },
  { label: "Settings",    icon: <IconSettings /> },
];

export default function VendorProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [msg, setMsg]         = useState({ type: "", text: "" });
  const [tab, setTab]         = useState("All Products");
  
  // Dummy data for products (fallback if none loaded from API)
  const [products, setProducts] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profRes, prodRes] = await Promise.all([
        vendorApi.getProfile(),
        vendorApi.getProducts().catch(() => ({ data: [] }))
      ]);
      setProfile(profRes.data);
      setProducts(prodRes.data || []);
    } catch (err) {
      console.warn("Failed to load profile", err);
      // Initialize empty profile structure if not created yet
      setProfile({
        storeName: "", storeDescription: "", tagline: "", address: "", coverImage: "", storeLogo: "", isVerified: false,
        productsCount: 0, followers: 0, avgRating: 0, salesCount: 0
      });
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 3000);
  };

  // ── Cover Upload ──────────────────────────────────────────────────────────
  const handleCoverClick = () => fileInputRef.current?.click();
  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    try {
      // NOTE: Ensure your vendorApi exports uploadCover
      const res = await vendorApi.uploadCover?.(fd) 
                  || await vendorApi.post("/vendors/profile/cover", fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      setProfile(p => ({ ...p, coverImage: res.data?.coverImage || res.coverImage }));
      showMsg("success", "Cover image updated.");
    } catch (err) {
      showMsg("error", "Failed to upload cover.");
    }
  };

  if (loading) return (
    <div className="vp-root">
      <div className="vp-loading">
        <div className="vp-spinner" /> Loading dashboard...
      </div>
    </div>
  );

  const coverUrl = profile?.coverImage ? withHost(profile.coverImage) : null;
  const logoUrl  = profile?.storeLogo ? withHost(profile.storeLogo) : null;

  return (
    <div className="vp-root">
      {/* ── Sidebar ── */}
      <aside className="vp-sidebar">
        <div className="vp-logo">Maison Noir</div>
        <nav className="vp-nav">
          {NAV_ITEMS.map((item, i) => (
            <button key={item.label} className={`vp-nav-item ${i===6 ? 'active' : ''}`}>
              <span className="vp-nav-icon">{item.icon}</span>
              {item.label}
              {item.badge && <span className="vp-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="vp-sidebar-footer">
          <div className="vp-sidebar-user">
            <div className="vp-sidebar-av">
              {logoUrl ? <img src={logoUrl} alt="logo"/> : "MN"}
            </div>
            <div className="vp-sidebar-name">{profile?.storeName || "Maison Noir"}</div>
            <span style={{ fontSize: 10, color: "#8A7F74" }}>▼</span>
          </div>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <main className="vp-main">
        
        {/* ── Center Content ── */}
        <section className="vp-center">
          
          {/* Cover */}
          <div className="vp-cover">
            {coverUrl && <img src={coverUrl} alt="Cover" />}
            <button className="vp-edit-cover-btn" onClick={handleCoverClick}>
              ✎ Edit Cover
            </button>
            <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleCoverChange} />
          </div>

          {/* Profile Details */}
          <div className="vp-profile-card">
            <div className="vp-avatar-wrap">
              <div className="vp-store-av">
                {logoUrl ? <img src={logoUrl} alt="logo"/> : "MN"}
              </div>
            </div>

            <div className="vp-name-row">
              <h1 className="vp-store-name">{profile?.storeName || "Maison Noir"}</h1>
              {profile?.isVerified && <span className="vp-verified">✓</span>}
            </div>
            <p className="vp-tagline">
              {profile?.tagline || "Contemporary essentials for the modern wardrobe"}
            </p>
            <p className="vp-meta">
              📍 {profile?.address || "Paris, France"} · Member since {profile?.memberSince ? new Date(profile.memberSince).getFullYear() : "2024"}
            </p>

            <div className="vp-cta-row">
              <button className="vp-btn-dark">Edit Profile</button>
              <button className="vp-btn-outline">View as Customer</button>
              <button className="vp-btn-outline">Share Store</button>
            </div>
          </div>

          {/* Messages */}
          {msg.text && (
            <div className={`vp-msg-${msg.type}`}>{msg.text}</div>
          )}

          {/* Stats Bar */}
          <div className="vp-stats">
            {[
              { val: profile?.productsCount || 156, lbl: "Products" },
              { val: `${(profile?.followers || 2400) >= 1000 ? ((profile?.followers || 2400)/1000).toFixed(1)+'K' : (profile?.followers || 2400)}`, lbl: "Followers" },
              { val: <>{(profile?.avgRating || 4.8).toFixed(1)}<span className="vp-stat-star">★</span></>, lbl: "Rating" },
              { val: `${(profile?.salesCount || 1200) >= 1000 ? ((profile?.salesCount || 1200)/1000).toFixed(1)+'K' : (profile?.salesCount || 1200)}`, lbl: "Sales" },
            ].map(s => (
              <div key={s.lbl} className="vp-stat-col">
                <div className="vp-stat-val">{s.val}</div>
                <div className="vp-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="vp-tabs">
            {["All Products", "Collections", "Reviews (248)", "About"].map(t => (
              <button key={t} className={`vp-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {tab === "All Products" && (
            <div className="vp-products-area">
              {products.length > 0 ? (
                <div className="vp-products-grid">
                  {products.map((p, i) => (
                    <div key={p.id || i} className="vp-product-card">
                      <div className="vp-product-thumb">
                        {p.imageUrl || p.ImageUrl ? (
                           <img src={withHost(p.imageUrl || p.ImageUrl)} alt={p.name || p.Name} />
                        ) : (
                           <span className="vp-product-thumb-placeholder">👗</span>
                        )}
                      </div>
                      <div className="vp-product-info">
                        <div className="vp-product-name">{p.name || p.Name}</div>
                        <div className="vp-product-price">${(p.price || p.Price)?.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="vp-products-grid">
                  {/* Dummy fallback products matching the image */}
                  {[
                    { name: "Structured blazer", price: 158.00 },
                    { name: "Silk slip dress", price: 258.00 },
                    { name: "Leather boots", price: 120.00 },
                    { name: "Tailored coat", price: 289.00 },
                    { name: "Minimalist jewelry", price: 29.00 },
                    { name: "Minimalist jewelry", price: 28.00 },
                  ].map((p, i) => (
                    <div key={i} className="vp-product-card">
                      <div className="vp-product-thumb">
                         <span className="vp-product-thumb-placeholder">👗</span>
                      </div>
                      <div className="vp-product-info">
                        <div className="vp-product-name">{p.name}</div>
                        <div className="vp-product-price">${p.price.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "About" && (
            <div className="vp-about-area">
               <div className="vp-about-field">
                 <label>Store Description</label>
                 <textarea rows={4} readOnly value={profile?.storeDescription || "Contemporary fashion house specializing in minimalist aesthetics and sustainable materials."} />
               </div>
               <div className="vp-about-field">
                 <label>Tagline</label>
                 <input type="text" readOnly value={profile?.tagline || ""} />
               </div>
               <div className="vp-about-field">
                 <label>Address</label>
                 <input type="text" readOnly value={profile?.address || ""} />
               </div>
            </div>
          )}

        </section>

        {/* ── Right Rail ── */}
        <aside className="vp-rail">
          
          {/* Store Performance */}
          <div className="vp-rail-card">
            <div className="vp-rail-title">Store Performance</div>
            <div className="vp-sparkline">
              {/* Minimal SVG Sparkline placeholder */}
              <svg viewBox="0 0 100 30" style={{ width: "100%", height: 40, overflow: "visible" }}>
                <path d="M0,25 Q15,5 30,15 T60,10 T100,5" fill="none" stroke="#C06038" strokeWidth="2" />
                <path d="M0,25 Q15,5 30,15 T60,10 T100,5 L100,30 L0,30 Z" fill="url(#grad)" opacity="0.2" />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C06038" />
                    <stop offset="100%" stopColor="#C06038" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="vp-perf-row">
              <div className="vp-perf-stat">
                <div className="vp-perf-val">2.3K</div>
                <div className="vp-perf-lbl">Views</div>
              </div>
              <div className="vp-perf-stat">
                <div className="vp-perf-val">3.2%</div>
                <div className="vp-perf-lbl">Conversion</div>
              </div>
              <div className="vp-perf-stat">
                <div className="vp-perf-val">${profile?.totalSales >= 1000 ? ((profile?.totalSales)/1000).toFixed(1)+'K' : (profile?.totalSales || '4.2K')}</div>
                <div className="vp-perf-lbl">Revenue</div>
              </div>
            </div>
          </div>

          {/* Featured Review */}
          <div className="vp-rail-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="vp-rail-title" style={{ margin: 0 }}>Featured Review</div>
              <div className="vp-stars">★★★★★</div>
            </div>
            <div className="vp-reviewer">
              <div className="vp-reviewer-av">SD</div>
              <div className="vp-reviewer-name">Sophie D.</div>
            </div>
            <p className="vp-review-text">
              "Absolutely stunning pieces, the quality is unmatched. Fast shipping to NYC. Highly recommend!"
            </p>
            <div className="vp-review-product">
              <div className="vp-review-product-thumb">👗</div>
              <div className="vp-review-product-name">Purchased product &<br/>handbag to e.g.</div>
            </div>
          </div>

          {/* Store Settings */}
          <div className="vp-rail-card">
            <div className="vp-rail-title">Store Settings</div>
            <div className="vp-settings-list">
              {["Shipping Policies", "Return Policy", "Payment Settings", "Brand Story"].map(s => (
                <div key={s} className="vp-settings-item">
                  <span>{s}</span>
                  <span className="vp-settings-arrow">›</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Status */}
          <div className="vp-rail-card">
            <div className="vp-rail-title" style={{ marginBottom: 10 }}>Verification Status</div>
            <div className="vp-verified-badge">
              <div className="vp-verified-icon">✓</div>
              <div className="vp-verified-text">
                <div className="vp-vt-main">Verified Seller</div>
                <div className="vp-vt-sub">Fashion Marketplace Partner</div>
              </div>
            </div>
          </div>

        </aside>

      </main>

      {/* Toast Overlay */}
      {msg.text && (
        <div className="vp-toast">{msg.text}</div>
      )}
    </div>
  );
}
