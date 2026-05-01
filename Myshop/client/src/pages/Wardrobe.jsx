// import { useEffect, useMemo, useState } from "react";
// import api from "../services/api";
// import { withHost } from "../config/env";

// const CATEGORY_OPTIONS = ["Shirt", "Jeans", "Shoes", "Jacket", "Dress", "Accessories"];
// const SEASON_OPTIONS = ["Spring", "Summer", "Autumn", "Winter", "All Season"];

// // const SEASON_ICON = {
// //   Spring: "🌸",
// //   Summer: "☀️",
// //   Autumn: "🍂",
// //   Winter: "❄️",
// //   "All Season": "🌍",
// // };

// export default function Wardrobe() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [message, setMessage] = useState("");
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [form, setForm] = useState({ name: "", category: "Shirt", color: "", season: "All Season", brand: "" });
//   const [imageFile, setImageFile] = useState(null);

//   const loadItems = async () => {
//     try {
//       const res = await api.get("/user-items/me");
//       setItems(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error(err);
//       setMessage("Could not load wardrobe items.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { loadItems(); }, []);

//   const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setMessage(""); setSubmitting(true);
//     try {
//       const fd = new FormData();
//       Object.entries(form).forEach(([k, v]) => { if (v?.trim?.() || typeof v === "boolean") fd.append(k, v); });
//       if (imageFile) fd.append("image", imageFile);
//       await api.post("/user-items/me", fd, { headers: { "Content-Type": "multipart/form-data" } });
//       setForm({ name: "", category: "Shirt", color: "", season: "All Season", brand: "" });
//       setImageFile(null);
//       setMessage("✓ Item added to your wardrobe.");
//       await loadItems();
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Failed to add item.");
//     } finally { setSubmitting(false); }
//   };

//   const filtered = useMemo(() =>
//     activeCategory === "All" ? items : items.filter((i) => i.category === activeCategory),
//     [items, activeCategory]
//   );

//   const allCats = ["All", ...CATEGORY_OPTIONS];

//   return (
//     <div style={s.page}>
//       <style>{`
//            @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;700&display=swap');
//            .wrd-card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(40,20,8,.13); }
//            .wrd-card { transition: transform .18s, box-shadow .18s; }
//            .cat-pill:hover { background: #3d2514; color: #fff; }
//            .add-btn:hover:not(:disabled) { background: #1a0d07; }
//          `}</style>

//       {/* ── Header ── */}
//       <div style={s.hero}>
//         <div>
//           <p style={s.eyebrow}>Your collection</p>
//           <h1 style={s.heroTitle}>Wardrobe</h1>
//           <p style={s.heroSub}>{items.length} {items.length === 1 ? "piece" : "pieces"} catalogued</p>
//         </div>
//       </div>

//       {/* ── Add form ── */}
//       <div style={s.formCard}>
//         <h2 style={s.sectionTitle}>Add new item</h2>
//         {message && <div style={message.startsWith("✓") ? s.successNote : s.errorNote}>{message}</div>}
//         <form onSubmit={onSubmit} style={s.formGrid}>
//           <label style={s.field}>
//             <span style={s.label}>Item name</span>
//             <input name="name" value={form.name} onChange={onChange} placeholder="Linen shirt" required style={s.input} />
//           </label>
//           <label style={s.field}>
//             <span style={s.label}>Category</span>
//             <select name="category" value={form.category} onChange={onChange} style={s.input}>
//               {CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
//             </select>
//           </label>
//           <label style={s.field}>
//             <span style={s.label}>Color</span>
//             <input name="color" value={form.color} onChange={onChange} placeholder="Navy blue" required style={s.input} />
//           </label>
//           <label style={s.field}>
//             <span style={s.label}>Season</span>
//             <select name="season" value={form.season} onChange={onChange} style={s.input}>
//               {SEASON_OPTIONS.map((s) => <option key={s}>{s}</option>)}
//             </select>
//           </label>
//           <label style={s.field}>
//             <span style={s.label}>Brand (optional)</span>
//             <input name="brand" value={form.brand} onChange={onChange} placeholder="Zara" style={s.input} />
//           </label>
//           <label style={s.field}>
//             <span style={s.label}>Photo</span>
//             <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
//           </label>
//           <button type="submit" disabled={submitting} className="add-btn" style={s.addBtn}>
//             {submitting ? "Adding…" : "+ Add to Wardrobe"}
//           </button>
//         </form>
//       </div>

