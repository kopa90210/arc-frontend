import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

// ── Helpers ────────────────────────────────────────────────────────────────

function StarRating({ rating = 0, count }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <polygon
            points="6,1 7.5,4.5 11,4.8 8.5,7.2 9.2,11 6,9.2 2.8,11 3.5,7.2 1,4.8 4.5,4.5"
            fill={i <= full ? "#c7622a" : (i === full + 1 && half ? "url(#half)" : "#e5d5c5")}
            stroke="none"
          />
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="#c7622a" />
              <stop offset="50%" stopColor="#e5d5c5" />
            </linearGradient>
          </defs>
        </svg>
      ))}
      {count != null && (
        <span style={{ fontSize: 11, color: "#9a7a6a", marginLeft: 2 }}>({count})</span>
      )}
    </div>
  );
}

function PriceRangeSlider({ min, max, value, onChange }) {
  // Dual-thumb range slider using two overlapping inputs
  const [lo, setLo] = useState(value[0]);
  const [hi, setHi] = useState(value[1]);

  const pct = (v) => ((v - min) / (max - min)) * 100;

  const handleLo = (e) => {
    const v = Math.min(Number(e.target.value), hi - 1);
    setLo(v); onChange([v, hi]);
  };
  const handleHi = (e) => {
    const v = Math.max(Number(e.target.value), lo + 1);
    setHi(v); onChange([lo, v]);
  };

  return (
    <div style={{ padding: "8px 0" }}>
      <style>{`
        .price-range-wrap { position: relative; height: 28px; }
        .price-range-wrap input[type=range] {
          position: absolute; width: 100%; height: 4px;
          background: transparent; pointer-events: none;
          -webkit-appearance: none; appearance: none;
        }
        .price-range-wrap input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 16px; height: 16px; border-radius: 50%;
          background: #c7622a; cursor: pointer;
          pointer-events: all; border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        .price-range-track {
          position: absolute; top: 12px; left: 0; right: 0;
          height: 4px; background: #e5d5c5; border-radius: 2px;
        }
        .price-range-fill {
          position: absolute; height: 4px; background: #c7622a; border-radius: 2px;
        }
      `}</style>
      <div className="price-range-wrap">
        <div className="price-range-track">
          <div className="price-range-fill" style={{
            left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%`
          }} />
        </div>
        <input type="range" min={min} max={max} value={lo} onChange={handleLo} />
        <input type="range" min={min} max={max} value={hi} onChange={handleHi} />
      </div>
      <div style={{
        display: "flex", justifyContent: "space-between", marginTop: 6,
        fontSize: 12, color: "#7a5a46"
      }}>
        <span>${lo}</span><span>${hi}</span>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function Products() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [hoveredId, setHoveredId] = useState(null);
  const [viewMode, setViewMode] = useState("grid");   // "grid" | "list"
  const [addingId, setAddingId] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    min: searchParams.get("min") || "0",
    max: searchParams.get("max") || "1000",
    sort: searchParams.get("sort") || "new",
    page: parseInt(searchParams.get("page") || "1", 10),
    pageSize: 12,
  });

  // Sidebar checkbox state
  const [checkedCategories, setCheckedCategories] = useState(
    filters.category ? filters.category.split(",") : []
  );
  const [checkedBrands, setCheckedBrands] = useState(
    filters.brand ? filters.brand.split(",") : []
  );
  const [priceRange, setPriceRange] = useState([
    parseInt(filters.min) || 0,
    parseInt(filters.max) || 1000
  ]);

  useEffect(() => { fetchMeta(); loadWishlist(); }, []);

  useEffect(() => {
    loadProducts();
    const p = {};
    Object.entries(filters).forEach(([k, v]) => { if (v || v === 0) p[k] = String(v); });
    setSearchParams(p);
  }, [filters]);

  const fetchMeta = async () => {
    try {
      const [c, b] = await Promise.all([
        api.get("/products/meta/categories"),
        api.get("/products/meta/brands")
      ]);
      setCategories(c.data || []);
      setBrands(b.data || []);
    } catch { /* meta endpoints optional */ }
  };

  const loadWishlist = async () => {
    try {
      const res = await api.get("/wishlist");
      const ids = new Set(res.data.map(w => w.productId));
      setWishlist(ids);
    } catch  {
      // Wishlist requires auth, so ignore 401
      console.log("Wishlist not available (not authenticated)");
    }
  };

  const loadProducts = async () => {
    try {
      const res = await api.get("/products", {
        params: {
          search: filters.search,
          category: filters.category,
          brand: filters.brand,
          min: filters.min,
          max: filters.max,
          sort: filters.sort,
          page: filters.page,
          pageSize: filters.pageSize,
        }
      });
      setProducts(res.data.items ?? res.data ?? []);
      setTotal(res.data.total ?? res.data?.length ?? 0);
      setTotalPages(Math.ceil((res.data.total ?? 12) / filters.pageSize));
    } catch (err) { console.error("Error loading products:", err); }
  };

  const addToCart = async (productId, e) => {
    e?.preventDefault(); e?.stopPropagation();
    setAddingId(productId);
    try {
      await api.post("/cart/items", { ProductId: productId, quantity: 1 });
      // If CartContext is available: refreshCart()
    } catch (err) { console.error(err); }
    finally { setAddingId(null); }
  };

  const toggleWishlist = async (id, e) => {
    e?.preventDefault(); e?.stopPropagation();
    try {
      if (wishlist.has(id)) {
        await api.delete(`/wishlist/${id}`);
        setWishlist(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } else {
        await api.post("/wishlist", { ProductId: id });
        setWishlist(prev => {
          const next = new Set(prev);
          next.add(id);
          return next;
        });
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      // Gracefully handle auth errors by falling back to in-memory state
      setWishlist(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    }
  };

  const applyCategories = (cats) => {
    setCheckedCategories(cats);
    setFilters(f => ({ ...f, category: cats.join(","), page: 1 }));
  };

  const applyBrands = (brs) => {
    setCheckedBrands(brs);
    setFilters(f => ({ ...f, brand: brs.join(","), page: 1 }));
  };

  const clearAll = () => {
    setCheckedCategories([]); setCheckedBrands([]);
    setPriceRange([0, 1000]);
    setFilters(f => ({ ...f, category: "", brand: "", min: "0", max: "1000", page: 1 }));
  };

  const paginationPages = () => {
    const pages = [];
    const p = filters.page, t = totalPages;
    if (t <= 7) { for (let i = 1; i <= t; i++) pages.push(i); }
    else {
      pages.push(1);
      if (p > 3) pages.push("…");
      if (p > 2) pages.push(p - 1);
      if (p !== 1 && p !== t) pages.push(p);
      if (p < t - 1) pages.push(p + 1);
      if (p < t - 2) pages.push("…");
      pages.push(t);
    }
    return [...new Set(pages)];
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={s.page}>
      <style>{globalCss}</style>

      {/* ── Top nav ──────────────────────────────────────────────────────── */}
      <header style={s.nav}>
        <Link to="/" style={s.logo}>MyShop</Link>
        <div style={s.searchBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9a7a6a" strokeWidth="2" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="nav-search"
            placeholder="Search for products, brands, or styles"
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
          />
        </div>
        <nav style={s.navLinks}>
          {["Women", "Men", "New Arrivals", "Brands"].map(n => (
            <a key={n} style={s.navLink} href="#">{n}</a>
          ))}
        </nav>
        <div style={s.navIcons}>
          <IconBtn title="Notifications"><BellIcon /></IconBtn>
          <IconBtn title="Messages"><ChatIcon /></IconBtn>
          <IconBtn title="Wishlist" badge={wishlist.size}>
            <HeartIconOutline />
          </IconBtn>
          <Link to="/cart" style={{ ...s.iconBtn, textDecoration: "none" }}>
            <CartIcon />
          </Link>
          <div style={s.avatar} />
        </div>
      </header>

      {/* ── Body: sidebar + main ─────────────────────────────────────────── */}
      <div style={s.body}>

        {/* ── Left sidebar ─────────────────────────────────────────────── */}
        <aside style={s.sidebar}>
          <div style={s.sidebarHead}>
            <span style={s.sidebarTitle}>Filter</span>
            <button style={s.clearBtn} onClick={clearAll}>Clear All</button>
          </div>

          <SideSection title="Category">
            {(categories.length ? categories : DEFAULT_CATEGORIES).map(c => (
              <CheckRow
                key={c} label={c}
                checked={checkedCategories.includes(c)}
                onChange={checked => applyCategories(
                  checked ? [...checkedCategories, c] : checkedCategories.filter(x => x !== c)
                )}
              />
            ))}
          </SideSection>

          <SideSection title="Price Range">
            <PriceRangeSlider
              min={0} max={1000}
              value={priceRange}
              onChange={([lo, hi]) => {
                setPriceRange([lo, hi]);
                setFilters(f => ({ ...f, min: String(lo), max: String(hi), page: 1 }));
              }}
            />
          </SideSection>

          <SideSection title="Brand">
            {(brands.length ? brands : DEFAULT_BRANDS).map(b => (
              <CheckRow
                key={b} label={b}
                checked={checkedBrands.includes(b)}
                onChange={checked => applyBrands(
                  checked ? [...checkedBrands, b] : checkedBrands.filter(x => x !== b)
                )}
              />
            ))}
          </SideSection>

          <button style={s.applyBtn} onClick={() => setFilters(f => ({ ...f, page: 1 }))}>
            Apply Filters
          </button>
        </aside>

        {/* ── Main content ──────────────────────────────────────────────── */}
        <main style={s.main}>
          {/* Breadcrumb */}
          <nav style={s.breadcrumb}>
            <a href="#" style={s.breadLink}>Home</a>
            
            {/* <a href="#" style={s.breadLink}>Women</a> */}
            <Chevron />
            <span style={{ color: "#2b1a12" }}>All Products</span>
          </nav>

          {/* Toolbar */}
          <div style={s.toolbar}>
            <span style={s.resultCount}>{total} products</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <select
                style={s.sortSelect}
                value={filters.sort}
                onChange={e => setFilters(f => ({ ...f, sort: e.target.value, page: 1 }))}
              >
                <option value="new">Sort by: Newest</option>
                <option value="popular">Sort by: Popular</option>
                <option value="priceAsc">Price: Low → High</option>
                <option value="priceDesc">Price: High → Low</option>
              </select>
              {/* View toggle */}
              <button
                style={{ ...s.viewBtn, background: viewMode === "grid" ? "#f0e5d8" : "transparent" }}
                onClick={() => setViewMode("grid")} title="Grid view"
              ><GridIcon /></button>
              <button
                style={{ ...s.viewBtn, background: viewMode === "list" ? "#f0e5d8" : "transparent" }}
                onClick={() => setViewMode("list")} title="List view"
              ><ListIcon /></button>
            </div>
          </div>

          {/* Product grid */}
          <div style={viewMode === "grid" ? s.grid : s.listView}>
            {products.map(p => (
              <ProductCard
                key={p.id}
                p={p}
                viewMode={viewMode}
                hovered={hoveredId === p.id}
                wishlisted={wishlist.has(p.id)}
                adding={addingId === p.id}
                onHover={() => setHoveredId(p.id)}
                onLeave={() => setHoveredId(null)}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>

          {/* Pagination */}
          <div style={s.pagination}>
            <button
              style={{ ...s.pageBtn, opacity: filters.page <= 1 ? 0.4 : 1 }}
              disabled={filters.page <= 1}
              onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
            >Prev</button>

            {paginationPages().map((pg, i) => (
              pg === "…"
                ? <span key={`e${i}`} style={s.pageDots}>…</span>
                : <button
                  key={pg}
                  style={{ ...s.pageBtn, ...(filters.page === pg ? s.pageBtnActive : {}) }}
                  onClick={() => setFilters(f => ({ ...f, page: pg }))}
                >{pg}</button>
            ))}

            <button
              style={{ ...s.pageBtn, opacity: filters.page >= totalPages ? 0.4 : 1 }}
              disabled={filters.page >= totalPages}
              onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
            >Next ›</button>
          </div>
        </main>
      </div>
    </div>
  );
}

// ── ProductCard ─────────────────────────────────────────────────────────────

function ProductCard({ p, viewMode, hovered, wishlisted, adding, onHover, onLeave, onAddToCart, onToggleWishlist }) {
  const isNew = p.isNew ?? (new Date() - new Date(p.createdAt ?? p.CreatedAt)) < 7 * 86400000;
  const isSoldOut = p.stock === 0;
  const salePrice = p.salePrice ?? p.SalePrice ?? null;
  const rating = p.rating ?? p.Rating ?? (Math.random() * 2 + 3).toFixed(1); // fallback demo
  const ratingCount = p.ratingCount ?? null;
  const brand = p.brand ?? p.Brand ?? "";
  const imageUrl = p.imageUrl ? `https://localhost:7000${p.imageUrl}` : "/no-image.png";

  if (viewMode === "list") {
    return (
      <div className="product-list-row" style={s.listRow}>
        <div style={{ position: "relative", flexShrink: 0, width: 120, height: 120, borderRadius: 12, overflow: "hidden", background: "#f6f0e9" }}>
          <img src={imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {isSoldOut && <div style={s.soldOutBadge}>Sold Out</div>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: "#9a7a6a", marginBottom: 2 }}>{brand}</div>
          <Link to={`/products/${p.id}`} style={{ textDecoration: "none", color: "#1d130e" }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
          </Link>
          <StarRating rating={Number(rating)} count={ratingCount} />
          <div style={{ marginTop: 6, display: "flex", gap: 8, alignItems: "center" }}>
            {salePrice
              ? <><span style={{ fontWeight: 800, color: "#c7622a", fontSize: 16 }}>${salePrice}</span>
                <span style={{ color: "#aaa", textDecoration: "line-through", fontSize: 13 }}>${p.price}</span></>
              : <span style={{ fontWeight: 800, color: "#1d130e", fontSize: 16 }}>{p.price} EGP</span>
            }
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button style={s.cardAddBtn} disabled={isSoldOut} onClick={e => onAddToCart(p.id, e)}>
            {adding ? "Adding…" : "Add to Bag"}
          </button>
          <button style={s.heartBtn} onClick={e => onToggleWishlist(p.id, e)}>
            {wishlisted ? <HeartIconFilled /> : <HeartIconOutline />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="product-card"
      style={s.card}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Image area */}
      <div style={{ position: "relative", overflow: "hidden", background: "#f6f0e9" }}>
        <Link to={`/products/${p.id}`} tabIndex={-1}>
          <img
            src={imageUrl}
            alt={p.name}
            style={{ ...s.cardImg, transform: hovered ? "scale(1.04)" : "scale(1)" }}
          />
        </Link>

        {/* "New" badge */}
        {isNew && !isSoldOut && (
          <span style={s.newBadge}>New</span>
        )}

        {/* "Sold Out" overlay */}
        {isSoldOut && (
          <div style={s.soldOverlay}>
            <span style={s.soldText}>Sold Out</span>
          </div>
        )}

        {/* Hover overlay — Quick View + Add to Bag */}
        {!isSoldOut && (
          <div style={{ ...s.hoverOverlay, opacity: hovered ? 1 : 0, pointerEvents: hovered ? "all" : "none" }}>
            <Link to={`/products/${p.id}`} style={s.overlayBtn} onClick={e => e.stopPropagation()}>
              Quick View
            </Link>
            <button style={s.overlayBtn} onClick={e => onAddToCart(p.id, e)} disabled={adding}>
              {adding ? "Adding…" : "Add to Bag"}
            </button>
          </div>
        )}

        {/* Star rating overlay (bottom right of image) */}
        <div style={s.ratingBadge}>
          <StarRating rating={Number(rating)} count={ratingCount} />
        </div>

        {/* Wishlist heart */}
        <button style={s.heartBtn} onClick={e => onToggleWishlist(p.id, e)}>
          {wishlisted ? <HeartIconFilled /> : <HeartIconOutline />}
        </button>
      </div>

      {/* Card body */}
      <Link to={`/products/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <div style={s.cardBody}>
          <div style={s.cardBrand}>{brand}</div>
          <div style={s.cardName}>{p.name}</div>
          <div style={s.cardPriceRow}>
            {salePrice ? (
              <>
                <span style={{ color: "#aaa", textDecoration: "line-through", fontSize: 13 }}>${p.price}</span>
                <span style={{ fontWeight: 800, color: "#c7622a", fontSize: 16, marginLeft: 6 }}>${salePrice}</span>
              </>
            ) : (
              <span style={s.cardPrice}>{p.price} EGP</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function SideSection({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: "#1d130e", marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function CheckRow({ label, checked, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontSize: 14, color: "#3d2514" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ accentColor: "#c7622a", width: 15, height: 15, cursor: "pointer" }}
      />
      {label}
    </label>
  );
}

function IconBtn({ children, badge, title }) {
  return (
    <button style={s.iconBtn} title={title}>
      {children}
      {badge > 0 && <span style={s.badge}>{badge}</span>}
    </button>
  );
}

function Chevron() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a7a6a" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>;
}
function BellIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>; }
function ChatIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>; }
function HeartIconOutline() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>; }
function HeartIconFilled() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="#c7622a" stroke="#c7622a" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>; }
function CartIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>; }
function GridIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>; }
function ListIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>; }

// ── Defaults (shown when API returns no meta) ───────────────────────────────
const DEFAULT_CATEGORIES = ["Tops", "Dresses", "Pants", "Shoes", "Accessories", "Bags"];
const DEFAULT_BRANDS = ["Totême", "A.P.C.", "Arket", "COS", "Jacquemus", "Sandro"];

// ── Global CSS ──────────────────────────────────────────────────────────────
const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  .nav-search {
    all: unset; width: 100%; font-size: 14px; color: #1d130e;
    font-family: 'DM Sans', sans-serif;
  }
  .nav-search::placeholder { color: #b09585; }
  .product-card { transition: box-shadow 0.2s; }
  .product-card:hover { box-shadow: 0 16px 40px rgba(28,16,8,0.13) !important; }
  .product-list-row:hover { background: #fdf8f3 !important; }
`;

// ── Styles ──────────────────────────────────────────────────────────────────
const s = {
  page: {
    background: "#f5ede3",
    minHeight: "100vh",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: "#1d130e",
  },
  // ── Nav ──
  nav: {
    background: "#fff",
    borderBottom: "1px solid #ede0d2",
    padding: "0 28px",
    height: 64,
    display: "flex",
    alignItems: "center",
    gap: 20,
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 10px rgba(28,16,8,0.06)",
  },
  logo: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 26,
    fontWeight: 400,
    color: "#1d130e",
    letterSpacing: "-0.5px",
    textDecoration: "none",
    flexShrink: 0,
  },
  searchBox: {
    flex: "0 1 420px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: "1px solid #e5d5c5",
    borderRadius: 999,
    padding: "8px 16px",
    background: "#fdfaf7",
  },
  navLinks: {
    display: "flex",
    gap: 24,
    marginLeft: 8,
  },
  navLink: {
    fontSize: 14,
    fontWeight: 500,
    color: "#1d130e",
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
  navIcons: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px 8px",
    borderRadius: 8,
    color: "#3d2514",
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 2, right: 2,
    background: "#c7622a",
    color: "#fff",
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 700,
    padding: "1px 5px",
    minWidth: 16,
    textAlign: "center",
  },
  avatar: {
    width: 34, height: 34,
    borderRadius: "50%",
    background: "#e5d5c5",
    marginLeft: 6,
    cursor: "pointer",
  },
  // ── Body layout ──
  body: {
    display: "flex",
    maxWidth: 1280,
    margin: "0 auto",
    padding: "24px 20px",
    gap: 24,
    alignItems: "flex-start",
  },
  // ── Sidebar ──
  sidebar: {
    width: 240,
    flexShrink: 0,
    background: "#fff",
    borderRadius: 16,
    padding: "20px 18px 24px",
    border: "1px solid #ede0d2",
    position: "sticky",
    top: 88,
    maxHeight: "calc(100vh - 100px)",
    overflowY: "auto",
  },
  sidebarHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1d130e",
  },
  clearBtn: {
    background: "none",
    border: "none",
    color: "#c7622a",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    padding: 0,
  },
  applyBtn: {
    width: "100%",
    background: "#c7622a",
    color: "#fff",
    border: "none",
    borderRadius: 999,
    padding: "12px 0",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 8,
  },
  // ── Main ──
  main: {
    flex: 1,
    minWidth: 0,
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    marginBottom: 16,
  },
  breadLink: {
    color: "#9a7a6a",
    textDecoration: "none",
    fontSize: 13,
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  resultCount: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1d130e",
    fontFamily: "'DM Serif Display', serif",
  },
  sortSelect: {
    border: "1px solid #e5d5c5",
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: 13,
    color: "#1d130e",
    background: "#fff",
    cursor: "pointer",
    outline: "none",
  },
  viewBtn: {
    border: "1px solid #e5d5c5",
    borderRadius: 8,
    padding: "6px 8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    color: "#3d2514",
  },
  // ── Grid ──
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 16,
  },
  // ── List view ──
  listView: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  listRow: {
    background: "#fff",
    border: "1px solid #ede0d2",
    borderRadius: 14,
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    transition: "background 0.15s",
  },
  // ── Card ──
  card: {
    background: "#fff",
    borderRadius: 14,
    border: "1px solid #ede0d2",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "box-shadow 0.2s",
  },
  cardImg: {
    width: "100%",
    height: 260,
    objectFit: "cover",
    display: "block",
    transition: "transform 0.35s ease",
  },
  newBadge: {
    position: "absolute",
    top: 12, left: 12,
    background: "#c7622a",
    color: "#fff",
    fontWeight: 700,
    fontSize: 11,
    padding: "4px 10px",
    borderRadius: 999,
    letterSpacing: "0.8px",
    textTransform: "uppercase",
  },
  soldOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(245,237,227,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  soldText: {
    fontSize: 15,
    fontWeight: 700,
    color: "#6b4c3b",
    letterSpacing: "1px",
  },
  hoverOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(28,16,8,0.18)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "opacity 0.2s",
  },
  overlayBtn: {
    background: "#c7622a",
    color: "#fff",
    border: "none",
    borderRadius: 999,
    padding: "10px 28px",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    textDecoration: "none",
    display: "block",
    textAlign: "center",
    minWidth: 140,
    fontFamily: "'DM Sans', sans-serif",
  },
  ratingBadge: {
    position: "absolute",
    bottom: 8, left: 8,
    background: "rgba(255,255,255,0.9)",
    borderRadius: 8,
    padding: "3px 7px",
  },
  heartBtn: {
    position: "absolute",
    top: 10, right: 10,
    background: "rgba(255,255,255,0.88)",
    border: "none",
    borderRadius: "50%",
    width: 34, height: 34,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    color: "#3d2514",
  },
  cardBody: {
    padding: "12px 14px 14px",
  },
  cardBrand: {
    fontSize: 12,
    color: "#9a7a6a",
    marginBottom: 2,
  },
  cardName: {
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.3,
    color: "#1d130e",
  },
  cardPriceRow: {
    marginTop: 6,
    display: "flex",
    alignItems: "center",
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 800,
    color: "#1d130e",
  },
  cardAddBtn: {
    background: "#c7622a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  },
  soldOutBadge: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(245,237,227,0.75)",
    fontSize: 13,
    fontWeight: 700,
    color: "#6b4c3b",
  },
  // ── Pagination ──
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 32,
  },
  pageBtn: {
    minWidth: 38, height: 38,
    border: "1px solid #e5d5c5",
    borderRadius: 10,
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
    color: "#1d130e",
    fontWeight: 500,
    padding: "0 10px",
  },
  pageBtnActive: {
    background: "#c7622a",
    color: "#fff",
    borderColor: "#c7622a",
    fontWeight: 700,
  },
  pageDots: {
    padding: "0 4px",
    color: "#9a7a6a",
  },
};
