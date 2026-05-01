import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { withHost } from "../config/env";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState("");
  useEffect(() => {
    api.get(`/products/${id}`).then(res => setProduct(res.data)).catch(err => console.error(err));
  }, [id]);


  const addToCart = async () => {
    setAdding(true);
    try {
      await api.post("/cart/items", { productId: product.id, quantity: 1 });
      setToast("Added to cart!");
      setTimeout(() => setToast(""), 2500);
    } catch {
      setToast("Please log in first.");
      setTimeout(() => setToast(""), 2500);
    } finally { setAdding(false); }
  };

  if (!product) return <div style={s.loading}>Loading product…</div>;

  const inStock = (product.stock ?? 0) > 0;


  return (
    <div style={s.page}>
      <style>{`
           @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;700&display=swap');
           .pd-btn-primary:hover:not(:disabled) { background: #1a0d07; }
           .pd-btn-ghost:hover { background: #f2e8e0; }
           @keyframes slideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
         `}</style>

      {/* Toast */}
      {toast && (
        <div style={s.toast}>{toast}</div>
      )}

      {/* Breadcrumb */}
      <div style={s.breadcrumb}>
        <Link to="/Products" style={s.breadLink}>Products</Link>
        <span style={{ color: "#b89a84" }}> / </span>
        <span style={{ color: "#3d2514" }}>{product.name}</span>
      </div>

      <div style={s.card}>
        {/* Image */}
        <div style={s.imageWrap}>
          <img
            src={withHost(product.imageUrl) || "/no-image.png"}
            alt={product.name}
            style={s.image}
          />
          {!inStock && <div style={s.soldOut}>Out of stock</div>}
        </div>

        {/* Info */}
        <div style={s.info}>
          <div style={s.categoryTag}>{product.category || "General"}</div>
          <h1 style={s.title}>{product.name}</h1>
          {product.brand && <p style={s.brand}>{product.brand}</p>}

          <div style={s.priceRow}>
            <span style={s.price}>{product.price} EGP</span>
            <span style={{ ...s.stockBadge, background: inStock ? "#d1fae5" : "#fee2e2", color: inStock ? "#065f46" : "#991b1b" }}>
              {inStock ? `${product.stock} in stock` : "Sold out"}
            </span>
          </div>

          {product.description && (
            <div style={s.descBox}>
              <p style={s.descLabel}>About this item</p>
              <p style={s.descText}>{product.description}</p>
            </div>
          )}

          <div style={s.metaGrid}>
            {[["Category", product.category || "—"], ["Brand", product.brand || "—"], ["Stock", product.stock ?? 0]].map(([k, v]) => (
              <div key={k} style={s.metaItem}>
                <div style={s.metaLabel}>{k}</div>
                <div style={s.metaValue}>{v}</div>
              </div>
            ))}
          </div>

          <div style={s.ctaRow}>
            <button className="pd-btn-primary" onClick={addToCart} disabled={adding || !inStock} style={s.btnPrimary}>
              {adding ? "Adding…" : "Add to cart"}
            </button>
            <Link to="/Products" className="pd-btn-ghost" style={s.btnGhost}>← Back</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { padding: "24px 20px 48px", fontFamily: "'DM Sans', sans-serif", color: "#1e1008", maxWidth: "1100px", margin: "0 auto" },
  loading: { padding: "40px", color: "#8a6455", fontFamily: "sans-serif" },
  toast: { position: "fixed", top: "24px", right: "24px", background: "#3d2514", color: "#fff", padding: "12px 20px", borderRadius: "12px", zIndex: 9999, fontFamily: "'DM Sans',sans-serif", fontWeight: 600, animation: "slideUp .25s ease" },
  breadcrumb: { marginBottom: "20px", fontSize: "13px", fontFamily: "'DM Sans',sans-serif" },
  breadLink: { color: "#8a6455", textDecoration: "none" },
  card: { display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)", gap: "28px", background: "#fff", border: "1px solid #ede0d4", borderRadius: "20px", overflow: "hidden" },
  imageWrap: { position: "relative", background: "#f8f1ea", minHeight: "360px", display: "flex", alignItems: "center", justifyContent: "center" },
  image: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  soldOut: { position: "absolute", top: "14px", left: "14px", background: "#991b1b", color: "#fff", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 700 },
  info: { padding: "28px 28px 28px 4px", display: "grid", gap: "14px", alignContent: "start" },
  categoryTag: { display: "inline-block", background: "#f2e8e0", color: "#7a3e1b", borderRadius: "999px", padding: "4px 12px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" },
  title: { margin: 0, fontSize: "32px", fontWeight: 400, fontFamily: "'DM Serif Display',serif", lineHeight: 1.2 },
  brand: { margin: 0, color: "#8a6455", fontSize: "14px" },
  priceRow: { display: "flex", alignItems: "center", gap: "14px" },
  price: { fontSize: "30px", fontWeight: 700, color: "#7a3e1b" },
  stockBadge: { padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 700 },
  descBox: { background: "#fffdf9", border: "1px solid #ede0d4", borderRadius: "12px", padding: "14px" },
  descLabel: { margin: "0 0 6px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#8a6455" },
  descText: { margin: 0, fontSize: "14px", color: "#6f4b35", lineHeight: 1.65 },
  metaGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px" },
  metaItem: { background: "#fff8ef", border: "1px solid #ede0d4", borderRadius: "10px", padding: "10px 12px" },
  metaLabel: { fontSize: "11px", color: "#8a6455", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" },
  metaValue: { fontWeight: 700, fontSize: "14px" },
  ctaRow: { display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" },
  btnPrimary: { flex: 1, padding: "13px 20px", borderRadius: "12px", border: "none", background: "#3d2514", color: "#fff", fontWeight: 700, fontSize: "15px", cursor: "pointer", fontFamily: "inherit", transition: "background .15s" },
  btnGhost: { padding: "13px 20px", borderRadius: "12px", border: "1px solid #d9c8b8", color: "#3d2514", fontWeight: 700, fontSize: "14px", textDecoration: "none", fontFamily: "inherit", transition: "background .15s" },
};


export default ProductDetails;
