// src/config/env.js
// ─── Single source of truth for all environment variables ───────────────────
// Usage: import { API_BASE, API_HOST } from "../config/env";
 
export const API_BASE = import.meta.env.VITE_API_URL || "https://localhost:7000/api";
export const API_HOST = API_BASE.replace("/api", "");
 
// Helper — prepend host to relative image URLs
export const withHost = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_HOST}${url}`;
};