//       {/* ── Items grid ── */}
//       <div style={s.listSection}>
//         <div style={s.catRow}>
//           {allCats.map((c) => (
//             <button key={c} className="cat-pill" onClick={() => setActiveCategory(c)}
//               style={{ ...s.catPill, ...(activeCategory === c ? s.catPillActive : {}) }}>
//               {c}
//             </button>
//           ))}
//         </div>

//         {loading ? (
//           <p style={{ color: "#8a6455" }}>Loading wardrobe…</p>
//         ) : filtered.length === 0 ? (
//           <div style={s.emptyState}>
//             <div style={s.emptyIcon}>👔</div>
//             <p>No items in this category yet.</p>
//           </div>
//         ) : (
//           <div style={s.grid}>
//             {filtered.map((item) => (
//               <article key={item.id} className="wrd-card" style={s.card}>
//                 {item.imageUrl ? (
//                   <img src={withHost(item.imageUrl)} alt={item.name} style={s.cardImg} />
//                 ) : (
//                   <div style={s.cardImgPlaceholder}>
//                     <span style={{ fontSize: 36 }}>👔</span>
//                   </div>
//                 )}
//                 <div style={s.cardBody}>
//                   <h3 style={s.cardName}>{item.name}</h3>
//                   <div style={s.cardMeta}>
//                     <span style={s.pill}>{item.category}</span>
//                     <span style={s.pill}>{item.season}</span>
//                   </div>
//                   <p style={s.cardDetail}>{item.color}{item.brand ? ` · ${item.brand}` : ""}</p>
//                 </div>
//               </article>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// const s = {
//   page: { display: "grid", gap: "24px", paddingBottom: "40px", fontFamily: "'DM Sans', sans-serif", color: "#1e1008" },
//   hero: { background: "linear-gradient(135deg,#3d2514 0%,#6b3a22 100%)", borderRadius: "18px", padding: "32px 28px", color: "#fff" },
//   eyebrow: { margin: "0 0 6px", fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", opacity: .7 },
//   heroTitle: { margin: "0 0 6px", fontSize: "38px", fontWeight: 400, fontFamily: "'DM Serif Display', serif" },
//   heroSub: { margin: 0, opacity: .75, fontSize: "15px" },
//   formCard: { background: "#fff", border: "1px solid #ede0d4", borderRadius: "16px", padding: "22px" },
//   sectionTitle: { margin: "0 0 16px", fontSize: "20px", fontWeight: 700 },
//   successNote: { background: "#e8f8ef", color: "#1a6b3a", padding: "10px 14px", borderRadius: "10px", marginBottom: "14px", fontSize: "14px" },
//   errorNote: { background: "#fef0ee", color: "#9b2b1a", padding: "10px 14px", borderRadius: "10px", marginBottom: "14px", fontSize: "14px" },
//   formGrid: { display: "grid", gap: "14px", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", alignItems: "end" },
//   field: { display: "grid", gap: "6px" },
//   label: { fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "#7a5a46", fontWeight: 700 },
//   input: { border: "1px solid #d9c8b8", borderRadius: "10px", padding: "10px 12px", fontSize: "14px", outline: "none", fontFamily: "inherit" },
//   addBtn: { height: "44px", border: "none", borderRadius: "10px", background: "#3d2514", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "14px", fontFamily: "inherit", transition: "background .15s" },
//   listSection: { display: "grid", gap: "18px" },
//   catRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
//   catPill: { border: "1px solid #d9c8b8", borderRadius: "999px", padding: "6px 16px", background: "#fff", color: "#5a3a26", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all .15s", fontFamily: "inherit" },
//   catPillActive: { background: "#3d2514", color: "#fff", border: "1px solid #3d2514" },
//   emptyState: { textAlign: "center", padding: "48px", color: "#8a6455" },
//   emptyIcon: { fontSize: "48px", marginBottom: "12px" },
//   grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" },
//   card: { border: "1px solid #ede0d4", borderRadius: "14px", overflow: "hidden", background: "#fffdf9" },
//   cardImg: { width: "100%", height: "180px", objectFit: "cover", display: "block" },
//   cardImgPlaceholder: { width: "100%", height: "180px", display: "grid", placeItems: "center", background: "#f4ede4" },
//   cardBody: { padding: "12px 14px 14px" },
//   cardName: { margin: "0 0 8px", fontSize: "15px", fontWeight: 700 },
//   cardMeta: { display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "6px" },
//   pill: { background: "#f2e8e0", color: "#5a3a26", borderRadius: "999px", padding: "2px 10px", fontSize: "11px", fontWeight: 600 },
//   cardDetail: { margin: 0, fontSize: "12px", color: "#7a5a46" },
// };

