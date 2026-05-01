import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
// import debounce from "lodash.debounce";


function useDebounce(fn, delay) {
  const ref = useRef(null);
  return (...args) => {
    clearTimeout(ref.current);
    ref.current = setTimeout(() => fn(...args), delay);
  };
}

export default function SearchBar({ initial = "", placeholder = "Search products…" }) {
  const [query, setQuery] = useState(initial);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef();
  const nav = useNavigate();

  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  const fetchSuggestions = async (q) => {
    if (!q || q.length < 1) { setSuggestions([]); return; }
    try {
      const res = await api.get("/products/autocomplete", { params: { q } });
      setSuggestions(res.data || []);
      setOpen(true);
    } catch { /* silent */ }
  };

  // debounce to reduce requests
  const debouncedFetch = useDebounce(fetchSuggestions, 220);

  const onChange = (e) => { setQuery(e.target.value); debouncedFetch(e.target.value); };

  const submit = (q) => { setSuggestions([]); setOpen(false); nav(`/products?search=${encodeURIComponent(q)}`); };

  return (
    <div ref={wrapRef} style={s.wrap}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        .sb-input:focus { border-color:#8a6455; outline:none; }
        .sb-btn:hover { background:#1a0d07; }
        .sb-item:hover { background:#f8f0e8; }
      `}</style>
      <div style={s.row}>
        <input
          className="sb-input"
          value={query}
          onChange={onChange}
          onKeyDown={(e) => { if (e.key === "Enter") submit(query); }}
          placeholder={placeholder}
          style={s.input}
        />
        <button className="sb-btn" onClick={() => submit(query)} style={s.btn}>Search</button>
      </div>

      {open && suggestions.length > 0 && (
        <div style={s.dropdown}>
          {suggestions.map((s) => (
            <div key={s.id} className="sb-item" style={sty.item} onClick={() => submit(s.name)}>
              {s.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  wrap: { position: "relative", width: "100%", fontFamily: "'DM Sans',sans-serif" },
  row: { display: "flex", gap: "8px" },
  input: { flex: 1, border: "1px solid #d9c8b8", borderRadius: "10px", padding: "10px 14px", fontSize: "14px", fontFamily: "inherit", transition: "border-color .14s" },
  btn: { border: "none", borderRadius: "10px", background: "#3d2514", color: "#fff", padding: "10px 18px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "background .14s", whiteSpace: "nowrap" },
  dropdown: { position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", border: "1px solid #ede0d4", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,.10)", zIndex: 50, overflow: "hidden" },
};
const sty = { item: { padding: "10px 14px", fontSize: "14px", cursor: "pointer", transition: "background .13s", color: "#1e1008" } };

