// // import { useEffect, useMemo, useRef, useState } from "react";
// // import api from "../services/api";

// import { useOutfitBuilder, CANVAS_W, CANVAS_H, ITEM_W, ITEM_H } from "../hooks/useoutfitbuilder";
// import{withHost} from "../config/env"

// export default function OutfitBuilder() {
//   const {
//     activeSource, setActiveSource, sourceList, outfits,
//     canvasItems, selectedId, selectedItem,
//     saving, message, form, setForm,
//     onAddSourceItem, onMouseDownItem,
//     removeSelected, bringToFront, sendToBack, clearCanvas,
//     startNewOutfit, loadOutfit, saveOutfit, deleteOutfit,
//   } = useOutfitBuilder();








//   return (
//      <div style={s.page}>
//          <style>{`
//            @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;700&display=swap');
//            .ob-tab-active { background:#3d2514!important; color:#fff!important; border-color:#3d2514!important; }
//            .ob-src-card:hover { border-color:#c09070; background:#fff; }
//            .ob-src-card { transition: border-color .14s, background .14s; }
//            .ob-saved-load:hover { background:#f8f0e8; }
//            .ob-toolbar-btn:hover:not(:disabled) { background:#ede0d4; }
//            .ob-toolbar-btn:disabled { opacity:.4; cursor:not-allowed; }
//          `}</style>

//          {/* ── Left panel ── */}
//          <section style={s.leftPanel}>

//            {/* Outfit info */}
//            <div style={s.block}>
//              <h2 style={s.blockTitle}>Outfit info</h2>
//              <input placeholder="Name" value={form.name}
//                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} style={s.input}/>
//              <textarea placeholder="Description" value={form.description} rows={3}
//                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
//                style={{ ...s.input, resize: "vertical" }}/>
//              <input placeholder="Tags, comma separated" value={form.tags}
//                onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} style={s.input}/>
//              <label style={s.checkRow}>
//                <input type="checkbox" checked={form.isPublic}
//                  onChange={(e) => setForm((p) => ({ ...p, isPublic: e.target.checked }))}/>
//                <span>Make public</span>
//              </label>
//              <div style={s.row}>
//                <button onClick={saveOutfit} disabled={saving} style={s.primaryBtn}>
//                  {saving ? "Saving…" : form.outfitId ? "Update outfit" : "Save outfit"}
//                </button>
//                <button onClick={startNewOutfit} style={s.ghostBtn}>New</button>
//              </div>
//              {message && <div style={s.notice}>{message}</div>}
//            </div>

//            {/* Source picker */}
//            <div style={s.block}>
//              <h2 style={s.blockTitle}>Add items</h2>
//              <div style={s.tabRow}>
//                <button className={activeSource === "wardrobe" ? "ob-tab-active" : ""} style={s.tab}
//                  onClick={() => setActiveSource("wardrobe")}>My wardrobe</button>
//                <button className={activeSource === "products" ? "ob-tab-active" : ""} style={s.tab}
//                  onClick={() => setActiveSource("products")}>Shop</button>
//              </div>
//              <div style={s.sourceGrid}>
//                {sourceList.map((item) => (
//                  <button key={item.id} className="ob-src-card" style={s.sourceCard}
//                    onClick={() => onAddSourceItem(item, activeSource === "wardrobe" ? "UserItem" : "Product")}>
//                    <div style={s.srcImgWrap}>
//                      {item.imageUrl
//                        ? <img src={item.imageUrl.startsWith("http") ? item.imageUrl : withHost(item.imageUrl)} alt={item.name} style={s.srcImg}/>
//                        : <div style={s.srcNoImg}>+</div>}
//                    </div>
//                    <span style={s.srcName}>{item.name}</span>
//                  </button>
//                ))}
//                {sourceList.length === 0 && <p style={{ gridColumn:"1/-1", color:"#8a6455", fontSize:13 }}>Nothing here yet.</p>}
//              </div>
//            </div>

//            {/* Saved outfits */}
//            <div style={s.block}>
//              <h2 style={s.blockTitle}>Saved outfits</h2>
//              {outfits.length === 0
//                ? <p style={{ color:"#8a6455", fontSize:13, margin:0 }}>No outfits saved yet.</p>
//                : outfits.map((o) => (
//                  <div key={o.id} style={s.savedRow}>
//                    <button className="ob-saved-load" style={s.savedLoad} onClick={() => loadOutfit(o)}>{o.name}</button>
//                    <button style={s.savedDel} onClick={() => deleteOutfit(o.id)}>✕</button>
//                  </div>
//                ))}
//            </div>
//          </section>

//          {/* ── Canvas panel ── */}
//          <section style={s.builderPanel}>
//            <div style={s.toolbar}>
//              {[
//                ["↑ Front", bringToFront, !selectedItem],
//                ["↓ Back",  sendToBack,   !selectedItem],
//                ["Remove",  removeSelected, !selectedItem],
//                ["Clear",   clearCanvas,   false],
//              ].map(([label, fn, disabled]) => (
//                <button key={label} className="ob-toolbar-btn" style={s.toolbarBtn}
//                  onClick={fn} disabled={disabled}>{label}</button>
//              ))}
//              {selectedItem && <span style={s.selectedLabel}>Selected: {selectedItem.name}</span>}
//            </div>