import { useEffect, useMemo, useState, useCallback } from "react";
import api from "../services/api";
import { withHost } from "../config/env";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_OPTIONS = ["Shirt", "Jeans", "Shoes", "Jacket", "Dress", "Accessories"];
const SEASON_OPTIONS = ["Spring", "Summer", "Autumn", "Winter", "All Season"];
const COLOR_OPTIONS = ["Black", "White", "Navy", "Beige", "Brown", "Grey", "Cream", "Terracotta", "Sage", "Other"];

const CATEGORY_ICON = {
  Shirt: "👕", Jeans: "👖", Shoes: "👟",
  Jacket: "🧥", Dress: "👗", Accessories: "💍",
};

const SEASON_PALETTE = {
  Spring: "#d4edbc",
  Summer: "#fce4a8",
  Autumn: "#f2c9a0",
  Winter: "#c6d8f5",
  "All Season": "#e5d5f5",
};

// ─── Utility ──────────────────────────────────────────────────────────────────

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...chip,
        background: active ? "#3d2514" : "#fff",
        color: active ? "#fff" : "#5a3a26",
        border: active ? "1px solid #3d2514" : "1px solid #ddd0c8",
        fontWeight: active ? 700 : 500,
      }}
    >
      {label}
    </button>
  );
}

function ColorSwatch({ color, active, onClick }) {
  const swatchColors = {
    Black: "#1a1a1a", White: "#f7f5f0", Navy: "#1e2d5a",
    Beige: "#d4b896", Brown: "#6b3e26", Grey: "#9a9a9a",
    Cream: "#f4ead8", Terracotta: "#c4765a", Sage: "#6d8c70",
    Other: "linear-gradient(135deg,#f06,#0cf)",
  };
  const bg = swatchColors[color] || "#ccc";
  return (
    <button
      title={color}
      onClick={onClick}
      style={{
        width: 26, height: 26, borderRadius: "50%",
        background: bg,
        border: active ? "2px solid #3d2514" : "2px solid transparent",
        outline: active ? "2px solid #fff" : "none",
        outlineOffset: active ? "-4px" : 0,
        cursor: "pointer", transition: "all .15s", flexShrink: 0,
      }}
    />
  );
}

