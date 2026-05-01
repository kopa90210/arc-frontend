// // src/components/ui/NotificationBell.jsx
// import { useEffect, useRef, useState } from "react";

// function playOrderSound() {
//     if (!window.userInteracted) return;
//     try {
//         const ctx = new (window.AudioContext || window.webkitAudioContext)();
//         const osc = ctx.createOscillator();
//         const gain = ctx.createGain();
//         osc.connect(gain);
//         gain.connect(ctx.destination);
//         osc.frequency.setValueAtTime(880, ctx.currentTime);
//         osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
//         gain.gain.setValueAtTime(0.3, ctx.currentTime);
//         gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
//         osc.start(ctx.currentTime);
//         osc.stop(ctx.currentTime + 0.4);
//     } catch (e) { /* browser blocked — silent fail */ }
// }

// export { playOrderSound };

// export default function NotificationBell({ notifications = [], onMarkAll }) {
//     const [open, setOpen] = useState(false);
//     const [ring, setRing] = useState(false);
//     const ref = useRef();
//     const unread = notifications.filter((n) => !n.read).length;

//     // Close on outside click
//     useEffect(() => {
//         const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
//         window.addEventListener("click", handler);
//         return () => window.removeEventListener("click", handler);
//     }, []);

//     // Animate bell when new unread arrives
//     useEffect(() => {
//         if (unread > 0) { setRing(true); setTimeout(() => setRing(false), 600); }
//     }, [unread]);

//     return (
//         <div ref={ref} style={{ position: "relative" }}>
//             <button
//                 onClick={() => setOpen((o) => !o)}
//                 style={{
//                     ...s.bell,
//                     animation: ring ? "bellRing .5s ease-in-out" : "none",
//                 }}
//             >
//                 <style>{`
//           @keyframes bellRing {
//             0%,100%{transform:rotate(0)}
//             20%{transform:rotate(-12deg)}
//             40%{transform:rotate(12deg)}
//             60%{transform:rotate(-8deg)}
//             80%{transform:rotate(8deg)}
//           }
//         `}</style>
//                 {/* Bell SVG */}
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
//                     stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
//                     <path d="M13.73 21a2 2 0 0 1-3.46 0" />
//                 </svg>
//                 {unread > 0 && <span style={s.badge}>{unread}</span>}
//             </button>

//             {open && (
//                 <div style={s.dropdown}>
//                     <div style={s.dropHeader}>
//                         <span style={s.dropTitle}>
//                             Notifications {unread > 0 && <span style={s.dropSub}>· {unread} new</span>}
//                         </span>
//                         <button style={s.markAll} onClick={onMarkAll}>Mark all read</button>
//                     </div>
//                     <div style={s.list}>
//                         {notifications.length === 0
//                             ? <div style={s.empty}>No notifications yet</div>
//                             : notifications.map((n) => (
//                                 <div key={n.id} style={{ ...s.item, background: n.read ? "transparent" : "#fef9f0" }}>
//                                     <div style={{
//                                         ...s.dot, background: n.read ? "transparent" : "#e24b4a",
//                                         border: n.read ? "1px solid #d9c8b8" : "none"
//                                     }} />
//                                     <div style={{ ...s.icon, background: n.type === "order" ? "#e1f5ee" : n.type === "payment" ? "#eeedfe" : "#faeeda" }}>
//                                         {n.type === "order" ? "🛒" : n.type === "payment" ? "💳" : "📦"}
//                                     </div>
//                                     <div>
//                                         <div style={s.itemTitle}>{n.title}</div>
//                                         <div style={s.itemSub}>{n.sub}</div>
//                                         <div style={s.itemTime}>{n.time}</div>
//                                     </div>
//                                 </div>
//                             ))
//                         }
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// const s = {
//     bell: { position: "relative", width: 36, height: 36, border: "1px solid #e4d2be", borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#3d2514" },
//     badge: { position: "absolute", top: -5, right: -5, background: "#e24b4a", color: "#fff", fontSize: 10, fontWeight: 700, minWidth: 16, height: 16, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", border: "2px solid #fff" },
//     dropdown: { position: "absolute", top: 44, right: 0, width: 320, background: "#fff", border: "1px solid #ede0d4", borderRadius: 14, boxShadow: "0 8px 24px rgba(0,0,0,.10)", zIndex: 100, overflow: "hidden" },
//     dropHeader: { padding: "12px 14px", borderBottom: "1px solid #ede0d4", display: "flex", alignItems: "center", justifyContent: "space-between" },
//     dropTitle: { fontSize: 13, fontWeight: 700, color: "#1e1008" },
//     dropSub: { color: "#8a6455", fontWeight: 400 },
//     markAll: { fontSize: 12, color: "#3d2514", background: "none", border: "none", cursor: "pointer", fontWeight: 600 },
//     list: { maxHeight: 280, overflowY: "auto" },
//     empty: { padding: "20px 14px", fontSize: 13, color: "#8a6455", textAlign: "center" },
//     item: { padding: "11px 14px", borderBottom: "1px solid #f0e4d4", display: "flex", gap: 10, alignItems: "flex-start" },
//     dot: { width: 8, height: 8, borderRadius: "50%", marginTop: 4, flexShrink: 0 },
//     icon: { width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 },
//     itemTitle: { fontSize: 13, fontWeight: 700, color: "#1e1008" },
//     itemSub: { fontSize: 12, color: "#8a6455", marginTop: 2 },
//     itemTime: { fontSize: 11, color: "#b09080", marginTop: 4 },
// };