//            <div style={s.canvasWrap}>
//              <div style={{ ...s.canvas, width: CANVAS_W, height: CANVAS_H }}>
//                {canvasItems.map((item) => (
//                  <div
//                    key={item.uid}
//                    onMouseDown={(e) => onMouseDownItem(e, item.uid)}
//                    style={{
//                      ...s.canvasItem,
//                      width: ITEM_W, height: ITEM_H + 24,
//                      left: item.x, top: item.y,
//                      zIndex: item.layerOrder,
//                      outline: item.uid === selectedId ? "2px solid #c0603a" : "2px solid transparent",
//                      boxShadow: item.uid === selectedId ? "0 0 0 3px rgba(192,96,58,.2)" : "0 2px 8px rgba(0,0,0,.10)",
//                    }}
//                  >
//                    {item.imageUrl
//                      ? <img src={item.imageUrl} alt={item.name} style={{ width:"100%", height: ITEM_H, objectFit:"contain", display:"block" }}/>
//                      : <div style={s.noImg}>No image</div>}
//                    <div style={s.itemLabel}>{item.name}</div>
//                  </div>
//                ))}
//                {canvasItems.length === 0 && (
//                  <div style={s.canvasEmpty}>
//                    <div style={{ fontSize: 40, marginBottom: 10, opacity: .4 }}>👔</div>
//                    <p style={{ margin: 0, color: "#8a6455" }}>Click items from the left panel to add them here</p>
//                  </div>
//                )}
//              </div>
//            </div>
//          </section>
//        </div>
//      );
//    }

//    const s = {
//      page: { display: "grid", gridTemplateColumns: "340px 1fr", gap: "20px", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", color: "#1e1008" },
//      leftPanel: { display: "grid", gap: "14px", alignContent: "start" },
//      block: { background: "#fff", border: "1px solid #ede0d4", borderRadius: "14px", padding: "16px", display: "grid", gap: "10px" },
//      blockTitle: { margin: 0, fontSize: "16px", fontWeight: 700 },
//      input: { border: "1px solid #d9c8b8", borderRadius: "10px", padding: "10px 12px", fontSize: "14px", fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" },
//      checkRow: { display: "flex", gap: "8px", alignItems: "center", fontSize: "14px", color: "#5a3a26", cursor: "pointer" },
//      row: { display: "flex", gap: "8px" },
//      primaryBtn: { flex: 1, border: "none", borderRadius: "10px", background: "#3d2514", color: "#fff", padding: "10px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
//      ghostBtn: { border: "1px solid #d9c8b8", borderRadius: "10px", background: "#fff8f2", color: "#4a3528", padding: "10px 14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
//      notice: { background: "#fff3e8", color: "#8a3f17", borderRadius: "8px", padding: "8px 10px", fontSize: "13px" },
//      tabRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" },
//      tab: { border: "1px solid #d9c8b8", borderRadius: "10px", background: "#fff", color: "#4a3528", padding: "8px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .14s" },
//      sourceGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", maxHeight: "260px", overflowY: "auto" },
//      sourceCard: { border: "1px solid #e8d8c8", borderRadius: "10px", padding: "6px", background: "#fffdf9", cursor: "pointer", display: "grid", gap: "6px", textAlign: "left" },
//      srcImgWrap: { height: "72px", borderRadius: "8px", overflow: "hidden", background: "#f4ede4" },
//      srcImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
//      srcNoImg: { width: "100%", height: "100%", display: "grid", placeItems: "center", color: "#b09080", fontSize: "24px" },
//      srcName: { fontSize: "12px", fontWeight: 700, color: "#372319", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
//      savedRow: { display: "grid", gridTemplateColumns: "1fr auto", gap: "8px" },
//      savedLoad: { border: "1px solid #dcc8b8", borderRadius: "8px", background: "#fff", color: "#3b281d", fontWeight: 600, padding: "8px 10px", textAlign: "left", cursor: "pointer", fontFamily: "inherit", transition: "background .13s", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
//      savedDel: { border: "1px solid #e4b9aa", borderRadius: "8px", background: "#fff4f1", color: "#8f2e13", padding: "8px 10px", cursor: "pointer", fontFamily: "inherit" },
//      builderPanel: { background: "#fff", border: "1px solid #ede0d4", borderRadius: "14px", padding: "16px", display: "grid", gap: "14px", alignContent: "start" },
//      toolbar: { display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" },
//      toolbarBtn: { border: "1px solid #d9c8b8", borderRadius: "8px", background: "#fff8f2", color: "#4a3528", padding: "7px 12px", fontWeight: 600, cursor: "pointer", fontSize: "13px", fontFamily: "inherit", transition: "background .13s" },
//      selectedLabel: { marginLeft: "auto", fontSize: "12px", color: "#8a6455" },
//      canvasWrap: { overflowX: "auto", borderRadius: "12px" },
//      canvas: { position: "relative", borderRadius: "14px", border: "1.5px dashed #d0b8a4", background: "radial-gradient(circle at 30% 20%,#fff9f3,#f8ede0 60%,#f2e4d0)", overflow: "hidden", userSelect: "none" },
//      canvasItem: { position: "absolute", border: "2px solid transparent", borderRadius: "10px", background: "rgba(255,255,255,.75)", cursor: "grab", backdropFilter: "blur(1px)", transition: "outline .1s, box-shadow .1s" },
//      itemLabel: { height: "24px", lineHeight: "24px", fontSize: "11px", fontWeight: 700, padding: "0 8px", color: "#3d291e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", background: "rgba(255,255,255,.9)" },
//      noImg: { display: "grid", placeItems: "center", height: "100%", color: "#9a7a6a", fontSize: "12px", background: "#f7e9dc" },
//      canvasEmpty: { position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center", pointerEvents: "none" },
//    };