function WardrobeItemCard({ item, onAddToOutfit, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setDeleting(true);
    await onDelete(item.id);
    setDeleting(false);
  };

  return (
    <article
      style={{ ...itemCard, boxShadow: hovered ? "0 8px 24px rgba(40,20,8,.14)" : itemCard.boxShadow }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        {item.imageUrl ? (
          <img
            src={withHost(item.imageUrl)}
            alt={item.name}
            style={{
              ...cardImg,
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform .35s ease",
            }}
          />
        ) : (
          <div style={cardImgPlaceholder}>
            <span style={{ fontSize: 32 }}>{CATEGORY_ICON[item.category] || "👔"}</span>
          </div>
        )}

        {/* Season badge */}
        <div style={{
          position: "absolute", top: 8, left: 8,
          background: SEASON_PALETTE[item.season] || "#eee",
          borderRadius: 999, padding: "2px 10px",
          fontSize: 11, fontWeight: 700, color: "#3d2514",
        }}>
          {item.season}
        </div>

        {/* Hover overlay */}
        <div style={{
          ...hoverOverlay,
          opacity: hovered ? 1 : 0,
          pointerEvents: hovered ? "all" : "none",
        }}>
          <button
            style={overlayBtnPrimary}
            onClick={(e) => { e.stopPropagation(); onAddToOutfit(item); }}
          >
            + Add to Outfit
          </button>
          <button
            style={overlayBtnDanger}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Removing…" : "Remove"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={cardBody}>
        <p style={cardName}>{item.name}</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
          <span style={pillStyle}>{item.category}</span>
          {item.brand && <span style={pillStyle}>{item.brand}</span>}
        </div>
        <p style={cardMeta}>{item.color}</p>
      </div>
    </article>
  );
}

function AddItemDrawer({ open, onClose, onAdded }) {
  const [form, setForm] = useState({ name: "", category: "Shirt", color: "", season: "All Season", brand: "" });
  const [imageFile, setImg] = useState(null);
  const [submitting, setSub] = useState(false);
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(""); setSub(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v?.trim?.()) fd.append(k, v); });
      if (imageFile) fd.append("image", imageFile);
      const res = await api.post("/user-items/me", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setMsg("✓ Added successfully");
      setForm({ name: "", category: "Shirt", color: "", season: "All Season", brand: "" });
      setImg(null);
      onAdded(res.data);
      setTimeout(() => { setMsg(""); onClose(); }, 900);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to add item.");
    } finally { setSub(false); }
  };

  if (!open) return null;

  return (
    <div style={drawerOverlay} onClick={onClose}>
      <div style={drawerPanel} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Add new piece</h2>
          <button onClick={onClose} style={iconBtn}>✕</button>
        </div>

        {msg && (
          <div style={{ ...noticeBase, ...(msg.startsWith("✓") ? noticeSuccess : noticeError) }}>
            {msg}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
          {[
            { label: "Item name *", name: "name", placeholder: "Linen shirt", type: "input", required: true },
            { label: "Brand", name: "brand", placeholder: "Zara, H&M…", type: "input", required: false },
          ].map(f => (
            <label key={f.name} style={fieldStyle}>
              <span style={labelStyle}>{f.label}</span>
              <input
                name={f.name} value={form[f.name]} onChange={onChange}
                placeholder={f.placeholder} required={f.required}
                style={inputStyle}
              />
            </label>
          ))}

          <label style={fieldStyle}>
            <span style={labelStyle}>Color *</span>
            <input name="color" value={form.color} onChange={onChange} placeholder="e.g. Navy blue" required style={inputStyle} />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={fieldStyle}>
              <span style={labelStyle}>Category</span>
              <select name="category" value={form.category} onChange={onChange} style={inputStyle}>
                {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label style={fieldStyle}>
              <span style={labelStyle}>Season</span>
              <select name="season" value={form.season} onChange={onChange} style={inputStyle}>
                {SEASON_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </label>
          </div>

          <label style={fieldStyle}>
            <span style={labelStyle}>Photo</span>
            <input
              type="file" accept="image/*"
              onChange={e => setImg(e.target.files?.[0] || null)}
              style={{ ...inputStyle, padding: "8px 10px", cursor: "pointer" }}
            />
          </label>

          <button type="submit" disabled={submitting} style={primaryBtn}>
            {submitting ? "Adding…" : "+ Add to Wardrobe"}
          </button>
        </form>
      </div>
    </div>
  );
}

function StyleSuggestionsRail({ items }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(false);

  const generate = useCallback(async () => {
    if (items.length === 0) return;
    setLoading(true); setError(""); setGenerated(true);
    try {
      const res = await api.post("/user-items/style-suggestions", {
        items: items.map(i => ({ name: i.name, category: i.category, color: i.color, season: i.season })),
      });
      setSuggestions(res.data?.suggestions || []);
    } catch {
      // Fallback: generate client-side suggestions from existing items
      setSuggestions(buildFallbackSuggestions(items));
    } finally { setLoading(false); }
  }, [items]);

  // Auto-generate when items change and we have enough
  useEffect(() => {
    if (items.length >= 3 && !generated) {
      generate();
    }
  }, [items.length]); // eslint-disable-line

  if (items.length < 3) {
    return (
      <div style={railSection}>
        <h3 style={railHeading}>Style Suggestions</h3>
        <div style={railEmpty}>
          <span style={{ fontSize: 28, display: "block", marginBottom: 8 }}>✨</span>
          Add at least 3 pieces to unlock AI outfit ideas.
        </div>
      </div>
    );
  }

  return (
    <div style={railSection}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h3 style={{ ...railHeading, margin: 0 }}>Style Suggestions</h3>
        <button onClick={generate} disabled={loading} style={refreshBtn}>
          {loading ? "…" : "↻"}
        </button>
      </div>

      {loading && (
        <div style={railEmpty}>
          <div style={shimmerBox} />
          <div style={{ ...shimmerBox, width: "80%" }} />
          <div style={{ ...shimmerBox, width: "60%" }} />
        </div>
      )}

      {error && <p style={{ fontSize: 12, color: "#b91c1c", margin: 0 }}>{error}</p>}

      {!loading && suggestions.map((s, i) => (
        <SuggestionCard key={i} suggestion={s} allItems={items} />
      ))}

      {!loading && suggestions.length === 0 && generated && (
        <div style={railEmpty}>Could not generate suggestions — try again.</div>
      )}

      {/* Complete Your Look section */}
      <div style={{ marginTop: 20 }}>
        <h4 style={{ ...railHeading, fontSize: 13 }}>Complete Your Look</h4>
        <p style={{ fontSize: 12, color: "#8a6455", marginBottom: 10 }}>
          Missing pieces for a full outfit:
        </p>
        {getMissingCategories(items).map(cat => (
          <div key={cat} style={missingItem}>
            <span style={{ fontSize: 18 }}>{CATEGORY_ICON[cat] || "👔"}</span>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{cat}</p>
              <a
                href={`/user/products?category=${cat}`}
                style={{ fontSize: 11, color: "#c7622a", textDecoration: "none" }}
              >
                Shop {cat} →
              </a>
            </div>
          </div>
        ))}
        {getMissingCategories(items).length === 0 && (
          <p style={{ fontSize: 12, color: "#8a6455" }}>Your wardrobe looks complete! 🎉</p>
        )}
      </div>
    </div>
  );
}

function SuggestionCard({ suggestion, allItems }) {
  const [expanded, setExpanded] = useState(false);

  // Try to match suggestion items to actual wardrobe pieces
  const matchedItems = (suggestion.items || []).map(name =>
    allItems.find(i => i.name.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(i.name.toLowerCase()))
  ).filter(Boolean).slice(0, 3);

  return (
    <div style={suggCard} onClick={() => setExpanded(e => !e)}>
      {/* Thumbnail trio */}
      <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
        {matchedItems.length > 0
          ? matchedItems.map((item, i) => (
            <div key={i} style={suggThumb}>
              {item.imageUrl
                ? <img src={withHost(item.imageUrl)} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 16 }}>{CATEGORY_ICON[item.category] || "👔"}</span>
              }
            </div>
          ))
          : [0, 1, 2].map(i => <div key={i} style={{ ...suggThumb, background: "#f4ede4" }}><span style={{ fontSize: 14 }}>✦</span></div>)
        }
      </div>

      <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#1e1008" }}>
        {suggestion.name}
      </p>
      <p style={{ margin: 0, fontSize: 12, color: "#8a6455", lineHeight: 1.5 }}>
        {suggestion.description}
      </p>

      {expanded && suggestion.items?.length > 0 && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #ede0d4" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#7a5a46", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px" }}>
            Items
          </p>
          {suggestion.items.map((name, i) => (
            <p key={i} style={{ margin: "2px 0", fontSize: 12, color: "#5a3a26" }}>· {name}</p>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildFallbackSuggestions(items) {
  const byCategory = {};
  items.forEach(i => {
    if (!byCategory[i.category]) byCategory[i.category] = [];
    byCategory[i.category].push(i);
  });

  const suggestions = [];

  if (byCategory["Shirt"] && byCategory["Jeans"]) {
    const shirt = byCategory["Shirt"][0];
    const jeans = byCategory["Jeans"][0];
    suggestions.push({
      name: "Casual Day Look",
      description: `Pair your ${shirt.color.toLowerCase()} ${shirt.name} with ${jeans.name} for a relaxed, effortless outfit.`,
      items: [shirt.name, jeans.name, ...(byCategory["Shoes"] ? [byCategory["Shoes"][0].name] : [])],
    });
  }

  if (byCategory["Jacket"] && (byCategory["Shirt"] || byCategory["Dress"])) {
    const jacket = byCategory["Jacket"][0];
    const base = (byCategory["Dress"] || byCategory["Shirt"] || [])[0];
    if (base) {
      suggestions.push({
        name: "Layered Editorial",
        description: `The ${jacket.name} layered over ${base.name} creates a structured, fashion-forward silhouette.`,
        items: [jacket.name, base.name],
      });
    }
  }

  if (byCategory["Dress"]) {
    const dress = byCategory["Dress"][0];
    suggestions.push({
      name: "Effortless Evening",
      description: `Let the ${dress.color.toLowerCase()} ${dress.name} do the talking — keep accessories minimal.`,
      items: [dress.name, ...(byCategory["Accessories"] ? [byCategory["Accessories"][0].name] : [])],
    });
  }

  if (suggestions.length === 0 && items.length >= 3) {
    suggestions.push({
      name: "Your Signature Mix",
      description: "Combine your wardrobe staples into a look that feels uniquely you.",
      items: items.slice(0, 3).map(i => i.name),
    });
  }

  return suggestions;
}

function getMissingCategories(items) {
  const essential = ["Shirt", "Jeans", "Shoes", "Jacket"];
  const owned = new Set(items.map(i => i.category));
  return essential.filter(c => !owned.has(c));
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Wardrobe() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Filters
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSeason, setActiveSeason] = useState("All");
  const [activeColors, setActiveColors] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Tabs
  const [activeTab, setActiveTab] = useState("All Items");
  const tabs = useMemo(() => ["All Items", "My Pieces", "Collections"], []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/user-items/me");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch {
      setMessage("Could not load wardrobe items.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/user-items/me/${id}`);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch {
      setMessage("Could not remove item.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleAdded = (newItem) => {
    setItems(prev => [newItem, ...prev]);
  };

  const handleAddToOutfit = (item) => {
    // Navigate to outfit builder with this item pre-selected
    window.location.href = `/user/outfit-builder?addItem=${item.id}`;
  };

  const toggleColor = (color) => {
    setActiveColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setActiveCategory("All");
    setActiveSeason("All");
    setActiveColors([]);
    setSearch("");
  };

  const filtered = useMemo(() => {
    let list = [...items];

    if (activeTab === "My Pieces") list = list.filter(i => !i.brand);
    // "Collections" would be a separate concept — showing all for now

    if (activeCategory !== "All") list = list.filter(i => i.category === activeCategory);
    if (activeSeason !== "All") list = list.filter(i => i.season === activeSeason || i.season === "All Season");
    if (activeColors.length > 0) list = list.filter(i =>
      activeColors.some(c => i.color?.toLowerCase().includes(c.toLowerCase()))
    );
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        i.name?.toLowerCase().includes(q) ||
        i.brand?.toLowerCase().includes(q) ||
        i.color?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "newest") list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "category") list.sort((a, b) => a.category.localeCompare(b.category));

    return list;
  }, [items, activeTab, activeCategory, activeSeason, activeColors, search, sortBy]);

  const hasActiveFilters = activeCategory !== "All" || activeSeason !== "All" || activeColors.length > 0 || search.trim();

  return (
    <div style={page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .wrd-sidebar::-webkit-scrollbar { width: 4px; }
        .wrd-sidebar::-webkit-scrollbar-track { background: transparent; }
        .wrd-sidebar::-webkit-scrollbar-thumb { background: #d0b8a4; border-radius: 2px; }
        .wrd-grid-item { transition: transform .18s, box-shadow .2s; }
        .chip-btn { cursor: pointer; transition: all .15s; }
        .chip-btn:hover { background: #3d2514 !important; color: #fff !important; }
        @keyframes shimmer { 0%,100%{opacity:.4} 50%{opacity:.9} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: fadeIn .3s ease; }
      `}</style>

      {/* ── Top bar ── */}
      <header style={topBar}>
        <div>
          <p style={eyebrow}>Your collection</p>
          <h1 style={heroTitle}>My Wardrobe</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <p style={{ margin: 0, fontSize: 13, color: "#8a6455" }}>
            {items.length} {items.length === 1 ? "piece" : "pieces"} ·{" "}
            {[...new Set(items.map(i => i.category))].length} categories
          </p>
          <button style={primaryBtn} onClick={() => setDrawerOpen(true)}>+ Upload Piece</button>
          <a href="/user/products" style={{ ...primaryBtn, background: "#fff", color: "#3d2514", border: "1px solid #d9c8b8", textDecoration: "none" }}>
            Add from Shop
          </a>
        </div>
      </header>

      {message && <div style={{ ...noticeBase, ...noticeError, margin: "0 0 12px" }}>{message}</div>}

      {/* ── Tab bar ── */}
      <div style={tabBar}>
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{ ...tabBtn, borderBottom: activeTab === t ? "2px solid #3d2514" : "2px solid transparent", color: activeTab === t ? "#1e1008" : "#8a6455", fontWeight: activeTab === t ? 700 : 500 }}
          >
            {t}
            {t === "All Items" && <span style={tabCount}>{items.length}</span>}
            {t === "My Pieces" && <span style={tabCount}>{items.filter(i => !i.brand).length}</span>}
            {t === "Collections" && <span style={tabCount}>3</span>}
          </button>
        ))}

        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search wardrobe…"
            style={{ ...inputStyle, padding: "7px 12px", fontSize: 13, width: 180 }}
          />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...inputStyle, padding: "7px 10px", fontSize: 13 }}>
            <option value="newest">Recently Added</option>
            <option value="name">Name A–Z</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>

      {/* ── 3-panel layout ── */}
      <div style={threePanel}>

        {/* LEFT SIDEBAR */}
        <aside className="wrd-sidebar" style={sidebar}>

          <div style={sideSection}>
            <p style={sideLabel}>Category</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {["All", ...CATEGORY_OPTIONS].map(cat => (
                <button
                  key={cat}
                  className="chip-btn"
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    ...sideFilterRow,
                    background: activeCategory === cat ? "#f4ede4" : "transparent",
                    fontWeight: activeCategory === cat ? 700 : 400,
                    color: activeCategory === cat ? "#3d2514" : "#5a3a26",
                    borderLeft: activeCategory === cat ? "3px solid #3d2514" : "3px solid transparent",
                  }}
                >
                  <span>{CATEGORY_ICON[cat] || "•"}</span>
                  <span>{cat}</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "#a08070" }}>
                    {cat === "All" ? items.length : items.filter(i => i.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div style={sideSection}>
            <p style={sideLabel}>Season</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["All", ...SEASON_OPTIONS].map(s => (
                <FilterChip
                  key={s} label={s}
                  active={activeSeason === s}
                  onClick={() => setActiveSeason(s)}
                />
              ))}
            </div>
          </div>

          <div style={sideSection}>
            <p style={sideLabel}>Color</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {COLOR_OPTIONS.map(c => (
                <ColorSwatch
                  key={c} color={c}
                  active={activeColors.includes(c)}
                  onClick={() => toggleColor(c)}
                />
              ))}
            </div>
            {activeColors.length > 0 && (
              <p style={{ fontSize: 11, color: "#8a6455", margin: "6px 0 0" }}>
                {activeColors.join(", ")}
              </p>
            )}
          </div>

          {hasActiveFilters && (
            <button onClick={clearFilters} style={{ ...primaryBtn, background: "transparent", color: "#8a6455", border: "1px solid #ddd0c8", fontSize: 12 }}>
              Clear all filters
            </button>
          )}

          {/* Item count footer */}
          <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid #ede0d4", fontSize: 12, color: "#8a6455" }}>
            <p style={{ margin: "0 0 2px" }}>
              <strong style={{ color: "#3d2514" }}>{items.length}</strong> items
            </p>
            <p style={{ margin: "0 0 2px" }}>
              <strong style={{ color: "#3d2514" }}>
                {items.reduce((acc, i) => { acc.add(i.category); return acc; }, new Set()).size}
              </strong> categories
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: "#3d2514" }}>
                {[...new Set(items.map(i => i.season))].length}
              </strong> seasons covered
            </p>
          </div>
        </aside>

        {/* CENTER GRID */}
        <main style={centerMain}>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: 16 }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ borderRadius: 14, overflow: "hidden", background: "#f4ede4", height: 240, animation: "shimmer 1.4s ease-in-out infinite" }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#8a6455" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>👗</div>
              <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                {hasActiveFilters ? "No items match your filters" : "Your wardrobe is empty"}
              </p>
              <p style={{ fontSize: 14, marginBottom: 20 }}>
                {hasActiveFilters ? "Try clearing some filters" : "Start by uploading your first piece"}
              </p>
              {hasActiveFilters
                ? <button onClick={clearFilters} style={primaryBtn}>Clear filters</button>
                : <button onClick={() => setDrawerOpen(true)} style={primaryBtn}>Upload your first piece</button>
              }
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <p style={{ margin: 0, fontSize: 13, color: "#8a6455" }}>
                  {filtered.length} {filtered.length === 1 ? "item" : "items"}
                  {hasActiveFilters && " (filtered)"}
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: 16 }}>
                {filtered.map(item => (
                  <div key={item.id} className="wrd-grid-item fade-in">
                    <WardrobeItemCard
                      item={item}
                      onAddToOutfit={handleAddToOutfit}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </main>

        {/* RIGHT RAIL */}
        <aside style={rightRail}>
          <StyleSuggestionsRail items={items} />
        </aside>
      </div>

      {/* Add item drawer */}
      <AddItemDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAdded={handleAdded}
      />
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const page = { fontFamily: "'DM Sans', sans-serif", color: "#1e1008", display: "grid", gap: 0, paddingBottom: 40 };
const topBar = { display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "28px 0 20px", borderBottom: "1px solid #ede0d4", marginBottom: 0 };
const eyebrow = { margin: "0 0 4px", fontSize: 11, textTransform: "uppercase", letterSpacing: "2px", color: "#8a6455", fontWeight: 700 };
const heroTitle = { margin: 0, fontSize: 32, fontWeight: 400, fontFamily: "'DM Serif Display', serif" };

const tabBar = { display: "flex", alignItems: "center", borderBottom: "1px solid #ede0d4", marginBottom: 20, paddingBottom: 0, gap: 0 };
const tabBtn = { background: "none", border: "none", padding: "12px 18px 10px", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6 };
const tabCount = { background: "#f2e8e0", color: "#5a3a26", borderRadius: 999, padding: "1px 8px", fontSize: 11, fontWeight: 700 };

const threePanel = { display: "grid", gridTemplateColumns: "220px 1fr 240px", gap: 20, alignItems: "start" };
const sidebar = { background: "#fff", border: "1px solid #ede0d4", borderRadius: 16, padding: "18px 14px", position: "sticky", top: 20, maxHeight: "calc(100vh - 100px)", overflowY: "auto", display: "flex", flexDirection: "column", gap: 0 };
const sideSection = { marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #ede0d4" };
const sideLabel = { margin: "0 0 10px", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", color: "#7a5a46", fontWeight: 700 };
const sideFilterRow = { display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 8, border: "none", width: "100%", textAlign: "left", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all .13s" };

const centerMain = { minWidth: 0 };
const rightRail = { background: "#fff", border: "1px solid #ede0d4", borderRadius: 16, padding: "18px 16px", position: "sticky", top: 20, maxHeight: "calc(100vh - 100px)", overflowY: "auto" };

const railSection = { display: "flex", flexDirection: "column", gap: 0 };
const railHeading = { margin: "0 0 14px", fontSize: 16, fontWeight: 700 };
const railEmpty = { padding: "24px 12px", textAlign: "center", fontSize: 13, color: "#8a6455", background: "#fff8f2", borderRadius: 12, lineHeight: 1.6 };
const refreshBtn = { background: "#f4ede4", border: "none", borderRadius: 8, padding: "4px 10px", fontSize: 14, cursor: "pointer", color: "#3d2514", fontWeight: 700 };

const suggCard = { background: "#fff8f2", border: "1px solid #ede0d4", borderRadius: 12, padding: "12px 14px", marginBottom: 10, cursor: "pointer", transition: "border-color .15s" };
const suggThumb = { width: 50, height: 50, borderRadius: 8, overflow: "hidden", background: "#f4ede4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };

const missingItem = { display: "flex", gap: 10, alignItems: "center", padding: "8px 10px", background: "#fff8f2", borderRadius: 10, marginBottom: 6 };
const shimmerBox = { height: 14, borderRadius: 6, background: "#f0e4d8", width: "100%", marginBottom: 8, animation: "shimmer 1.4s ease-in-out infinite" };

const itemCard = { border: "1px solid #ede0d4", borderRadius: 14, overflow: "hidden", background: "#fffdf9", boxShadow: "0 2px 8px rgba(40,20,8,.04)", transition: "box-shadow .2s" };
const cardImg = { width: "100%", height: 200, objectFit: "cover", display: "block" };
const cardImgPlaceholder = { width: "100%", height: 200, display: "grid", placeItems: "center", background: "#f4ede4" };
const cardBody = { padding: "10px 12px 12px" };
const cardName = { margin: "0 0 6px", fontSize: 14, fontWeight: 700, lineHeight: 1.3 };
const cardMeta = { margin: 0, fontSize: 11, color: "#8a6455" };

const hoverOverlay = { position: "absolute", inset: 0, background: "rgba(28,16,8,.42)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, transition: "opacity .2s" };
const overlayBtnPrimary = { background: "#3d2514", color: "#fff", border: "none", borderRadius: 999, padding: "9px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", width: 160 };
const overlayBtnDanger = { background: "#fff", color: "#b91c1c", border: "none", borderRadius: 999, padding: "9px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", width: 160 };

const chip = { borderRadius: 999, padding: "5px 14px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all .15s" };
const pillStyle = { background: "#f2e8e0", color: "#5a3a26", borderRadius: 999, padding: "2px 10px", fontSize: 11, fontWeight: 600 };

const drawerOverlay = { position: "fixed", inset: 0, background: "rgba(28,16,8,.45)", zIndex: 1000, display: "flex", justifyContent: "flex-end" };
const drawerPanel = { background: "#fff", width: 420, maxWidth: "100%", height: "100%", overflowY: "auto", padding: "28px 24px", boxShadow: "-16px 0 48px rgba(28,16,8,.18)" };

const fieldStyle = { display: "flex", flexDirection: "column", gap: 6 };
const labelStyle = { fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", color: "#7a5a46", fontWeight: 700 };
const inputStyle = { border: "1px solid #d9c8b8", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif", color: "#1e1008", background: "#fffdf9" };

const primaryBtn = { border: "none", borderRadius: 10, background: "#3d2514", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", padding: "10px 18px", display: "inline-flex", alignItems: "center", gap: 6, transition: "background .15s" };
const iconBtn = { background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#8a6455", padding: 4 };

const noticeBase = { padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 4 };
const noticeSuccess = { background: "#e8f8ef", color: "#1a6b3a" };
const noticeError = { background: "#fef0ee", color: "#9b2b1a" };

