import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import api from "../services/api";

export default function AppLayout() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/users/me", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setUser(res.data))
        .catch(err => console.error("Failed to fetch user for sidebar", err));
    }
  }, []);

  const isProfileActive = location.pathname.startsWith("/profile");

  return (
    <div className="cp-root">
      <Sidebar user={user} isProfileActive={isProfileActive} />
      <div className="cp-main" style={{ width: "100%", maxWidth: "none" }}>
        <Outlet />
      </div>
    </div>
  );
}
