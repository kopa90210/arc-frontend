import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";


function VendorRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    storeName: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/vendors/register", form);
      // After registration, go to the unified login
      // The login page will detect VENDOR role and redirect to /vendors/dashboard
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.badge}>For vendors</div>
        <h2 style={styles.title}>Create vendor account</h2>
        <p style={styles.sub}>Start selling on Myshop today</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Full name</label>
          <input
            name="fullName"
            type="text"
            placeholder="Ibrahim Ahmed"
            value={form.fullName}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label}>Store name</label>
          <input
            name="storeName"
            type="text"
            placeholder="My Fashion Store"
            value={form.storeName}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label}>Email</label>
          <input
            name="email"
            type="email"
            placeholder="store@example.com"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label}>Password</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label}>Phone</label>
          <input
            name="phone"
            type="tel"
            placeholder="+20 10 0000 0000"
            value={form.phone}
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
            {loading ? "Creating account..." : "Register as vendor"}
          </button>
        </form>

        <div style={styles.footer}>
          <span style={styles.footerText}>Already have an account? </span>
          <Link to="/login" style={styles.link}>Sign in</Link>
          <span style={styles.divider}> · </span>
          <Link to="/register" style={styles.link}>Customer registration</Link>
        </div>
      </div>
    </div>
  );
}

export default VendorRegister;

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #efe4d7 0%, #fff7ee 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif", padding: "20px",
  },
  card: {
    background: "#fff", borderRadius: "20px", padding: "40px 36px",
    width: "100%", maxWidth: "440px",
    boxShadow: "0 16px 40px rgba(28,16,8,0.12)", border: "1px solid #f0e1d2",
  },
  badge: {
    display: "inline-block", background: "#2b1a12", color: "#fff1e6",
    fontSize: "11px", padding: "5px 12px", borderRadius: "999px",
    marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1.2px",
  },
  title: { margin: "0 0 6px", fontSize: "26px", fontWeight: 800, color: "#1d130e" },
  sub: { margin: "0 0 24px", color: "#7a5a46", fontSize: "14px" },
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

