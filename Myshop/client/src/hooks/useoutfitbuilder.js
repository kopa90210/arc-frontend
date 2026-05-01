// src/hooks/useOutfitBuilder.js
// ─── All outfit builder state + API logic ─────────────────────────────────
import { useEffect, useRef, useState, useMemo } from "react";
import api from "../services/api";
import { withHost } from "../config/env";

const CANVAS_W = 820;
const CANVAS_H = 540;
const ITEM_W   = 160;
const ITEM_H   = 160;

export { CANVAS_W, CANVAS_H, ITEM_W, ITEM_H };

const normalizeLayers = (items) =>
  [...items]
    .sort((a, b) => a.layerOrder - b.layerOrder)
    .map((item, i) => ({ ...item, layerOrder: i + 1 }));

export function useOutfitBuilder() {
  const [wardrobeItems, setWardrobeItems]   = useState([]);
  const [vendorProducts, setVendorProducts] = useState([]);
  const [outfits, setOutfits]               = useState([]);
  const [activeSource, setActiveSource]     = useState("wardrobe");
  const [canvasItems, setCanvasItems]       = useState([]);
  const [selectedId, setSelectedId]         = useState(null);
  const [saving, setSaving]                 = useState(false);
  const [message, setMessage]               = useState("");
  const [form, setForm] = useState({ outfitId: null, name: "", description: "", tags: "", isPublic: false });

  const draggingRef = useRef(null);

  const loadData = async () => {
    try {
      const [w, p, o] = await Promise.all([
        api.get("/user-items/me"),
        api.get("/products?page=1&pageSize=100"),
        api.get("/outfits/me"),
      ]);
      setWardrobeItems(Array.isArray(w.data) ? w.data : []);
      setVendorProducts(p.data?.items || []);
      setOutfits(Array.isArray(o.data) ? o.data : []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load builder data.");
    }
  };

  useEffect(() => { loadData(); }, []);

  const onAddSourceItem = (source, itemType) => {
    const topLayer = canvasItems.reduce((max, i) => Math.max(max, i.layerOrder), 0);
    const newItem = {
      uid: `${itemType}_${source.id}_${Date.now()}_${Math.random()}`,
      itemType, itemId: source.id, name: source.name,
      imageUrl: source.imageUrl ? withHost(source.imageUrl) : "",
      x: 60 + (canvasItems.length * 20) % 260,
      y: 60 + (canvasItems.length * 20) % 180,
      layerOrder: topLayer + 1,
    };
    setCanvasItems((prev) => [...prev, newItem]);
    setSelectedId(newItem.uid);
  };

  const onMouseDownItem = (event, uid) => {
    event.preventDefault();
    setSelectedId(uid);
    const item = canvasItems.find((i) => i.uid === uid);
    if (!item) return;
    draggingRef.current = { uid, startX: event.clientX, startY: event.clientY, originalX: item.x, originalY: item.y };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (event) => {
    if (!draggingRef.current) return;
    const { uid, startX, startY, originalX, originalY } = draggingRef.current;
    const dx = event.clientX - startX, dy = event.clientY - startY;
    setCanvasItems((prev) =>
      prev.map((item) => {
        if (item.uid !== uid) return item;
        return {
          ...item,
          x: Math.max(0, Math.min(CANVAS_W - ITEM_W, originalX + dx)),
          y: Math.max(0, Math.min(CANVAS_H - ITEM_H, originalY + dy)),
        };
      })
    );
  };

  const onMouseUp = () => {
    draggingRef.current = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  const removeSelected = () => {
    if (!selectedId) return;
    setCanvasItems((prev) => normalizeLayers(prev.filter((i) => i.uid !== selectedId)));
    setSelectedId(null);
  };
  const bringToFront = () => {
    if (!selectedId) return;
    const max = canvasItems.reduce((m, i) => Math.max(m, i.layerOrder), 0);
    setCanvasItems((prev) => normalizeLayers(prev.map((i) => (i.uid === selectedId ? { ...i, layerOrder: max + 1 } : i))));
  };
  const sendToBack = () => {
    if (!selectedId) return;
    const min = canvasItems.reduce((m, i) => Math.min(m, i.layerOrder), 1);
    setCanvasItems((prev) => normalizeLayers(prev.map((i) => (i.uid === selectedId ? { ...i, layerOrder: min - 1 } : i))));
  };
  const clearCanvas = () => { setCanvasItems([]); setSelectedId(null); };

  const startNewOutfit = () => {
    clearCanvas();
    setForm({ outfitId: null, name: "", description: "", tags: "", isPublic: false });
    setMessage("");
  };

  const loadOutfit = (outfit) => {
    setForm({ outfitId: outfit.id, name: outfit.name || "", description: outfit.description || "", tags: Array.isArray(outfit.tags) ? outfit.tags.join(", ") : "", isPublic: !!outfit.isPublic });
    setCanvasItems(normalizeLayers(
      (outfit.items || []).map((item) => ({
        uid: `${item.itemType}_${item.itemId}_${item.id || Date.now()}_${Math.random()}`,
        itemType: item.itemType, itemId: item.itemId,
        name: item.displayName || item.itemType,
        imageUrl: item.imageUrl ? withHost(item.imageUrl) : "",
        x: item.positionX || 0, y: item.positionY || 0, layerOrder: item.layerOrder || 1,
      }))
    ));
    setSelectedId(null);
  };

  const saveOutfit = async () => {
    if (!form.name.trim()) { setMessage("Outfit name is required."); return; }
    if (canvasItems.length === 0) { setMessage("Add at least one item to the canvas."); return; }
    setSaving(true); setMessage("");
    const ordered = normalizeLayers(canvasItems);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      isPublic: form.isPublic,
      items: ordered.map((item) => ({
        itemType: item.itemType, itemId: item.itemId,
        positionX: Number(item.x.toFixed(2)), positionY: Number(item.y.toFixed(2)),
        layerOrder: item.layerOrder,
      })),
    };
    try {
      const res = form.outfitId
        ? await api.put(`/outfits/me/${form.outfitId}`, payload)
        : await api.post("/outfits/me", payload);
      setForm((prev) => ({ ...prev, outfitId: res.data.id }));
      setMessage("Outfit saved successfully.");
      await loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to save outfit.");
    } finally { setSaving(false); }
  };

  const deleteOutfit = async (id) => {
    try {
      await api.delete(`/outfits/me/${id}`);
      if (form.outfitId === id) startNewOutfit();
      await loadData();
    } catch { setMessage("Could not delete outfit."); }
  };

  const sourceList = activeSource === "wardrobe" ? wardrobeItems : vendorProducts;
  const selectedItem = canvasItems.find((i) => i.uid === selectedId);
  const normalizedCanvas = useMemo(() => normalizeLayers(canvasItems), [canvasItems]);

  return {
    wardrobeItems, vendorProducts, outfits,
    activeSource, setActiveSource,
    canvasItems: normalizedCanvas, selectedId, selectedItem,
    saving, message, form, setForm,
    sourceList,
    onAddSourceItem, onMouseDownItem,
    removeSelected, bringToFront, sendToBack, clearCanvas,
    startNewOutfit, loadOutfit, saveOutfit, deleteOutfit,
  };
}