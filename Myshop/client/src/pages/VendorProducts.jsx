// 


// src/pages/VendorProducts.jsx
// UPGRADED — matches Image 1 (My Products table mockup)
//
// New features added:
//   ✦ Quick Stats bar  — total / active / low stock / out of stock
//   ✦ Search           — live filter by product name
//   ✦ Filter dropdowns — Category, Status, Stock Level
//   ✦ Grid / List view toggle
//   ✦ Data table       — image · name · category · price · stock badge · status toggle · sales · actions
//   ✦ Bulk selection   — checkboxes, "Delete Selected", "Change Status", "Update Price" modal
//   ✦ Duplicate action — POST /products/:id/duplicate
//   ✦ Inline status toggle (Active ↔ Draft) per row
//   ✦ Color-coded stock badges — green / amber / red
//   ✦ Pagination       — client-side, 10 rows per page

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import vendorApi from "../services/vendorApi";

// ─── constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;
const CATEGORIES = ["All", "Outerwear", "Dresses", "Knitwear", "Footwear", "Bottoms", "Accessories", "Bags"];
const STATUS_OPTS = ["All", "Active", "Draft"];
const STOCK_OPTS = ["All", "In Stock", "Low Stock", "Out of Stock"];

// ─── helpers ──────────────────────────────────────────────────────────────────
const norm = (p) => ({
  id: p.id ?? p.Id,
  name: p.name ?? p.Name ?? "",
  price: p.price ?? p.Price ?? 0,
  stock: p.stock ?? p.Stock ?? p.quantity ?? 0,
  category: p.category ?? p.Category ?? "",
  brand: p.brand ?? p.Brand ?? "",
  description: p.description ?? p.Description ?? "",
  imageUrl: p.imageUrl ?? p.ImageUrl ?? null,
  status: p.status ?? p.Status ?? "Active",
  sales: p.sales ?? p.Sales ?? 0,
});

const stockLevel = (q) => {
  if (q <= 0) return "out";
  if (q <= 5) return "low";
  return "ok";
};

const stockBadge = (q) => {
  const lv = stockLevel(q);
  if (lv === "out") return { label: "Out of Stock", bg: "#fdeaea", color: "#8c1a1a" };
  if (lv === "low") return { label: "Low Stock", bg: "#fdf3e3", color: "#8a5000" };
  return null; // normal stock — just show the number in green
};

const fmtPrice = (n) =>
  typeof n === "number" ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—";

// ─── sub-components ───────────────────────────────────────────────────────────

function StockCell({ qty }) {
  const badge = stockBadge(qty);
  if (badge) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: badge.color }}>{qty}</span>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5, background: badge.bg, color: badge.color }}>
          {badge.label}
        </span>
      </div>
    );
  }
  return <span style={{ fontSize: 13, fontWeight: 700, color: "#1a6b3c" }}>{qty}</span>;
}

function StatusToggle({ value, onChange }) {
  const on = value === "Active";
  return (
    <button
      onClick={onChange}
      style={{
        display: "flex", alignItems: "center", gap: 5, border: "none", background: "none",
        cursor: "pointer", padding: 0,
      }}
    >
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        fontSize: 11, fontWeight: 700, padding: "3px 10px 3px 6px",
        borderRadius: 20, background: on ? "#e6f4ec" : "#f0f0f0",
        color: on ? "#1a6b3c" : "#666",
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: "50%",
          background: on ? "#22c55e" : "#aaa",
          flexShrink: 0,
        }} />
        {value}
      </span>
    </button>
  );
}

