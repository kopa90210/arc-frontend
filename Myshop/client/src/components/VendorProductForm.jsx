// src/components/VendorProductForm.jsx
import { useEffect, useState } from "react";
import vendorApi from "../services/vendorApi";

export default function VendorProductForm({ product = {}, onSaved = () => { }, onCancel = () => { } }) {
  const blank = { id: null, name: "", price: "", stock: "", description: "", category: "", brand: "" };

  const fromProduct = (p) => ({
    id: p.id ?? null,
    name: p.name ?? "",
    price: p.price ?? "",
    stock: p.stock ?? "",
    description: p.description ?? "",
    category: p.category ?? "",
    brand: p.brand ?? "",
  });

  const [form, setForm] = useState(() => fromProduct(product));
  const [image, setImage] = useState(null);  // File object
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { setForm(fromProduct(product)); setImage(null); setError(""); }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSaving(true);
    try {
      // Use FormData so image upload works too
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("price", parseFloat(form.price));
      fd.append("stock", parseInt(form.stock));
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append("brand", form.brand);
      if (image) fd.append("image", image);

      if (form.id) {
        await vendorApi.updateProduct(form.id, fd);
      } else {
        await vendorApi.createProduct(fd);
      }
      onSaved();
    } catch (err) {
      const raw = err.response?.data;
      setError(typeof raw === "string" ? raw : raw?.title || err.message || "Failed to save product.");
    } finally { setSaving(false); }
  };


  return (
    <form onSubmit={handleSubmit} style={s.form}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        .vpf-input:focus { border-color:#8a6455; outline:none; }
        .vpf-save:hover:not(:disabled) { background:#1a0d07; }
        .vpf-cancel:hover { background:#f2e8e0; }
        .vpf-save:disabled { opacity:.6; cursor:not-allowed; }
      `}</style>

      {error && <div style={s.error}>{error}</div>}

      <div style={s.grid}>
        <label style={s.field}>
          <span style={s.label}>Name *</span>
          <input className="vpf-input" name="name" value={form.name} onChange={handleChange} required style={s.input} />
        </label>

        <label style={s.field}>
          <span style={s.label}>Category</span>
          <input className="vpf-input" name="category" value={form.category} onChange={handleChange} style={s.input} />
        </label>

        <label style={s.field}>
          <span style={s.label}>Price (EGP) *</span>
          <input className="vpf-input" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required style={s.input} />
        </label>

        <label style={s.field}>
          <span style={s.label}>Stock *</span>
          <input className="vpf-input" name="stock" type="number" value={form.stock} onChange={handleChange} required style={s.input} />
        </label>

        <label style={s.field}>
          <span style={s.label}>Brand</span>
          <input className="vpf-input" name="brand" value={form.brand} onChange={handleChange} style={s.input} />
        </label>

        <label style={s.field}>
          <span style={s.label}>Image</span>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0] ?? null)}
            style={{ fontFamily: "inherit", fontSize: "13px" }} />
        </label>

        <label style={{ ...s.field, gridColumn: "1 / -1" }}>
          <span style={s.label}>Description</span>
          <textarea className="vpf-input" name="description" value={form.description} onChange={handleChange}
            rows={3} style={{ ...s.input, resize: "vertical" }} />
        </label>
      </div>

      <div style={s.actions}>
        <button type="submit" className="vpf-save" disabled={saving} style={s.saveBtn}>
          {saving ? "Saving…" : form.id ? "Update product" : "Create product"}
        </button>
        <button type="button" className="vpf-cancel" onClick={onCancel} style={s.cancelBtn}>Cancel</button>
      </div>
    </form>
  );
}

const s = {
  form: { display: "grid", gap: "16px", fontFamily: "'DM Sans',sans-serif", color: "#1e1008" },
  error: { background: "#fef0ee", color: "#9b2b1a", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
  field: { display: "grid", gap: "5px" },
  label: { fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "#7a5a46", fontWeight: 700 },
  input: { border: "1px solid #d9c8b8", borderRadius: "10px", padding: "10px 12px", fontSize: "14px", fontFamily: "inherit", transition: "border-color .14s", width: "100%", boxSizing: "border-box" },
  actions: { display: "flex", gap: "10px" },
  saveBtn: { flex: 1, border: "none", borderRadius: "10px", background: "#3d2514", color: "#fff", padding: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: "14px", transition: "background .14s" },
  cancelBtn: { flex: 1, border: "1px solid #d9c8b8", borderRadius: "10px", background: "#fff", color: "#3d2514", padding: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: "14px", transition: "background .14s" },
};