// src/components/ui/NotificationCenter.jsx
// ─── Vendor Notification Center — order feed + sound settings ─────────────
// Drop this anywhere in your vendor layout (e.g. next to the header logo).
//
// Usage:
//   import NotificationCenter from "../components/ui/NotificationCenter";
//   <NotificationCenter />
//
// It will auto-receive SignalR events if you pass the connection ref,
// OR you can call window.__addVendorNotif(notifObject) from useVendorOrders.js

import { useEffect, useRef, useState } from "react";

// ── Sound engine (Web Audio API — no file needed) ─────────────────────────
const createSoundEngine = () => {
    const play = (notes, volume = 0.35) => {
        if (!window.__vendorSoundEnabled) return;
        if (!window.__userInteracted) return; // browser autoplay guard
        const vol = (window.__vendorVolume ?? 70) / 100;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            notes.forEach(([freq, startAt, dur, type = "sine"]) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = type;
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(volume * vol, ctx.currentTime + startAt);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + dur);
                osc.start(ctx.currentTime + startAt);
                osc.stop(ctx.currentTime + startAt + dur + 0.05);
            });
        } catch (e) { /* silent — old browser */ }
    };

    return {
        order: () => play([[520, 0, 0.12], [660, 0.13, 0.18]]),
        payment: () => play([[440, 0, 0.08], [550, 0.1, 0.08], [660, 0.2, 0.22]]),
        stock: () => play([[320, 0, 0.15, "sawtooth"], [280, 0.18, 0.2, "sawtooth"]]),
        review: () => play([[500, 0, 0.1], [600, 0.1, 0.15]]),
    };
};

const sounds = createSoundEngine();

// ── User interaction tracker (fixes browser autoplay block) ───────────────
// This runs once at module load. The listener stays forever.
if (typeof window !== "undefined") {
    window.__userInteracted = false;
    window.__vendorSoundEnabled = true;
    window.__vendorVolume = 70;

    const unlock = () => {
        window.__userInteracted = true;
        // Don't remove — we just flip the flag, cheap
    };
    document.addEventListener("click", unlock);
    document.addEventListener("keydown", unlock);
    document.addEventListener("touchstart", unlock);
}

// ── Global notif injector (called from useVendorOrders.js) ────────────────
// In useVendorOrders.js, after setOrders(...), add:
//   window.__addVendorNotif?.({ type: "order", title: "New order #42", sub: "3 items · 420 EGP" });
let _addNotif = null;
if (typeof window !== "undefined") {
    window.__addVendorNotif = (n) => _addNotif?.(n);
}

// ── Types config ──────────────────────────────────────────────────────────
const TYPE_META = {
    order: { label: "Order", color: "#3B6D11", bg: "#EAF3DE", sound: "order" },
    payment: { label: "Payment", color: "#185FA5", bg: "#E6F1FB", sound: "payment" },
    stock: { label: "Stock", color: "#A32D2D", bg: "#FCEBEB", sound: "stock" },
    review: { label: "Review", color: "#3C3489", bg: "#EEEDFE", sound: "review" },
};

