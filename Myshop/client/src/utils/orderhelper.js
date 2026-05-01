// src/utils/orderHelpers.js
import { ORDER_STATUS_LABELS } from "../constants/orderStatus";



export const statusText = (s) => {
  if (s === null || s === undefined) return "";
  if (typeof s === "number") return ORDER_STATUS_LABELS[s] || String(s);
  return String(s);
};



export const formatMoney = (value, currency = "EGP") => {
  const num = Number(value) || 0;
  return `${num.toFixed(2)} ${currency}`;
};



export const extractError = (err, fallback = "Something went wrong.") => {
  const raw = err?.response?.data;
  if (!raw) return err?.message || fallback;
  if (typeof raw === "string") return raw;
  if (raw.errors) return Object.values(raw.errors).flat().join(", ") || raw.title || fallback;
  return raw.title || raw.message || fallback;
};