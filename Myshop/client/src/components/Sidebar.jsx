import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  Shirt,
  Sparkles,
  ShoppingBag,
  MessageCircle,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { withHost } from "../utils/outfitHelpers";

const NAV_ITEMS = [
  { icon: Home, label: "Home", to: "/outfits/public" },
  { icon: Search, label: "Search", to: "/products" },
  { icon: Shirt, label: "Wardrobe", to: "/wardrobe" },
  { icon: Sparkles, label: "Outfits", to: "/outfit-builder" },
  { icon: ShoppingBag, label: "Shop", to: "/products" },
  { icon: MessageCircle, label: "Messages", to: "#" },
  { icon: Bell, label: "Notifications", to: "#" },
  { icon: Settings, label: "Settings", to: "#" },
];

export default function Sidebar({ user, isProfileActive }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={`cp-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="cp-sidebar-header">
        {!collapsed && <div className="cp-logo">Maison Noir</div>}
        <button
          className="cp-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="cp-nav">
        {NAV_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Link key={idx} to={item.to} className={`cp-nav-item ${isActive ? "active" : ""}`} title={collapsed ? item.label : ""}>
              <span className="cp-nav-icon"><Icon size={20} strokeWidth={isActive ? 2.5 : 2} /></span>
              {!collapsed && <span className="cp-nav-label">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="cp-nav-profile">
          <Link to="/profile" className={`cp-nav-item ${isProfileActive ? "active" : ""}`} title={collapsed ? "Profile" : ""}>
            <span className="cp-nav-icon profile-icon">
              {user.profileImage
                ? <img src={withHost(user.profileImage)} alt={user.fullName || "User"} />
                : <User size={20} />
              }
            </span>
            {!collapsed && <span className="cp-nav-label">Profile</span>}
          </Link>
        </div>
      )}
    </aside>
  );
}
