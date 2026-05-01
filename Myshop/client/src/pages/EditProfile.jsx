import { useEffect, useState } from "react";
import api from "../services/api";
import { withHost } from "../config/env"; 

function EditProfile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    api
      .get("/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setUser(res.data);
        setForm({
          fullName: res.data.fullName,
          email: res.data.email,
          currentPassword: "",
          newPassword: "",
        });
      })
      .catch((err) => console.error("Error loading profile:", err));
  }, [token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put("/users/me", form, { headers: { Authorization: `Bearer ${token}` } });
      setMessage("Profile updated successfully.");
    } catch {
      setMessage("Update failed.");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await api.post("/users/me/upload-avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Image uploaded successfully.");
      setUser({ ...user, profileImage: res.data.imageUrl });
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage("Upload failed.");
    }
  };

  if (!user) return <div style={styles.loading}>Loading...</div>;

  const profileImageUrl = user.profileImage
    ? withHost(user.profileImage)
    : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;800&family=Playfair+Display:wght@600&display=swap');
      `}</style>

      <section style={styles.card}>
        <h1 style={styles.title}>Edit profile</h1>
        <p style={styles.subtitle}>Update your account details and profile photo.</p>

        {message && <div style={styles.notice}>{message}</div>}

        <div style={styles.avatarRow}>
          <img src={profileImageUrl} alt="Profile" style={styles.avatar} />
        </div>

        <form onSubmit={handleSave} style={styles.formGrid}>
          <div style={styles.field}>
            <label style={styles.label}>Full name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              style={styles.input}
              placeholder="Your full name"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="you@example.com"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Current password</label>
            <input
              name="currentPassword"
              type="password"
              value={form.currentPassword}
              onChange={handleChange}
              style={styles.input}
              placeholder="Current password"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>New password</label>
            <input
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={handleChange}
              style={styles.input}
              placeholder="New password"
            />
          </div>

          <div style={styles.actionsRow}>
            <button type="submit" style={styles.primaryBtn}>
              Save Changes
            </button>
          </div>
        </form>

        <form onSubmit={handleUpload} style={styles.uploadCard}>
          <label style={styles.label}>Upload new image</label>
          <div style={styles.uploadRow}>
            <input type="file" onChange={handleFileChange} style={styles.fileInput} />
            <button type="submit" style={styles.secondaryBtn}>
              Upload
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f2e8dc 0%, #fff9f1 35%, #ffffff 70%)",
    padding: "32px 20px",
    fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif",
    color: "#1d130e",
  },
  loading: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif",
    color: "#5c4638",
  },
  card: {
    maxWidth: "720px",
    margin: "0 auto",
    background: "#fff",
    border: "1px solid #f0e1d2",
    borderRadius: "20px",
    padding: "26px",
    boxShadow: "0 14px 30px rgba(28, 16, 8, 0.10)",
  },
  title: {
    margin: "0 0 6px",
    fontSize: "30px",
    fontWeight: 800,
    fontFamily: "'Playfair Display', serif",
  },
  subtitle: {
    margin: "0 0 16px",
    color: "#6f4b35",
  },
  notice: {
    background: "#fff4e6",
    border: "1px solid #f0d9c0",
    color: "#7a3e1b",
    padding: "10px 12px",
    borderRadius: "10px",
    marginBottom: "14px",
  },
  avatarRow: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "16px",
  },
  avatar: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #fff4e6",
    boxShadow: "0 10px 22px rgba(28, 16, 8, 0.12)",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    color: "#7a5a46",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  input: {
    border: "1px solid #e4d2be",
    borderRadius: "10px",
    padding: "10px 12px",
    background: "#fffdf9",
    color: "#2b1a12",
  },
  actionsRow: {
    gridColumn: "1 / -1",
    marginTop: "4px",
  },
  primaryBtn: {
    background: "#2b1a12",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  uploadCard: {
    marginTop: "18px",
    border: "1px solid #f0e1d2",
    borderRadius: "14px",
    padding: "14px",
    background: "#fff8ef",
    display: "grid",
    gap: "8px",
  },
  uploadRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
  },
  fileInput: {
    flex: 1,
    minWidth: "220px",
    border: "1px solid #e4d2be",
    borderRadius: "10px",
    padding: "8px",
    background: "#fff",
  },
  secondaryBtn: {
    background: "#fff",
    border: "1px solid #e4d2be",
    borderRadius: "10px",
    padding: "10px 14px",
    color: "#2b1a12",
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default EditProfile;
