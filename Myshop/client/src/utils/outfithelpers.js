const API_HOST = "https://localhost:7000";

const seedNumber = (value) => {
  const str = String(value);
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
};

const withHost = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_HOST}${url}`;
};

const getInitials = (name) => {
  if (!name) return "OO";
  const parts = name.split(" ").filter(Boolean);
  const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
  return letters || "OO";
};

const formatFollowers = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "0";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
};

const getProductItemIds = (items) => {
  if (!Array.isArray(items)) return [];
  const ids = new Set();
  items.forEach((item) => {
    const type = (item.ItemType ?? item.itemType ?? "").toString().toLowerCase();
    if (!type || type === "useritem") return;
    const rawId =
      item.ItemId ?? item.itemId ?? item.ProductId ?? item.productId ?? item.id ?? item.ID ?? null;
    if (rawId == null) return;
    const numeric = Number(rawId);
    if (!Number.isFinite(numeric) || numeric <= 0) return;
    ids.add(Math.floor(numeric));
  });
  return Array.from(ids);
};

export { seedNumber, clamp, formatDate, withHost, getInitials, formatFollowers, getProductItemIds };
