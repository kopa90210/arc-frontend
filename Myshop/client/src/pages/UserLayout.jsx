import { Link, Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div
        style={{
          width: "220px",
          background: "#1f2937",
          color: "white",
          padding: "20px",
        }}
      >
        <h2 style={{ marginBottom: "30px" }}>My Account</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Link to="/user/profile" style={linkStyle}>
            Profile
          </Link>
          <Link to="/user/products" style={linkStyle}>
            Products
          </Link>
          <Link to="/user/wardrobe" style={linkStyle}>
            Wardrobe
          </Link>
          <Link to="/user/outfit-builder" style={linkStyle}>
            Outfit Builder
          </Link>
          <Link to="/outfits/public" style={linkStyle}>
            Outfit Feed
          </Link>
          <Link to="/user/cart" style={linkStyle}>
            Cart
          </Link>
          <Link to="/logout" style={linkStyle}>
            Logout
          </Link>
        </nav>
      </div>

      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "18px",
  padding: "8px 0",
};