function BulkPriceModal({ count, onClose, onApply }) {
  const [mode, setMode] = useState("set");   // "set" | "increase" | "decrease"
  const [value, setValue] = useState("");
  return (
    <div style={ms.overlay}>
      <div style={ms.modal}>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>
          Update price — {count} product{count > 1 ? "s" : ""}
        </h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {["set", "increase", "decrease"].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ ...ms.modeBtn, ...(mode === m ? ms.modeBtnActive : {}) }}>
              {m === "set" ? "Set price" : m === "increase" ? "+ Increase %" : "– Decrease %"}
            </button>
          ))}
        </div>
        <input
          type="number" min="0" placeholder={mode === "set" ? "New price (EGP)" : "Percentage"}
          value={value} onChange={e => setValue(e.target.value)}
          style={{ border: "1px solid #e4d2be", borderRadius: 10, padding: "10px 12px", width: "100%", boxSizing: "border-box", fontSize: 14, marginBottom: 16 }}
        />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={ms.cancelBtn}>Cancel</button>
          <button onClick={() => onApply(mode, parseFloat(value))} style={ms.applyBtn}>Apply</button>
        </div>
      </div>
    </div>
  );
}
const ms = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "#fff", borderRadius: 18, padding: 24, width: 380, boxShadow: "0 20px 40px rgba(0,0,0,.18)" },
  modeBtn: { border: "1px solid #e4d2be", borderRadius: 8, padding: "7px 12px", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit", color: "#4a3528" },
  modeBtnActive: { background: "#2b1a12", color: "#fff", borderColor: "#2b1a12" },
  cancelBtn: { border: "1px solid #e4d2be", borderRadius: 10, padding: "10px 16px", background: "#fff", cursor: "pointer", fontWeight: 700, fontFamily: "inherit" },
  applyBtn: { border: "none", borderRadius: 10, padding: "10px 16px", background: "#2b1a12", color: "#fff", cursor: "pointer", fontWeight: 700, fontFamily: "inherit" },
};

