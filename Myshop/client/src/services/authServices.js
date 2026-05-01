// src/services/authService.js
// Single source of truth for login, role reading, and routing

import api from "./api";

// ── JWT decoder (no library needed) ──────────────────────────────────────
function parseJwt(token) {
    try {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
}

// ── Read role from stored token ───────────────────────────────────────────
export function getRole() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = parseJwt(token);
    // ClaimTypes.Role serializes to this key in JWT
    return (
        payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        payload?.role ||
        null
    );
}

export function getUserId() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = parseJwt(token);
    return (
        payload?.[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] ||
        payload?.sub ||
        null
    );
}

export function isLoggedIn() {
    return !!localStorage.getItem("token");
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("vendorId");
    window.location.href = "/login";
}

// ── Customer / Admin login ────────────────────────────────────────────────
export async function loginCustomer(email, password) {
    const res = await api.post("/auth/login", { email, password });
    const { token, role, userId, fullName, email: userEmail } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", userId);

    return { token, role, userId, fullName, email: userEmail };
}

// ── Vendor login ──────────────────────────────────────────────────────────
export async function loginVendor(email, password) {
    const res = await api.post("/vendors/login", { email, password });
    const { token, role, vendorId, userId, storeName, email: vendorEmail } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", userId);
    localStorage.setItem("vendorId", vendorId?.toString());

    return { token, role, vendorId, userId, storeName, email: vendorEmail };
}

// ── Role-based redirect (call after any login) ────────────────────────────
// Pass a React Router navigate function
export function redirectByRole(role, navigate) {
    switch (role) {
        case "Admin":
            navigate("/admin/dashboard");
            break;
        case "VENDOR":
            navigate("/vendors/orders");
            break;
        default:
            navigate("/profile");
            break;
    }
}