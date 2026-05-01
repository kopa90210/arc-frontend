import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";



// Decode JWT payload without any library
function parseJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Single endpoint — works for both customers and vendors
      const res = await api.post("/auth/login", form);
      const token = res.data.token;

      // 1. Save token
      localStorage.setItem("token", token);

      // 2. Decode JWT to get role + userId (no library needed)
      const payload = parseJwt(token);

      const role =
        payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        payload?.role ||
        "";

      const userId =
        payload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
        payload?.sub ||
        "";

      // 3. Save userId — SignalR uses this to join the right vendor group
      if (userId) localStorage.setItem("userId", userId);

      // 4. Merge guest cart (customers only)
      if (role !== "VENDOR" && role !== "ADMIN") {
        try {
          await api.post("/cart/merge", {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch {
          // non-critical — cart merge failure should not block login
        }
      }

      // 5. Redirect by role
      if (role === "VENDOR") {
        navigate("/vendors/dashboard");
      } else if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/profile");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.sub}>Sign in to your account</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label}>Password</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            onChange={handleChange}
            required
            style={styles.input}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div style={styles.footer}>
          <span style={styles.footerText}>New customer? </span>
          <Link to="/register" style={styles.link}>Create account</Link>
          <span style={styles.divider}> · </span>
          <Link to="/vendors/register" style={styles.link}>Register as vendor</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #efe4d7 0%, #fff7ee 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "40px 36px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 16px 40px rgba(28,16,8,0.12)",
    border: "1px solid #f0e1d2",
  },
  title: { margin: "0 0 6px", fontSize: "26px", fontWeight: 800, color: "#1d130e" },
  sub: { margin: "0 0 28px", color: "#7a5a46", fontSize: "14px" },
  form: { display: "flex", flexDirection: "column", gap: "4px" },
  label: { fontSize: "13px", fontWeight: 600, color: "#5c4638", marginBottom: "4px", marginTop: "12px" },
  input: {
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    border: "1px solid #e0cfc2", fontSize: "14px", outline: "none",
    boxSizing: "border-box", color: "#1d130e",
  },
  error: { color: "#b91c1c", fontSize: "13px", marginTop: "8px" },
  btn: {
    marginTop: "20px", background: "#2b1a12", color: "#fff",
    border: "none", borderRadius: "10px", padding: "12px",
    fontSize: "15px", fontWeight: 700, cursor: "pointer", width: "100%",
  },
  footer: { marginTop: "24px", textAlign: "center", fontSize: "13px" },
  footerText: { color: "#7a5a46" },
  link: { color: "#2b1a12", fontWeight: 700, textDecoration: "none" },
  divider: { margin: "0 8px", color: "#c9b5a5" },
};

