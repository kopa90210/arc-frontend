// src/hooks/useVendorOrders.js
// ─── All SignalR + vendor orders logic in one place ────────────────────────
import { useEffect, useMemo, useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import vendorApi from "../services/vendorApi";
import { statusText, extractError } from "../utils/orderhelper";
//import { playOrderSound } from "../components/ui/NotificationCenter";

import { API_HOST } from "../config/env";



const getVendorIdFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return (
      payload.VendorId ||
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
    );
  } catch {
    return null;
  }
};

const playOrderSound = () => {
  if (!window.__userInteracted) return; // ← THE FIX: browser autoplay guard
  if (!window.__vendorSoundEnabled) return;
  const vol = (window.__vendorVolume ?? 70) / 100;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [[520, 0, 0.12], [660, 0.13, 0.18]];
    notes.forEach(([freq, start, dur]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3 * vol, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.05);
    });
  } catch (e) { /* silent */ }
};

export function useVendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── SignalR ────────────────────────────────────────────────────────────────
  useEffect(() => {
    let stopped = false;
    let connection = null;

    const vendorId = getVendorIdFromToken();
    if (!vendorId) return;

    connection = new HubConnectionBuilder()
      .withUrl(`${API_HOST}/hubs/orders`, {
        accessTokenFactory: () => localStorage.getItem("token"),
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.None)
      .build();

    connection.on("newOrder", (data) => {
      if (stopped) return;
      // ── Play sound (only if user has interacted with page) ─────────────
      playOrderSound();

      // ── Push to notification center panel (if mounted) ─────────────────
      window.__addVendorNotif?.({
        type: "order",
        title: `New order #${data.orderId}`,
        sub: `Total: ${data.total} EGP — ${data.itemCount} item(s)`,
      });
      setOrders((prev) => {
        const exists = prev.some((o) => (o.id ?? o.Id) === data.orderId);
        if (exists) return prev;
        return [
          {
            id: data.orderId,
            total: data.total,
            status: data.status ?? 1,
            items: [],
            createdAt: data.createdAt ?? new Date().toISOString(),
          },
          ...prev,
        ];
      });
      if (Notification.permission === "granted") {
        new Notification(`New Order #${data.orderId}`, {
          body: `Total: ${data.total} EGP — ${data.itemCount} item(s)`,
          icon: "/logo.png",
        });
      }
    });

    connection.onreconnected(() => {
      connection.invoke("JoinVendorGroup", vendorId).catch(console.error);
    });

    connection
      .start()
      .then(() => {
        if (stopped) return connection.stop();
        return connection.invoke("JoinVendorGroup", vendorId);
      })
      .catch((err) => {
        if (!stopped) console.error("SignalR failed:", err);
      });

    return () => {
      stopped = true;
      connection?.stop();
    };
  }, []);

  // ── Notification permission ────────────────────────────────────────────────
  useEffect(() => {
    if (Notification.permission === "default") Notification.requestPermission();
  }, []);

  // ── Initial fetch ──────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await vendorApi.getOrders();
        setOrders(res.data || []);
      } catch (err) {
        setError(extractError(err, "Failed to load orders"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Action handler ─────────────────────────────────────────────────────────
  const handleAction = async (orderId, action, payload = {}) => {
    if (!orderId) { setError("Order ID is missing."); return; }
    try {
      let res;
      if (action === "processing") res = await vendorApi.markProcessing(orderId);
      if (action === "ship") res = await vendorApi.shipOrder(orderId, payload?.trackingNumber, payload?.carrier);
      if (action === "deliver") res = await vendorApi.deliverOrder(orderId);

      const newStatus = res?.data?.status ?? res?.data?.Status;
      setOrders((prev) =>
        prev.map((o) =>
          (o.id ?? o.Id) === orderId ? { ...o, status: newStatus } : o
        )
      );
      setError("");
    } catch (err) {
      setError(extractError(err));
    }
  };

  // ── Derived metrics ────────────────────────────────────────────────────────
  const metrics = useMemo(() => {
    return orders.reduce(
      (acc, o) => {
        acc.totalOrders += 1;
        const s = statusText(o.status);
        if (s === "PendingPayment" || s === "Paid") acc.newOrders += 1;
        if (s === "Paid") acc.paid += 1;
        if (s === "Processing") acc.processing += 1;
        if (s === "Shipped") acc.shipped += 1;
        if (s === "Delivered") acc.delivered += 1;
        acc.revenue += Number(o.total ?? o.Total ?? 0) || 0;
        return acc;
      },
      { totalOrders: 0, newOrders: 0, paid: 0, processing: 0, shipped: 0, delivered: 0, revenue: 0 }
    );
  }, [orders]);

  return { orders, loading, error, metrics, handleAction };
}