function ProductForm({ editing, baseUrl, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: editing?.name || "", price: editing?.price || "",
    stock: editing?.stock || "", description: editing?.description || "",
    category: editing?.category || "", brand: editing?.brand || "",
    imageFile: null,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("price", form.price);
      fd.append("stock", form.stock);
      fd.append("description", form.description.trim());
      fd.append("category", form.category.trim());
      fd.append("brand", form.brand.trim());
      if (form.imageFile instanceof File) fd.append("ImageUrl", form.imageFile);
      if (!editing) fd.append("CreatedAt", new Date().toISOString());
      if (editing?.id) { await vendorApi.updateProduct(editing.id, fd); }
      else { await vendorApi.createProduct(fd); }
      onSave(editing ? "Updated successfully" : "Product created");
    } catch (err) {
      alert(`Save failed: ${err.response?.data?.message || err.message}`);
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} style={s.formGrid}>
      {[
        { name: "name", label: "Product name *", type: "text", req: true, placeholder: "Merino Wool Coat" },
        { name: "price", label: "Price (EGP) *", type: "number", req: true, placeholder: "0.00", step: "0.01" },
        { name: "stock", label: "Stock *", type: "number", req: true, placeholder: "Qty" },
        { name: "category", label: "Category", type: "text", placeholder: "Outerwear" },
        { name: "brand", label: "Brand", type: "text", placeholder: "Brand name" },
      ].map(f => (
        <div key={f.name} style={s.field}>
          <label style={s.label}>{f.label}</label>
          <input type={f.type} name={f.name} value={form[f.name]}
            onChange={handleChange} required={f.req}
            placeholder={f.placeholder} step={f.step}
            style={s.input} />
        </div>
      ))}
      <div style={s.field}>
        <label style={s.label}>{editing ? "Change image" : "Product image"}</label>
        <input type="file" accept="image/*" onChange={e => setForm(s => ({ ...s, imageFile: e.target.files[0] || null }))} style={s.input} />
        {editing?.imageUrl && !form.imageFile && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
            <img src={`${baseUrl}${editing.imageUrl}`} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} />
            <span style={{ fontSize: 11, color: "#7a5a46" }}>Current image</span>
          </div>
        )}
      </div>
      <div style={{ ...s.field, gridColumn: "1/-1" }}>
        <label style={s.label}>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange}
          rows={3} placeholder="Product description" style={{ ...s.input, resize: "vertical" }} />
      </div>
      <div style={{ gridColumn: "1/-1", display: "flex", gap: 10 }}>
        <button type="submit" disabled={saving} style={s.primaryBtn}>
          {saving ? "Saving…" : editing ? "Update product" : "Add product"}
        </button>
        <button type="button" onClick={onCancel} style={s.secondaryBtn}>Cancel</button>
      </div>
    </form>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function VendorProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [viewMode, setViewMode] = useState("list");   // "list" | "grid"
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showPriceModal, setShowPriceModal] = useState(false);

  // filters
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [stFilter, setStFilter] = useState("All");
  const [stkFilter, setStkFilter] = useState("All");
  const [page, setPage] = useState(1);

  const baseUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "https://localhost:7000";

  const load = async () => {
    setLoading(true);
    try {
      const res = await vendorApi.getProducts();
      setProducts((res.data || []).map(norm));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // ── stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter(p => p.status === "Active").length,
    low: products.filter(p => stockLevel(p.stock) === "low").length,
    out: products.filter(p => stockLevel(p.stock) === "out").length,
  }), [products]);

  // ── filtered + paginated ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = products;
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (catFilter !== "All") list = list.filter(p => p.category === catFilter);
    if (stFilter !== "All") list = list.filter(p => p.status === stFilter);
    if (stkFilter !== "All") {
      if (stkFilter === "In Stock") list = list.filter(p => stockLevel(p.stock) === "ok");
      if (stkFilter === "Low Stock") list = list.filter(p => stockLevel(p.stock) === "low");
      if (stkFilter === "Out of Stock") list = list.filter(p => stockLevel(p.stock) === "out");
    }
    return list;
  }, [products, search, catFilter, stFilter, stkFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(""), 2500); };

  // ── selection helpers ─────────────────────────────────────────────────────
  const allPageSelected = paged.length > 0 && paged.every(p => selectedIds.includes(p.id));
  const toggleAll = () => setSelectedIds(allPageSelected ? [] : paged.map(p => p.id));
  const toggleOne = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  // ── bulk actions ──────────────────────────────────────────────────────────
  const bulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} products?`)) return;
    await Promise.all(selectedIds.map(id => vendorApi.deleteProduct(id).catch(() => { })));
    setSelectedIds([]);
    flash(`Deleted ${selectedIds.length} products`);
    load();
  };

  const bulkStatus = async (status) => {
    await Promise.all(selectedIds.map(id => {
      const fd = new FormData(); fd.append("status", status);
      return vendorApi.updateProduct(id, fd).catch(() => { });
    }));
    setSelectedIds([]);
    flash(`Updated status to ${status}`);
    load();
  };

  const applyBulkPrice = async (mode, val) => {
    if (isNaN(val) || val <= 0) return;
    await Promise.all(selectedIds.map(id => {
      const product = products.find(p => p.id === id);
      if (!product) return;
      let newPrice = product.price;
      if (mode === "set") newPrice = val;
      if (mode === "increase") newPrice = +(product.price * (1 + val / 100)).toFixed(2);
      if (mode === "decrease") newPrice = +(product.price * (1 - val / 100)).toFixed(2);
      const fd = new FormData(); fd.append("price", newPrice);
      return vendorApi.updateProduct(id, fd).catch(() => { });
    }));
    setShowPriceModal(false); setSelectedIds([]);
    flash("Prices updated");
    load();
  };

  // ── per-row actions ────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await vendorApi.deleteProduct(id).catch(console.error);
    flash("Product deleted"); load();
  };

  const handleDuplicate = async (id) => {
    try {
      // POST /products/:id/duplicate — add this endpoint to your controller
      await vendorApi.duplicateProduct?.(id) ?? vendorApi.createProduct(
        (() => {
          const p = products.find(x => x.id === id); const fd = new FormData();
          fd.append("name", `${p.name} (copy)`); fd.append("price", p.price);
          fd.append("stock", p.stock); fd.append("category", p.category);
          fd.append("brand", p.brand); fd.append("description", p.description);
          return fd;
        })()
      );
      flash("Product duplicated"); load();
    } catch (err) { alert("Duplicate failed: " + err.message); }
  };

  const toggleStatus = async (product) => {
    const next = product.status === "Active" ? "Draft" : "Active";
    const fd = new FormData(); fd.append("status", next);
    await vendorApi.updateProduct(product.id, fd).catch(console.error);
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: next } : p));
  };

  const startEdit = (product) => { setEditing(product); setShowForm(true); };

  const handleFormSave = (message) => {
    flash(message); setShowForm(false); setEditing(null); load();
  };

  // ─── render ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ ...s.page, display: "grid", placeItems: "center", minHeight: "60vh" }}>
      <span style={{ color: "#7a5a46", fontFamily: "'Source Sans 3',sans-serif" }}>Loading catalog…</span>
    </div>
  );

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;800&family=Playfair+Display:wght@600&display=swap');
        .prod-row:hover { background:#fffaf5!important; }
        .prod-row { transition:background .12s; }
        .stat-card:hover { transform:translateY(-1px); box-shadow:0 8px 20px rgba(28,16,8,.10)!important; }
        .stat-card { transition:transform .15s, box-shadow .15s; }
        .action-btn:hover { background:#f4ede4!important; }
        .filter-select:focus { border-color:#c0603a!important; outline:none; }
        @media(max-width:900px){ .tbl-col-hide{display:none!important} }
      `}</style>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>My Products</h1>
        </div>
        <div style={s.headerActions}>
          <div style={s.searchWrap}>
            <span style={s.searchIcon}>🔍</span>
            <input
              placeholder="Search products…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={s.searchInput}
            />
          </div>
          {["Category", "Status", "Stock Level"].map((label, i) => (
            <select key={label} className="filter-select"
              value={[catFilter, stFilter, stkFilter][i]}
              onChange={e => {
                setPage(1);
                [setCatFilter, setStFilter, setStkFilter][i](e.target.value);
              }}
              style={s.filterSelect}>
              {[CATEGORIES, STATUS_OPTS, STOCK_OPTS][i].map(o => <option key={o}>{o}</option>)}
            </select>
          ))}
          <button onClick={() => { setEditing(null); setShowForm(true); }} style={s.addBtn}>
            + Add New Product
          </button>
        </div>
      </div>

      {msg && <div style={s.toast}>{msg}</div>}

      {/* ── Add / Edit form (collapsible) ────────────────────────────── */}
      {showForm && (
        <div style={s.formSection}>
          <div style={s.formCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                {editing ? `Edit: ${editing.name}` : "Add a new product"}
              </h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }}
                style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#7a5a46" }}>✕</button>
            </div>
            <ProductForm editing={editing} baseUrl={baseUrl} onSave={handleFormSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
          </div>
        </div>
      )}

      {/* ── Quick Stats ──────────────────────────────────────────────── */}
      <div style={s.statsSection}>
        <div style={s.statsRow}>
          {[
            { label: "Products total", value: stats.total, color: "#2b1a12", dot: null },
            { label: "Active", value: stats.active, color: "#1a6b3c", dot: "#22c55e" },
            { label: "Low Stock", value: stats.low, color: "#8a5000", dot: "#f59e0b" },
            { label: "Out of Stock", value: stats.out, color: "#8c1a1a", dot: "#ef4444" },
          ].map(st => (
            <div key={st.label} className="stat-card" style={s.statCard}>
              <div style={{ fontSize: 22, fontWeight: 800, color: st.color, display: "flex", alignItems: "center", gap: 6 }}>
                {st.dot && <span style={{ width: 10, height: 10, borderRadius: "50%", background: st.dot, display: "inline-block" }} />}
                {st.value}
              </div>
              <div style={{ fontSize: 11, color: "#7a5a46", marginTop: 3 }}>{st.label}</div>
            </div>
          ))}
          {/* View toggle */}
          <div style={s.viewToggle}>
            <button onClick={() => setViewMode("grid")} title="Grid view"
              style={{ ...s.viewBtn, ...(viewMode === "grid" ? s.viewBtnActive : {}) }}>⊞</button>
            <button onClick={() => setViewMode("list")} title="List view"
              style={{ ...s.viewBtn, ...(viewMode === "list" ? s.viewBtnActive : {}) }}>☰</button>
          </div>
        </div>
      </div>

      {/* ── Bulk action bar ──────────────────────────────────────────── */}
      {selectedIds.length > 0 && (
        <div style={s.bulkBar}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{selectedIds.length} selected</span>
          <button onClick={bulkDelete} style={s.bulkDangerBtn}>Delete Selected</button>
          <div style={{ position: "relative" }}>
            <select onChange={e => e.target.value && bulkStatus(e.target.value)} defaultValue=""
              style={s.bulkSelect}>
              <option value="" disabled>Change Status ▾</option>
              <option value="Active">Set Active</option>
              <option value="Draft">Set Draft</option>
            </select>
          </div>
          <button onClick={() => setShowPriceModal(true)} style={s.bulkBtn}>Update Price</button>
          <button onClick={() => setSelectedIds([])} style={{ ...s.bulkBtn, marginLeft: "auto" }}>Clear</button>
        </div>
      )}

      {/* ── Price modal ───────────────────────────────────────────────── */}
      {showPriceModal && (
        <BulkPriceModal count={selectedIds.length}
          onClose={() => setShowPriceModal(false)}
          onApply={applyBulkPrice} />
      )}

      {/* ── LIST VIEW ─────────────────────────────────────────────────── */}
      {viewMode === "list" && (
        <div style={s.tableSection}>
          {filtered.length === 0 ? (
            <div style={s.empty}>No products match your filters.</div>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table style={s.table}>
                  <thead>
                    <tr style={s.theadRow}>
                      <th style={{ ...s.th, width: 36, paddingRight: 0 }}>
                        <input type="checkbox" checked={allPageSelected} onChange={toggleAll}
                          style={{ cursor: "pointer" }} />
                      </th>
                      <th style={{ ...s.th, width: 60 }}>Image</th>
                      <th style={s.th}>Product Name</th>
                      <th style={s.th}>Category</th>
                      <th style={s.th}>Price</th>
                      <th style={s.th}>Stock</th>
                      <th style={s.th}>Status</th>
                      <th style={{ ...s.th }} className="tbl-col-hide">Sales</th>
                      <th style={{ ...s.th, textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map(p => (
                      <tr key={p.id} className="prod-row"
                        style={{ ...s.tr, background: selectedIds.includes(p.id) ? "#fff8f0" : "#fff" }}>
                        <td style={{ ...s.td, paddingRight: 0 }}>
                          <input type="checkbox" checked={selectedIds.includes(p.id)}
                            onChange={() => toggleOne(p.id)} style={{ cursor: "pointer" }} />
                        </td>
                        <td style={s.td}>
                          <div style={s.thumbWrap}>
                            {p.imageUrl
                              ? <img src={`${baseUrl}${p.imageUrl}`} alt={p.name} style={s.thumb} />
                              : <div style={s.thumbPlaceholder}>📦</div>
                            }
                          </div>
                        </td>
                        <td style={s.td}>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                          {p.brand && <div style={{ fontSize: 11, color: "#9a7a6a" }}>{p.brand}</div>}
                        </td>
                        <td style={s.td}>
                          <span style={s.catBadge}>{p.category || "—"}</span>
                        </td>
                        <td style={s.td}>
                          <span style={{ fontWeight: 700, fontSize: 13 }}>{fmtPrice(p.price)}</span>
                        </td>
                        <td style={s.td}><StockCell qty={p.stock} /></td>
                        <td style={s.td}>
                          <StatusToggle value={p.status} onChange={() => toggleStatus(p)} />
                        </td>
                        <td style={s.td} className="tbl-col-hide">
                          <span style={{ fontSize: 13, color: "#5c4638" }}>{p.sales}</span>
                        </td>
                        <td style={{ ...s.td, textAlign: "right" }}>
                          <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                            <button className="action-btn" title="Edit"
                              onClick={() => startEdit(p)} style={s.iconBtn}>✏️</button>
                            <button className="action-btn" title="Duplicate"
                              onClick={() => handleDuplicate(p.id)} style={s.iconBtn}>⧉</button>
                            <button className="action-btn" title="Analytics"
                              onClick={() => alert("Analytics coming soon")} style={s.iconBtn}>📊</button>
                            <button className="action-btn" title="Delete"
                              onClick={() => handleDelete(p.id)} style={{ ...s.iconBtn, color: "#c0603a" }}>🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={s.paginationRow}>
                <span style={{ fontSize: 12, color: "#7a5a46" }}>
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} products
                </span>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={s.pageBtn}>Previous</button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const n = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
                    return (
                      <button key={n} onClick={() => setPage(n)}
                        style={{ ...s.pageBtn, ...(n === page ? s.pageBtnActive : {}) }}>{n}</button>
                    );
                  })}
                  {totalPages > 5 && <span style={{ fontSize: 12, color: "#9a7a6a" }}>…{totalPages}</span>}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={s.pageBtn}>Next</button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── GRID VIEW ─────────────────────────────────────────────────── */}
      {viewMode === "grid" && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 40px" }}>
          {filtered.length === 0 ? (
            <div style={s.empty}>No products match your filters.</div>
          ) : (
            <div style={s.gridView}>
              {paged.map(p => (
                <div key={p.id} className="prod-row"
                  style={{ ...s.gridCard, outline: selectedIds.includes(p.id) ? "2px solid #c0603a" : "none" }}>
                  <div style={{ position: "relative" }}>
                    {p.imageUrl
                      ? <img src={`${baseUrl}${p.imageUrl}`} alt={p.name} style={s.gridImg} />
                      : <div style={{ ...s.gridImg, background: "#f4ede4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>📦</div>
                    }
                    <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleOne(p.id)}
                      style={{ position: "absolute", top: 8, left: 8, cursor: "pointer", width: 16, height: 16 }} />
                    {stockBadge(p.stock) && (
                      <span style={{ position: "absolute", top: 8, right: 8, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: stockBadge(p.stock).bg, color: stockBadge(p.stock).color }}>
                        {stockBadge(p.stock).label}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: "12px 14px 14px" }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "#9a7a6a", marginBottom: 8 }}>{p.category || "—"}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: 15, color: "#2b1a12" }}>{fmtPrice(p.price)}</span>
                      <StatusToggle value={p.status} onChange={() => toggleStatus(p)} />
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="action-btn" onClick={() => startEdit(p)}
                        style={{ ...s.gridBtn, flex: 1 }}>Edit</button>
                      <button className="action-btn" onClick={() => handleDelete(p.id)}
                        style={{ ...s.gridBtn, color: "#c0603a", borderColor: "#fecaca" }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────
const s = {
  page: { background: "linear-gradient(180deg,#f2e8dc 0%,#fff9f1 30%,#ffffff 70%)", minHeight: "100vh", fontFamily: "'Source Sans 3','Segoe UI',sans-serif", color: "#1d130e" },
  pageHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, maxWidth: 1200, margin: "0 auto", padding: "24px 24px 14px" },
  pageTitle: { margin: 0, fontSize: 28, fontWeight: 800, fontFamily: "'Playfair Display',serif" },
  headerActions: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  searchWrap: { position: "relative", display: "flex", alignItems: "center" },
  searchIcon: { position: "absolute", left: 10, fontSize: 13, pointerEvents: "none" },
  searchInput: { border: "1px solid #e4d2be", borderRadius: 10, padding: "8px 12px 8px 32px", fontSize: 13, background: "#fff", width: 200, fontFamily: "inherit" },
  filterSelect: { border: "1px solid #e4d2be", borderRadius: 10, padding: "8px 12px", fontSize: 13, background: "#fff", cursor: "pointer", fontFamily: "inherit", color: "#2b1a12", transition: "border-color .15s" },
  addBtn: { background: "#c0603a", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" },
  toast: { maxWidth: 1200, margin: "0 auto", padding: "0 24px 10px" },
  formSection: { maxWidth: 1200, margin: "0 auto", padding: "0 24px 16px" },
  formCard: { background: "#fff", borderRadius: 18, padding: "22px 24px", border: "1px solid #f0e1d2", boxShadow: "0 8px 24px rgba(28,16,8,.08)" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 11, color: "#7a5a46", textTransform: "uppercase", letterSpacing: ".8px", fontWeight: 700 },
  input: { border: "1px solid #e4d2be", borderRadius: 10, padding: "10px 12px", background: "#fffdf9", fontSize: 13, fontFamily: "inherit" },
  primaryBtn: { background: "#2b1a12", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13 },
  secondaryBtn: { background: "#fff", border: "1px solid #e4d2be", borderRadius: 10, padding: "10px 16px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13, color: "#2b1a12" },
  statsSection: { maxWidth: 1200, margin: "0 auto", padding: "0 24px 14px" },
  statsRow: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  statCard: { background: "#fff", border: "1px solid #f0e1d2", borderRadius: 14, padding: "12px 18px", boxShadow: "0 4px 12px rgba(28,16,8,.06)", cursor: "default" },
  viewToggle: { display: "flex", gap: 4, marginLeft: "auto", border: "1px solid #e4d2be", borderRadius: 10, overflow: "hidden" },
  viewBtn: { background: "#fff", border: "none", padding: "8px 12px", cursor: "pointer", fontSize: 16, color: "#7a5a46", transition: "background .12s" },
  viewBtnActive: { background: "#2b1a12", color: "#fff" },
  bulkBar: { display: "flex", alignItems: "center", gap: 10, maxWidth: 1200, margin: "0 auto", padding: "0 24px 12px", flexWrap: "wrap" },
  bulkBtn: { border: "1px solid #e4d2be", borderRadius: 8, padding: "7px 14px", background: "#fff", cursor: "pointer", fontWeight: 700, fontFamily: "inherit", fontSize: 12, color: "#2b1a12" },
  bulkDangerBtn: { border: "1px solid #fecaca", borderRadius: 8, padding: "7px 14px", background: "#fdeaea", cursor: "pointer", fontWeight: 700, fontFamily: "inherit", fontSize: 12, color: "#8c1a1a" },
  bulkSelect: { border: "1px solid #e4d2be", borderRadius: 8, padding: "7px 12px", background: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 12, color: "#2b1a12" },
  tableSection: { maxWidth: 1200, margin: "0 auto", padding: "0 24px 40px" },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #f0e1d2", fontSize: 13 },
  theadRow: { background: "#faf5ef", borderBottom: "1px solid #f0e1d2" },
  th: { padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#7a5a46", textTransform: "uppercase", letterSpacing: ".6px", whiteSpace: "nowrap" },
  tr: { borderBottom: "0.5px solid #f5ede4" },
  td: { padding: "12px 14px", verticalAlign: "middle" },
  thumbWrap: { width: 44, height: 44, borderRadius: 8, overflow: "hidden", background: "#f4ede4", flexShrink: 0 },
  thumb: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  thumbPlaceholder: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 },
  catBadge: { fontSize: 11, padding: "3px 9px", borderRadius: 5, background: "#f0e8de", color: "#5c3a22", fontWeight: 600 },
  iconBtn: { background: "#faf5ef", border: "1px solid #f0e1d2", borderRadius: 7, padding: "5px 7px", cursor: "pointer", fontSize: 14, lineHeight: 1, transition: "background .12s" },
  paginationRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0 0", flexWrap: "wrap", gap: 10 },
  pageBtn: { border: "1px solid #e4d2be", borderRadius: 7, padding: "5px 10px", background: "#fff", cursor: "pointer", fontSize: 12, fontFamily: "inherit", color: "#2b1a12" },
  pageBtnActive: { background: "#c0603a", color: "#fff", borderColor: "#c0603a", fontWeight: 700 },
  empty: { textAlign: "center", padding: "48px", color: "#9a7a6a", background: "#fff", borderRadius: 16, border: "1px dashed #e4d2be" },
  gridView: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 },
  gridCard: { background: "#fff", borderRadius: 16, border: "1px solid #f0e1d2", overflow: "hidden", boxShadow: "0 4px 12px rgba(28,16,8,.06)" },
  gridImg: { width: "100%", height: 180, objectFit: "cover", display: "block" },
  gridBtn: { border: "1px solid #e4d2be", borderRadius: 8, padding: "7px 10px", background: "#fff", cursor: "pointer", fontWeight: 700, fontFamily: "inherit", fontSize: 12, color: "#2b1a12", transition: "background .12s" },
};
