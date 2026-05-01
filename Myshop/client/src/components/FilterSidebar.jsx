import { useEffect, useState } from "react";

export default function FilterSidebar({ categories = [], brands = [], filters, setFilters, onApply }) {
  const [local, setLocal] = useState(filters);
  useEffect(() => setLocal(filters), [filters]);
  const set = (k, v) => setLocal((p) => ({ ...p, [k]: v }));

  const reset = () => {
    const blank = { search: "", category: "", brand: "", min: "", max: "", sort: "new", page: 1 };
    setLocal(blank); setFilters(blank); onApply?.();
  };


  return (
    <aside style={s.sidebar}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        .fs-select:focus, .fs-input:focus { border-color:#8a6455; outline:none; }
        .fs-apply:hover { background:#1a0d07; }
        .fs-reset:hover { background:#f2e8e0; }
      `}</style>

      <h3 style={s.heading}>Filters</h3>

      <div style={s.group}>
        <label style={s.label}>Category</label>
        <select className="fs-select" value={local.category || ""} onChange={(e) => set("category", e.target.value)} style={s.select}>
          <option value="">All</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={s.group}>
        <label style={s.label}>Brand</label>
        <select className="fs-select" value={local.brand || ""} onChange={(e) => set("brand", e.target.value)} style={s.select}>
          <option value="">All</option>
          {brands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div style={s.group}>
        <label style={s.label}>Price range (EGP)</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input className="fs-input" type="number" value={local.min || ""} onChange={(e) => set("min", e.target.value)} placeholder="Min" style={s.input} />
          <input className="fs-input" type="number" value={local.max || ""} onChange={(e) => set("max", e.target.value)} placeholder="Max" style={s.input} />
        </div>
      </div>

      <div style={s.group}>
        <label style={s.label}>Sort by</label>
        <select className="fs-select" value={local.sort || "new"} onChange={(e) => set("sort", e.target.value)} style={s.select}>
          <option value="new">Newest</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
        <button className="fs-apply" style={s.applyBtn} onClick={() => { setFilters(local); onApply?.(); }}>Apply</button>
        <button className="fs-reset" style={s.resetBtn} onClick={reset}>Reset</button>
      </div>
    </aside>
  );
}

const s = {
  sidebar: { fontFamily: "'DM Sans',sans-serif", display: "grid", gap: "14px", padding: "18px", background: "#fff", border: "1px solid #ede0d4", borderRadius: "14px" },
  heading: { margin: 0, fontSize: "16px", fontWeight: 700, color: "#1e1008" },
  group: { display: "grid", gap: "6px" },
  label: { fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "#7a5a46", fontWeight: 700 },
  select: { border: "1px solid #d9c8b8", borderRadius: "10px", padding: "9px 12px", fontSize: "14px", fontFamily: "inherit", background: "#fff", transition: "border-color .14s" },
  input: { flex: 1, border: "1px solid #d9c8b8", borderRadius: "10px", padding: "9px 10px", fontSize: "14px", fontFamily: "inherit", minWidth: 0, transition: "border-color .14s" },
  applyBtn: { flex: 1, border: "none", borderRadius: "10px", background: "#3d2514", color: "#fff", padding: "10px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: "14px", transition: "background .14s" },
  resetBtn: { flex: 1, border: "1px solid #d9c8b8", borderRadius: "10px", background: "#fff", color: "#3d2514", padding: "10px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: "14px", transition: "background .14s" },
};