const SEED_NOTIFS = [
    { id: 1, type: "order", title: "New order #1042", sub: "Ahmed Hassan — 3 items · 420 EGP", time: "2m ago", read: false },
    { id: 2, type: "payment", title: "Payment confirmed #1039", sub: "Mariam Khalil — 180 EGP", time: "14m ago", read: false },
    { id: 3, type: "stock", title: "Low stock: Linen Shirt", sub: "Only 2 units remaining", time: "1h ago", read: false },
    { id: 4, type: "order", title: "New order #1041", sub: "Sara Adel — 1 item · 240 EGP", time: "2h ago", read: true },
    { id: 5, type: "review", title: "New review on Denim Jacket", sub: "4 stars — Great quality", time: "3h ago", read: true },
];

let _nextId = 6;

// ── Component ─────────────────────────────────────────────────────────────
export default function NotificationCenter() {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState("feed");     // "feed" | "settings"
    const [filter, setFilter] = useState("all");
    const [notifs, setNotifs] = useState(SEED_NOTIFS);
    const [soundOn, setSoundOn] = useState(true);
    const [volume, setVolume] = useState(70);
    const [interacted, setInteracted] = useState(false);
    const panelRef = useRef();

    // Wire global injector
    useEffect(() => {
        _addNotif = (n) => {
            const full = { ...n, id: _nextId++, time: "just now", read: false };
            setNotifs((prev) => [full, ...prev]);
            const soundFn = sounds[n.type] || sounds.order;
            soundFn();
            if (Notification.permission === "granted") {
                new Notification(n.title, { body: n.sub, icon: "/logo.png" });
            }
        };
        return () => { _addNotif = null; };
    }, []);

    // Track user interaction for sound
    useEffect(() => {
        const check = () => {
            if (window.__userInteracted) setInteracted(true);
        };
        document.addEventListener("click", check);
        document.addEventListener("keydown", check);
        return () => {
            document.removeEventListener("click", check);
            document.removeEventListener("keydown", check);
        };
    }, []);

    // Sync sound prefs to window globals
    useEffect(() => {
        window.__vendorSoundEnabled = soundOn;
        window.__vendorVolume = volume;
    }, [soundOn, volume]);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const unread = notifs.filter((n) => !n.read).length;
    const filtered = filter === "all" ? notifs : notifs.filter((n) => n.type === filter);

    const markRead = (id) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    const clearAll = () => setNotifs([]);

    // ── Demo simulators ───────────────────────────────────────────────────
    const simOrder = () => {
        const names = ["Omar Fathy", "Nour Ahmed", "Layla Hassan", "Youssef Ali"];
        const name = names[Math.floor(Math.random() * names.length)];
        const amt = (Math.floor(Math.random() * 8) + 1) * 60;
        const items = Math.floor(Math.random() * 4) + 1;
        window.__addVendorNotif?.({
            type: "order",
            title: `New order #${1050 + _nextId}`,
            sub: `${name} — ${items} item${items > 1 ? "s" : ""} · ${amt} EGP`,
        });
    };
    const simPayment = () => {
        window.__addVendorNotif?.({
            type: "payment",
            title: `Payment confirmed #${1040 + _nextId}`,
            sub: `${(Math.floor(Math.random() * 10) + 2) * 50} EGP received`,
        });
    };
    const simStock = () => {
        const products = ["Linen Shirt", "Denim Jacket", "White Sneakers"];
        const p = products[Math.floor(Math.random() * products.length)];
        const qty = Math.floor(Math.random() * 3) + 1;
        window.__addVendorNotif?.({
            type: "stock",
            title: `Low stock: ${p}`,
            sub: `Only ${qty} unit${qty > 1 ? "s" : ""} remaining`,
        });
    };

    return (
        <div style={s.root} ref={panelRef}>
            {/* Bell button */}
            <button onClick={() => setOpen((o) => !o)} style={s.bellBtn}>
                <BellIcon />
                {unread > 0 && (
                    <span style={s.badge}>{unread > 9 ? "9+" : unread}</span>
                )}
            </button>

            {/* Panel */}
            {open && (
                <div style={s.panel}>
                    {/* Header */}
                    <div style={s.panelHead}>
                        <span style={s.panelTitle}>Notifications</span>
                        <div style={s.headTabs}>
                            <button onClick={() => setTab("feed")} style={{ ...s.headTab, ...(tab === "feed" ? s.headTabActive : {}) }}>Feed</button>
                            <button onClick={() => setTab("settings")} style={{ ...s.headTab, ...(tab === "settings" ? s.headTabActive : {}) }}>Sound</button>
                        </div>
                    </div>

                    {/* Sound interacted warning */}
                    {!interacted && tab === "feed" && (
                        <div style={s.warnBanner}>
                            <span style={{ fontSize: 13 }}>⚠</span>
                            Sound blocked — click anywhere on the page to unlock audio
                        </div>
                    )}

                    {tab === "feed" && (
                        <>
                            {/* Stats row */}
                            <div style={s.statsRow}>
                                {[["Today", notifs.length], ["Unread", unread], ["Orders", notifs.filter(n => n.type === "order" && !n.read).length]].map(([l, v]) => (
                                    <div key={l} style={s.stat}>
                                        <div style={s.statN}>{v}</div>
                                        <div style={s.statL}>{l}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Filter tabs */}
                            <div style={s.filterRow}>
                                {["all", "order", "payment", "stock"].map((f) => (
                                    <button key={f} onClick={() => setFilter(f)}
                                        style={{ ...s.filterBtn, ...(filter === f ? s.filterBtnActive : {}) }}>
                                        {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1) + "s"}
                                    </button>
                                ))}
                            </div>

                            {/* List */}
                            <div style={s.list}>
                                {filtered.length === 0 ? (
                                    <div style={s.empty}>No notifications</div>
                                ) : filtered.map((n) => {
                                    const meta = TYPE_META[n.type] || TYPE_META.order;
                                    return (
                                        <div key={n.id} onClick={() => markRead(n.id)} style={{ ...s.item, background: n.read ? "transparent" : "#FAEEDA18" }}>
                                            <div style={{ ...s.dot, background: n.read ? "transparent" : "#BA7517", border: n.read ? "1.5px solid #ccc" : "none" }} />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <span style={{ ...s.typePill, background: meta.bg, color: meta.color }}>{meta.label}</span>
                                                <div style={s.itemTitle}>{n.title}</div>
                                                <div style={s.itemSub}>{n.sub}</div>
                                            </div>
                                            <div style={s.itemTime}>{n.time}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Footer */}
                            <div style={s.footer}>
                                <button onClick={markAllRead} style={s.footBtn}>Mark all read</button>
                                <button onClick={clearAll} style={s.footBtn}>Clear all</button>
                            </div>
                        </>
                    )}

                    {tab === "settings" && (
                        <div style={s.settingsBody}>
                            <div style={s.settingRow}>
                                <div>
                                    <div style={s.settingLabel}>Enable sounds</div>
                                    <div style={s.settingDesc}>Play audio for new notifications</div>
                                </div>
                                <Toggle checked={soundOn} onChange={setSoundOn} />
                            </div>
                            <div style={s.sep} />
                            <div style={s.settingRow}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                        <span style={s.settingLabel}>Volume</span>
                                        <span style={s.settingDesc}>{volume}%</span>
                                    </div>
                                    <input type="range" min="0" max="100" value={volume} step="1"
                                        onChange={(e) => setVolume(Number(e.target.value))}
                                        style={{ width: "100%", accentColor: "#3d2514" }} />
                                </div>
                            </div>
                            <div style={s.sep} />
                            <div style={s.settingLabel}>Browser notifications</div>
                            <button style={s.permBtn} onClick={() => Notification.requestPermission()}>
                                Request permission ({typeof Notification !== "undefined" ? Notification.permission : "unsupported"})
                            </button>
                            <div style={s.sep} />
                            <div style={s.settingLabel}>Test sounds</div>
                            <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                                {[["Order", simOrder], ["Payment", simPayment], ["Stock alert", simStock]].map(([label, fn]) => (
                                    <button key={label} onClick={fn} style={s.simBtn}>{label} demo</button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function Toggle({ checked, onChange }) {
    return (
        <div onClick={() => onChange(!checked)} style={{ position: "relative", width: 36, height: 20, cursor: "pointer" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: checked ? "#3B6D11" : "#ccc", transition: "background .2s" }} />
            <div style={{ position: "absolute", width: 16, height: 16, borderRadius: "50%", background: "#fff", top: 2, left: checked ? 18 : 2, transition: "left .2s" }} />
        </div>
    );
}

function BellIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2a6 6 0 0 1 6 6v4l1.5 2.5h-15L4 12V8a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="1.4" fill="none" />
            <path d="M8 16.5a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    );
}

const s = {
    root: { position: "relative", display: "inline-block" },
    bellBtn: { position: "relative", background: "none", border: "0.5px solid #d9c8b8", borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#3d2514" },
    badge: { position: "absolute", top: -5, right: -5, background: "#E24B4A", color: "#fff", borderRadius: 10, minWidth: 18, height: 18, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", fontFamily: "sans-serif" },
    panel: { position: "absolute", top: 48, right: 0, width: 360, background: "#fff", border: "0.5px solid #d9c8b8", borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,.12)", zIndex: 1000, overflow: "hidden", fontFamily: "'DM Sans',sans-serif" },
    panelHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderBottom: "0.5px solid #ede0d4" },
    panelTitle: { fontSize: 14, fontWeight: 700, color: "#1e1008" },
    headTabs: { display: "flex", gap: 4 },
    headTab: { fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "0.5px solid #d9c8b8", background: "#fff", color: "#7a5a46", cursor: "pointer", fontFamily: "inherit" },
    headTabActive: { background: "#3d2514", color: "#fff", border: "0.5px solid #3d2514" },
    warnBanner: { background: "#FAEEDA", color: "#633806", fontSize: 12, padding: "8px 14px", display: "flex", gap: 6, alignItems: "center", borderBottom: "0.5px solid #FAC775" },
    statsRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "10px 14px", borderBottom: "0.5px solid #ede0d4" },
    stat: { background: "#f8f4f0", borderRadius: 8, padding: "8px 10px" },
    statN: { fontSize: 18, fontWeight: 700, color: "#1e1008" },
    statL: { fontSize: 11, color: "#7a5a46", marginTop: 1 },
    filterRow: { display: "flex", gap: 6, padding: "8px 14px", borderBottom: "0.5px solid #ede0d4" },
    filterBtn: { fontSize: 11, padding: "4px 10px", borderRadius: 999, border: "0.5px solid #d9c8b8", background: "#fff", color: "#7a5a46", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 },
    filterBtnActive: { background: "#3d2514", color: "#fff", border: "0.5px solid #3d2514" },
    list: { maxHeight: 260, overflowY: "auto" },
    item: { display: "grid", gridTemplateColumns: "10px 1fr auto", gap: 10, padding: "11px 14px", borderBottom: "0.5px solid #f0e8e0", cursor: "pointer", alignItems: "start" },
    dot: { width: 8, height: 8, borderRadius: "50%", marginTop: 5 },
    typePill: { display: "inline-block", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".5px", padding: "2px 6px", borderRadius: 4, marginBottom: 3 },
    itemTitle: { fontSize: 13, fontWeight: 600, color: "#1e1008", lineHeight: 1.4 },
    itemSub: { fontSize: 11, color: "#7a5a46", marginTop: 2 },
    itemTime: { fontSize: 11, color: "#b0927a", whiteSpace: "nowrap" },
    empty: { padding: "28px 16px", textAlign: "center", color: "#7a5a46", fontSize: 13 },
    footer: { display: "flex", gap: 8, padding: "10px 14px", borderTop: "0.5px solid #ede0d4" },
    footBtn: { flex: 1, fontSize: 12, padding: "6px 10px", borderRadius: 8, border: "0.5px solid #d9c8b8", background: "#fff", color: "#5a3a26", cursor: "pointer", fontFamily: "inherit" },
    settingsBody: { padding: "14px 16px", display: "grid", gap: 14 },
    settingRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
    settingLabel: { fontSize: 13, fontWeight: 600, color: "#1e1008" },
    settingDesc: { fontSize: 11, color: "#7a5a46", marginTop: 2 },
    sep: { height: 1, background: "#ede0d4" },
    permBtn: { marginTop: 6, width: "100%", padding: "8px", borderRadius: 8, border: "0.5px solid #d9c8b8", background: "#f8f4f0", color: "#3d2514", fontSize: 12, cursor: "pointer", fontFamily: "inherit" },
    simBtn: { padding: "9px 12px", borderRadius: 8, border: "0.5px solid #d9c8b8", background: "#f8f4f0", color: "#1e1008", fontSize: 13, cursor: "pointer", fontFamily: "inherit", textAlign: "left" },
};