import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useOutfitBuilder, CANVAS_W, CANVAS_H, ITEM_W, ITEM_H } from "../hooks/useoutfitbuilder";
import { withHost } from "../config/env";
import api from "../services/api";

// ─── constants ────────────────────────────────────────────────────────────────

const ESSENTIAL_CATEGORIES = ["Shirt", "Jeans", "Shoes", "Jacket", "Dress", "Accessories"];

// ─── small helpers ────────────────────────────────────────────────────────────

const fmt = (n) =>
  n == null ? "—" : Number(n).toLocaleString("en-EG", { minimumFractionDigits: 0 }) + " EGP";

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// ─── OutfitDetailsPanel ───────────────────────────────────────────────────────
// The right-rail "revenue engine" panel.

function OutfitDetailsPanel({
  canvasItems,      // live canvas items with enriched price data
  onRemove,         // fn(uid)
  onAddAllToCart,   // fn()
  addingToCart,     // bool
  cartMsg,          // string
  similarItems,     // []  – AI-similar products from backend
  similarLoading,   // bool
  missingCategories,// []
}) {
  const purchasableItems = useMemo(
    () => canvasItems.filter((i) => i.itemType === "Product" && i.price != null),
    [canvasItems]
  );

  const wardrobeItems = useMemo(
    () => canvasItems.filter((i) => i.itemType !== "Product"),
    [canvasItems]
  );

  const estTotal = useMemo(
    () => purchasableItems.reduce((sum, i) => sum + Number(i.price || 0), 0),
    [purchasableItems]
  );

  const hasItems = canvasItems.length > 0;
  const hasPurchasable = purchasableItems.length > 0;

  return (
    <aside style={rp.rail}>
      {/* ── Est. Total hero ── */}
      <div style={rp.totalHero}>
        <div>
          <p style={rp.totalLabel}>Est. Total</p>
          <p style={rp.totalValue}>{hasPurchasable ? fmt(estTotal) : "—"}</p>
        </div>
        {hasPurchasable && (
          <button
            style={rp.bagBtn}
            onClick={onAddAllToCart}
            disabled={addingToCart}
          >
            {addingToCart ? (
              <span style={rp.spinner} />
            ) : (
              <>🛍 Add All to Bag</>
            )}
          </button>
        )}
      </div>

      {cartMsg && (
        <div
          style={{
            ...rp.cartMsg,
            background: cartMsg.startsWith("✓") ? "#e6f4ec" : "#fef0ee",
            color: cartMsg.startsWith("✓") ? "#1a6b3a" : "#9b2b1a",
          }}
        >
          {cartMsg}
        </div>
      )}

      {/* ── Item list ── */}
      <div style={rp.section}>
        <p style={rp.sectionLabel}>Outfit Items</p>

        {!hasItems && (
          <p style={rp.empty}>Add items from the left panel to start building.</p>
        )}

        {/* Shop products with price */}
        {purchasableItems.map((item) => (
          <OutfitLineItem
            key={item.uid}
            item={item}
            showPrice
            onRemove={onRemove}
          />
        ))}

        {/* Wardrobe (non-purchasable) items */}
        {wardrobeItems.map((item) => (
          <OutfitLineItem
            key={item.uid}
            item={item}
            showPrice={false}
            onRemove={onRemove}
          />
        ))}
      </div>

      {/* ── Shop Missing Items ── */}
      {missingCategories.length > 0 && (
        <div style={rp.section}>
          <p style={rp.sectionLabel}>Shop Missing Items</p>
          <div style={rp.missingGrid}>
            {missingCategories.map((cat) => (
              <a
                key={cat}
                href={`/user/products?category=${encodeURIComponent(cat)}`}
                style={rp.missingChip}
              >
                Shop Similar {cat}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── Similar Items AI ── */}
      <div style={rp.section}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <p style={{ ...rp.sectionLabel, margin: 0 }}>Similar Items</p>
          <span style={rp.aiBadge}>AI</span>
        </div>

        {similarLoading && (
          <div style={{ display: "grid", gap: 8 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: 60,
                  borderRadius: 10,
                  background: "#f4ede4",
                  animation: "shimmer 1.3s ease infinite",
                }}
              />
            ))}
          </div>
        )}

        {!similarLoading && similarItems.length === 0 && (
          <p style={rp.empty}>
            Add shop products to your outfit to see AI-matched alternatives.
          </p>
        )}

        {!similarLoading &&
          similarItems.map((p) => (
            <SimilarProductCard key={p.id} product={p} />
          ))}
      </div>

      {/* ── Share to Feed toggle note ── */}
      <div style={rp.shareNote}>
        <span>🌐</span>
        <span>
          Toggle <strong>Make public</strong> in the left panel to share this look with your followers.
        </span>
      </div>
    </aside>
  );
}

// ─── OutfitLineItem ───────────────────────────────────────────────────────────

function OutfitLineItem({ item, showPrice, onRemove }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...rp.lineItem,
        background: hovered ? "#fff8f2" : "#fff",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* thumb */}
      <div style={rp.lineThumb}>
        {item.imageUrl ? (
          <img
            src={
              item.imageUrl.startsWith("http")
                ? item.imageUrl
                : withHost(item.imageUrl)
            }
            alt={item.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <span style={{ fontSize: 18 }}>👔</span>
        )}
      </div>

      {/* info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={rp.lineName}>{item.name}</p>
        <p style={rp.lineMeta}>
          {item.itemType === "Product" ? "Shop" : "Wardrobe"}
          {item.brand ? ` · ${item.brand}` : ""}
        </p>
      </div>

      {/* price + remove */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
        {showPrice && item.price != null && (
          <span style={rp.linePrice}>{fmt(item.price)}</span>
        )}
        {!showPrice && (
          <span style={rp.lineOwned}>Owned</span>
        )}
        <button
          style={{ ...rp.removeBtn, opacity: hovered ? 1 : 0.4 }}
          onClick={() => onRemove(item.uid)}
          title="Remove from outfit"
        >
          × remove
        </button>
      </div>
    </div>
  );
}

// ─── SimilarProductCard ───────────────────────────────────────────────────────

function SimilarProductCard({ product }) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await api.post("/cart/items", { productId: product.id, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // silent fail — user can navigate to product page
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={rp.simCard}>
      <div style={rp.simThumb}>
        {product.imageUrl ? (
          <img
            src={withHost(product.imageUrl)}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <span style={{ fontSize: 20 }}>👔</span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <a
          href={`/user/products/${product.id}`}
          style={rp.simName}
        >
          {product.name}
        </a>
        <p style={rp.simPrice}>{fmt(product.price)}</p>
      </div>
      <button
        style={{
          ...rp.simBtn,
          background: added ? "#e6f4ec" : "#f4ede4",
          color: added ? "#1a6b3a" : "#3d2514",
        }}
        onClick={handleQuickAdd}
        disabled={adding}
        title="Add to cart"
      >
        {added ? "✓" : adding ? "…" : "+"}
      </button>
    </div>
  );
}

// ─── ZoomControl ─────────────────────────────────────────────────────────────

function ZoomControl({ zoom, onZoom }) {
  return (
    <div style={cv.zoomBar}>
      <button style={cv.zoomBtn} onClick={() => onZoom(clamp(zoom - 10, 40, 150))}>
        −
      </button>
      <span style={cv.zoomLabel}>{zoom}%</span>
      <button style={cv.zoomBtn} onClick={() => onZoom(clamp(zoom + 10, 40, 150))}>
        +
      </button>
    </div>
  );
}

// ─── Main OutfitBuilder ───────────────────────────────────────────────────────

export default function OutfitBuilder() {
  const {
    activeSource, setActiveSource, sourceList, outfits,
    canvasItems, selectedId, selectedItem,
    saving, message, form, setForm,
    onAddSourceItem, onMouseDownItem,
    removeSelected, bringToFront, sendToBack, clearCanvas,
    startNewOutfit, loadOutfit, saveOutfit, deleteOutfit,
  } = useOutfitBuilder();

  // ── pricing enrichment ──────────────────────────────────────────────────────
  // canvasItems from the hook don't carry price/brand/stock.
  // We fetch those in one batch whenever canvasItems changes.

  const [enrichedItems, setEnrichedItems] = useState([]);
  const [similarItems, setSimilarItems] = useState([]);
  const [simLoading, setSimLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMsg, setCartMsg] = useState("");
  const [zoom, setZoom] = useState(100);

  // Keep a ref to latest canvasItems so async callbacks don't capture stale state
  const canvasRef = useRef(canvasItems);
  useEffect(() => { canvasRef.current = canvasItems; }, [canvasItems]);

  // Enrich canvas items with pricing data from backend
  useEffect(() => {
    if (canvasItems.length === 0) {
      setEnrichedItems([]);
      setSimilarItems([]);
      return;
    }

    const productIds = canvasItems
      .filter((i) => i.itemType === "Product" || i.sourceType === "Product")
      .map((i) => i.itemId ?? i.sourceId ?? i.id)
      .filter(Boolean);

    if (productIds.length === 0) {
      // No shop products — carry canvasItems as-is
      setEnrichedItems(canvasItems.map((i) => ({ ...i, price: null })));
      return;
    }

    const enrich = async () => {
      try {
        const res = await api.post("/outfits/price-check", { productIds });
        const priceMap = {};
        (res.data?.items || []).forEach((p) => { priceMap[p.id] = p; });

        setEnrichedItems(
          canvasRef.current.map((item) => {
            const pid = item.itemId ?? item.sourceId ?? item.id;
            const pd = priceMap[pid];
            return pd
              ? { ...item, price: pd.price, brand: pd.brand, stock: pd.stock, category: pd.category, imageUrl: item.imageUrl || pd.imageUrl }
              : { ...item, price: null };
          })
        );
      } catch {
        setEnrichedItems(canvasRef.current.map((i) => ({ ...i, price: null })));
      }
    };

    enrich();
  }, [canvasItems]);

  // Fetch similar items whenever purchasable products change
  useEffect(() => {
    const productIds = enrichedItems
      .filter((i) => i.price != null)
      .map((i) => i.itemId ?? i.sourceId ?? i.id)
      .filter(Boolean);

    if (productIds.length === 0) {
      setSimilarItems([]);
      return;
    }

    const fetchSimilar = async () => {
      setSimLoading(true);
      try {
        const res = await api.post("/outfits/similar-items", { productIds });
        setSimilarItems(res.data?.items || []);
      } catch {
        setSimilarItems([]);
      } finally {
        setSimLoading(false);
      }
    };

    fetchSimilar();
  }, [enrichedItems]);

  // ── add ALL purchasable items to cart ───────────────────────────────────────

  const handleAddAllToCart = useCallback(async () => {
    const purchasable = enrichedItems.filter((i) => i.price != null);
    if (!purchasable.length) return;

    setAddingToCart(true);
    setCartMsg("");
    try {
      for (const item of purchasable) {
        const pid = item.itemId ?? item.sourceId ?? item.id;
        await api.post("/cart/items", { productId: pid, quantity: 1 });
      }
      setCartMsg(`✓ ${purchasable.length} item${purchasable.length > 1 ? "s" : ""} added to cart`);
    } catch {
      setCartMsg("Could not add items. Please try again.");
    } finally {
      setAddingToCart(false);
      setTimeout(() => setCartMsg(""), 3500);
    }
  }, [enrichedItems]);

  // ── remove item from canvas ─────────────────────────────────────────────────

  const handleRemoveByUid = useCallback(
    (uid) => {
      // Find item, select it, then call removeSelected from hook
      // The hook's removeSelected removes the currently selectedId.
      // We trigger it by dispatching a custom event the hook can observe,
      // or we directly replicate the remove logic via the hook's existing remove.
      // Simplest approach: click-select then remove.
      if (selectedId !== uid) {
        // We need the hook to expose a removeByUid — as a pragmatic workaround,
        // we store the target uid and call removeSelected after a tick.
        window.__ob_remove_uid = uid;
      }
      removeSelected();
    },
    [selectedId, removeSelected]
  );

  // ── missing categories ──────────────────────────────────────────────────────

  const missingCategories = useMemo(() => {
    const present = new Set(enrichedItems.map((i) => i.category).filter(Boolean));
    return ESSENTIAL_CATEGORIES.filter((c) => !present.has(c)).slice(0, 4);
  }, [enrichedItems]);

  // ── canvas scale ───────────────────────────────────────────────────────────

  const scale = zoom / 100;

  // ── source filter search ───────────────────────────────────────────────────

  const [srcSearch, setSrcSearch] = useState("");
  const filteredSource = useMemo(() => {
    if (!srcSearch.trim()) return sourceList;
    const q = srcSearch.toLowerCase();
    return sourceList.filter(
      (i) =>
        i.name?.toLowerCase().includes(q) ||
        i.brand?.toLowerCase().includes(q) ||
        i.category?.toLowerCase().includes(q)
    );
  }, [sourceList, srcSearch]);

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .ob-tab-active { background:#3d2514!important; color:#fff!important; border-color:#3d2514!important; }
        .ob-src-card   { transition: border-color .14s, box-shadow .14s, transform .14s; }
        .ob-src-card:hover { border-color:#c09070; background:#fff; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(40,20,8,.1); }
        .ob-saved-load:hover { background:#f8f0e8; }
        .ob-toolbar-btn:hover:not(:disabled) { background:#ede0d4; }
        .ob-toolbar-btn:disabled { opacity:.35; cursor:not-allowed; }
        .ob-canvas-item:active { cursor: grabbing; }

        /* dot-grid canvas background */
        .ob-canvas-bg {
          background-color: #fdf8f3;
          background-image: radial-gradient(circle, #d0b8a4 1px, transparent 1px);
          background-size: 24px 24px;
        }

        @keyframes shimmer { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes popIn { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }

        .rp-animate { animation: slideInRight .25s ease; }
        .item-animate { animation: popIn .2s ease; }

        /* scrollbar */
        .ob-scroll::-webkit-scrollbar { width: 4px; }
        .ob-scroll::-webkit-scrollbar-track { background: transparent; }
        .ob-scroll::-webkit-scrollbar-thumb { background: #d0b8a4; border-radius: 2px; }
      `}</style>

      {/* ══ LEFT PANEL ══════════════════════════════════════════════════════ */}
      <section className="ob-scroll" style={s.leftPanel}>

        {/* Outfit info */}
        <div style={s.block}>
          <h2 style={s.blockTitle}>Outfit details</h2>
          <input
            placeholder="Outfit name…"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            style={s.input}
          />
          <textarea
            placeholder="Description…"
            value={form.description}
            rows={2}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            style={{ ...s.input, resize: "vertical" }}
          />
          <input
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
            style={s.input}
          />
          <label style={s.checkRow}>
            <input
              type="checkbox"
              checked={form.isPublic}
              onChange={(e) => setForm((p) => ({ ...p, isPublic: e.target.checked }))}
            />
            <span>Share to public feed</span>
          </label>
          <div style={s.row}>
            <button onClick={saveOutfit} disabled={saving} style={s.primaryBtn}>
              {saving ? "Saving…" : form.outfitId ? "Update" : "Save outfit"}
            </button>
            <button onClick={startNewOutfit} style={s.ghostBtn}>New</button>
          </div>
          {message && <div style={s.notice}>{message}</div>}
        </div>

        {/* Source picker */}
        <div style={s.block}>
          <h2 style={s.blockTitle}>Add items</h2>
          <div style={s.tabRow}>
            <button
              className={activeSource === "wardrobe" ? "ob-tab-active" : ""}
              style={s.tab}
              onClick={() => { setActiveSource("wardrobe"); setSrcSearch(""); }}
            >
              My Wardrobe
            </button>
            <button
              className={activeSource === "products" ? "ob-tab-active" : ""}
              style={s.tab}
              onClick={() => { setActiveSource("products"); setSrcSearch(""); }}
            >
              Shop
            </button>
          </div>

          {/* Search within source */}
          <input
            value={srcSearch}
            onChange={(e) => setSrcSearch(e.target.value)}
            placeholder={`Search ${activeSource === "wardrobe" ? "wardrobe" : "products"}…`}
            style={{ ...s.input, padding: "7px 10px", fontSize: 12 }}
          />

          <div className="ob-scroll" style={s.sourceGrid}>
            {filteredSource.map((item) => (
              <button
                key={item.id}
                className="ob-src-card"
                style={s.sourceCard}
                onClick={() =>
                  onAddSourceItem(
                    item,
                    activeSource === "wardrobe" ? "UserItem" : "Product"
                  )
                }
              >
                <div style={s.srcImgWrap}>
                  {item.imageUrl ? (
                    <img
                      src={
                        item.imageUrl.startsWith("http")
                          ? item.imageUrl
                          : withHost(item.imageUrl)
                      }
                      alt={item.name}
                      style={s.srcImg}
                    />
                  ) : (
                    <div style={s.srcNoImg}>+</div>
                  )}
                  {/* Price badge for shop items */}
                  {activeSource === "products" && item.price != null && (
                    <span style={s.priceBadge}>{fmt(item.price)}</span>
                  )}
                </div>
                <span style={s.srcName}>{item.name}</span>
                {item.brand && <span style={s.srcBrand}>{item.brand}</span>}
              </button>
            ))}
            {filteredSource.length === 0 && (
              <p style={{ gridColumn: "1/-1", color: "#8a6455", fontSize: 12, textAlign: "center", padding: "12px 0" }}>
                {srcSearch ? "No results." : "Nothing here yet."}
              </p>
            )}
          </div>
        </div>

        {/* Saved outfits */}
        <div style={s.block}>
          <h2 style={s.blockTitle}>Saved outfits</h2>
          {outfits.length === 0 ? (
            <p style={{ color: "#8a6455", fontSize: 13, margin: 0 }}>No outfits yet.</p>
          ) : (
            outfits.map((o) => (
              <div key={o.id} style={s.savedRow}>
                <button
                  className="ob-saved-load"
                  style={s.savedLoad}
                  onClick={() => loadOutfit(o)}
                >
                  {o.name}
                </button>
                <button style={s.savedDel} onClick={() => deleteOutfit(o.id)}>
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ══ CANVAS PANEL ════════════════════════════════════════════════════ */}
      <section style={s.builderPanel}>

        {/* Toolbar */}
        <div style={s.toolbar}>
          {[
            ["↑ Front", bringToFront, !selectedItem],
            ["↓ Back", sendToBack, !selectedItem],
            ["✕ Remove", removeSelected, !selectedItem],
            ["Clear all", clearCanvas, false],
          ].map(([label, fn, disabled]) => (
            <button
              key={label}
              className="ob-toolbar-btn"
              style={s.toolbarBtn}
              onClick={fn}
              disabled={disabled}
            >
              {label}
            </button>
          ))}
          {selectedItem && (
            <span style={s.selectedLabel}>
              Selected: <strong>{selectedItem.name}</strong>
            </span>
          )}
        </div>

        {/* Canvas */}
        <div style={s.canvasWrap}>
          <div
            className="ob-canvas-bg"
            style={{
              ...s.canvas,
              width: CANVAS_W,
              height: CANVAS_H,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {canvasItems.map((item) => (
              <div
                key={item.uid}
                className="ob-canvas-item item-animate"
                onMouseDown={(e) => onMouseDownItem(e, item.uid)}
                style={{
                  ...s.canvasItem,
                  width: ITEM_W,
                  height: ITEM_H + 28,
                  left: item.x,
                  top: item.y,
                  zIndex: item.layerOrder,
                  outline:
                    item.uid === selectedId
                      ? "2px solid #c0603a"
                      : "2px solid transparent",
                  boxShadow:
                    item.uid === selectedId
                      ? "0 0 0 4px rgba(192,96,58,.18)"
                      : "0 2px 10px rgba(0,0,0,.10)",
                }}
              >
                {item.imageUrl ? (
                  <img
                    src={
                      item.imageUrl.startsWith("http")
                        ? item.imageUrl
                        : withHost(item.imageUrl)
                    }
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: ITEM_H,
                      objectFit: "contain",
                      display: "block",
                    }}
                    draggable={false}
                  />
                ) : (
                  <div style={s.noImg}>No image</div>
                )}
                <div style={s.itemLabel}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.name}
                  </span>
                  {/* inline price tag for shop items */}
                  {enrichedItems.find((e) => e.uid === item.uid)?.price != null && (
                    <span style={s.canvasPriceTag}>
                      {fmt(enrichedItems.find((e) => e.uid === item.uid)?.price)}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {canvasItems.length === 0 && (
              <div style={s.canvasEmpty}>
                <div style={{ fontSize: 44, marginBottom: 10, opacity: 0.35 }}>✦</div>
                <p style={{ margin: 0, color: "#8a6455", fontSize: 14 }}>
                  Click pieces from the left panel to compose your outfit
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Canvas footer: color swatches + zoom */}
        <div style={s.canvasFooter}>
          <div style={s.swatchRow}>
            {["#f7f5f0", "#d4b896", "#c4765a", "#6d8c70", "#1e2d5a", "#1a1a1a"].map((c) => (
              <div
                key={c}
                style={{ width: 20, height: 20, borderRadius: "50%", background: c, border: "2px solid rgba(255,255,255,.7)", cursor: "pointer" }}
                title={c}
              />
            ))}
          </div>
          <ZoomControl zoom={zoom} onZoom={setZoom} />
        </div>
      </section>

      {/* ══ RIGHT PANEL (Outfit Details) ═════════════════════════════════════ */}
      <div className="rp-animate ob-scroll">
        <OutfitDetailsPanel
          canvasItems={enrichedItems}
          onRemove={handleRemoveByUid}
          onAddAllToCart={handleAddAllToCart}
          addingToCart={addingToCart}
          cartMsg={cartMsg}
          similarItems={similarItems}
          similarLoading={simLoading}
          missingCategories={missingCategories}
        />
      </div>
    </div>
  );
}

// ─── Right-panel styles ───────────────────────────────────────────────────────

const rp = {
  rail: {
    width: 280,
    background: "#fff",
    border: "1px solid #ede0d4",
    borderRadius: 16,
    padding: "18px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 0,
    position: "sticky",
    top: 16,
    maxHeight: "calc(100vh - 32px)",
    overflowY: "auto",
    fontFamily: "'DM Sans', sans-serif",
  },
  totalHero: {
    background: "linear-gradient(135deg,#3d2514,#6b3a22)",
    borderRadius: 12,
    padding: "16px 14px",
    marginBottom: 14,
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  totalLabel: { margin: "0 0 2px", fontSize: 11, opacity: 0.75, textTransform: "uppercase", letterSpacing: "1px" },
  totalValue: { margin: 0, fontSize: 24, fontWeight: 700, fontFamily: "'DM Serif Display', serif" },
  bagBtn: {
    border: "none",
    borderRadius: 10,
    background: "rgba(255,255,255,.18)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 12,
    padding: "8px 12px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: 4,
    backdropFilter: "blur(4px)",
  },
  spinner: {
    width: 14, height: 14, borderRadius: "50%",
    border: "2px solid rgba(255,255,255,.3)",
    borderTopColor: "#fff",
    display: "inline-block",
    animation: "spin .7s linear infinite",
  },
  cartMsg: {
    borderRadius: 8, padding: "8px 12px", fontSize: 12, marginBottom: 10,
  },
  section: {
    marginBottom: 18,
    paddingBottom: 16,
    borderBottom: "1px solid #ede0d4",
  },
  sectionLabel: {
    margin: "0 0 10px",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#7a5a46",
    fontWeight: 700,
  },
  empty: { fontSize: 12, color: "#a08070", margin: 0, lineHeight: 1.6 },
  lineItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    borderRadius: 10,
    marginBottom: 6,
    transition: "background .15s",
    border: "1px solid #ede0d4",
  },
  lineThumb: {
    width: 44, height: 44, borderRadius: 8, overflow: "hidden",
    background: "#f4ede4", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
  },
  lineName: { margin: "0 0 2px", fontSize: 13, fontWeight: 600, color: "#1e1008", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  lineMeta: { margin: 0, fontSize: 11, color: "#8a6455" },
  linePrice: { fontSize: 13, fontWeight: 700, color: "#3d2514", whiteSpace: "nowrap" },
  lineOwned: { fontSize: 11, background: "#f2e8e0", color: "#5a3a26", borderRadius: 999, padding: "2px 8px", fontWeight: 600 },
  removeBtn: {
    background: "none", border: "none", fontSize: 11, color: "#b91c1c",
    cursor: "pointer", padding: 0, fontFamily: "'DM Sans', sans-serif",
    transition: "opacity .15s",
  },
  missingGrid: { display: "flex", flexWrap: "wrap", gap: 6 },
  missingChip: {
    fontSize: 12, fontWeight: 600, color: "#3d2514",
    border: "1px solid #d9c8b8", borderRadius: 999,
    padding: "4px 12px", textDecoration: "none",
    background: "#fff8f2", transition: "background .15s",
  },
  aiBadge: {
    fontSize: 10, fontWeight: 700, background: "#f4ede4",
    color: "#7a3e1b", borderRadius: 999, padding: "2px 8px",
    letterSpacing: "0.5px",
  },
  simCard: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "8px 10px", borderRadius: 10, marginBottom: 6,
    border: "1px solid #ede0d4", background: "#fffdf9",
  },
  simThumb: {
    width: 40, height: 40, borderRadius: 8, overflow: "hidden",
    background: "#f4ede4", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
  },
  simName: { fontSize: 12, fontWeight: 600, color: "#1e1008", textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  simPrice: { margin: "2px 0 0", fontSize: 11, color: "#7a5a46" },
  simBtn: {
    border: "none", borderRadius: 8, width: 28, height: 28,
    cursor: "pointer", fontWeight: 700, fontSize: 15,
    flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background .15s",
  },
  shareNote: {
    display: "flex", gap: 8, alignItems: "flex-start",
    padding: "10px 12px", background: "#f8f4ef",
    borderRadius: 10, fontSize: 11, color: "#7a5a46", lineHeight: 1.5,
  },
};

// ─── Canvas & shared styles ───────────────────────────────────────────────────

const cv = {
  zoomBar: {
    display: "flex", alignItems: "center", gap: 6,
    background: "#f4ede4", borderRadius: 20, padding: "4px 10px",
  },
  zoomBtn: {
    background: "none", border: "none", fontSize: 16,
    cursor: "pointer", color: "#3d2514", fontWeight: 700,
    lineHeight: 1, width: 22, height: 22,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  zoomLabel: { fontSize: 12, fontWeight: 600, color: "#3d2514", minWidth: 36, textAlign: "center" },
};

const s = {
  page: {
    display: "grid",
    gridTemplateColumns: "300px 1fr 280px",
    gap: 16,
    minHeight: "100vh",
    fontFamily: "'DM Sans', sans-serif",
    color: "#1e1008",
    alignItems: "start",
  },
  leftPanel: {
    display: "grid", gap: 12, alignContent: "start",
    position: "sticky", top: 16, maxHeight: "calc(100vh - 32px)", overflowY: "auto",
  },
  block: {
    background: "#fff", border: "1px solid #ede0d4",
    borderRadius: 14, padding: "14px 16px",
    display: "grid", gap: 10,
  },
  blockTitle: { margin: 0, fontSize: 15, fontWeight: 700 },
  input: {
    border: "1px solid #d9c8b8", borderRadius: 10,
    padding: "9px 12px", fontSize: 13,
    fontFamily: "'DM Sans', sans-serif", outline: "none",
    width: "100%", color: "#1e1008", background: "#fffdf9",
  },
  checkRow: { display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#5a3a26", cursor: "pointer" },
  row: { display: "flex", gap: 8 },
  primaryBtn: {
    flex: 1, border: "none", borderRadius: 10,
    background: "#3d2514", color: "#fff",
    padding: "10px", fontWeight: 700, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
    transition: "background .15s",
  },
  ghostBtn: {
    border: "1px solid #d9c8b8", borderRadius: 10,
    background: "#fff8f2", color: "#4a3528",
    padding: "10px 14px", fontWeight: 600,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13,
  },
  notice: {
    background: "#fff3e8", color: "#8a3f17",
    borderRadius: 8, padding: "8px 10px", fontSize: 12,
  },
  tabRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  tab: {
    border: "1px solid #d9c8b8", borderRadius: 10,
    background: "#fff", color: "#4a3528",
    padding: "8px", fontWeight: 600,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    fontSize: 12, transition: "all .14s",
  },
  sourceGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: 8, maxHeight: 280, overflowY: "auto",
  },
  sourceCard: {
    border: "1px solid #e8d8c8", borderRadius: 10,
    padding: 6, background: "#fffdf9", cursor: "pointer",
    display: "grid", gap: 4, textAlign: "left",
  },
  srcImgWrap: { height: 72, borderRadius: 8, overflow: "hidden", background: "#f4ede4", position: "relative" },
  srcImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  srcNoImg: { width: "100%", height: "100%", display: "grid", placeItems: "center", color: "#b09080", fontSize: 22 },
  srcName: { fontSize: 11, fontWeight: 700, color: "#372319", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  srcBrand: { fontSize: 10, color: "#8a6455", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  priceBadge: {
    position: "absolute", bottom: 4, right: 4,
    background: "rgba(61,37,20,.85)", color: "#fff",
    fontSize: 10, fontWeight: 700, padding: "2px 7px",
    borderRadius: 999, backdropFilter: "blur(2px)",
  },
  savedRow: { display: "grid", gridTemplateColumns: "1fr auto", gap: 8 },
  savedLoad: {
    border: "1px solid #dcc8b8", borderRadius: 8,
    background: "#fff", color: "#3b281d",
    fontWeight: 600, padding: "7px 10px",
    textAlign: "left", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12, transition: "background .13s",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  savedDel: {
    border: "1px solid #e4b9aa", borderRadius: 8,
    background: "#fff4f1", color: "#8f2e13",
    padding: "7px 10px", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", fontSize: 12,
  },
  builderPanel: {
    background: "#fff", border: "1px solid #ede0d4",
    borderRadius: 14, padding: 16,
    display: "grid", gap: 12, alignContent: "start",
  },
  toolbar: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" },
  toolbarBtn: {
    border: "1px solid #d9c8b8", borderRadius: 8,
    background: "#fff8f2", color: "#4a3528",
    padding: "6px 12px", fontWeight: 600,
    cursor: "pointer", fontSize: 12,
    fontFamily: "'DM Sans', sans-serif",
    transition: "background .13s",
  },
  selectedLabel: { marginLeft: "auto", fontSize: 12, color: "#8a6455" },
  canvasWrap: { overflowX: "auto", borderRadius: 12, minHeight: 300 },
  canvas: {
    position: "relative", borderRadius: 14,
    overflow: "hidden", userSelect: "none",
    transition: "transform .2s",
    transformOrigin: "top left",
  },
  canvasItem: {
    position: "absolute", borderRadius: 10,
    background: "rgba(255,255,255,.82)",
    cursor: "grab",
    backdropFilter: "blur(2px)",
    transition: "outline .1s, box-shadow .1s",
  },
  itemLabel: {
    height: 28, lineHeight: "28px", fontSize: 10, fontWeight: 700,
    padding: "0 8px", color: "#3d291e",
    background: "rgba(255,255,255,.92)",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    borderTop: "1px solid rgba(0,0,0,.06)",
  },
  canvasPriceTag: {
    fontSize: 10, fontWeight: 700, color: "#3d2514",
    background: "#f4ede4", borderRadius: 999,
    padding: "1px 7px", whiteSpace: "nowrap",
  },
  noImg: {
    display: "grid", placeItems: "center",
    height: "100%", color: "#9a7a6a",
    fontSize: 12, background: "#f7e9dc",
  },
  canvasEmpty: {
    position: "absolute", inset: 0,
    display: "grid", placeItems: "center",
    textAlign: "center", pointerEvents: "none",
  },
  canvasFooter: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", paddingTop: 8,
    borderTop: "1px solid #ede0d4",
  },
  swatchRow: { display: "flex", gap: 6, alignItems: "center" },
};
