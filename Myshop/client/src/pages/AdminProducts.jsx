import { useEffect, useState } from "react";
import api from "../services/api";
import { withHost } from "../config/env";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: null,
    category: "",
    brand: "",
   
  });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");


//   useEffect(() => {
//   const role = localStorage.getItem("role");
//   if (role !== "Admin") {
//     window.location.href = "/";
//   }
// }, []);

  // ✅ جلب كل المنتجات
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    api
      .get("/products")
      .then((res) => setProducts(res.data.items || []))
      .catch((err) => console.error("Error fetching products:", err));
  };

  // ✅ عند تغيير البيانات في النموذج
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }))
    ;
  };

  // ✅ عند اختيار الصورة
  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, imageUrl: e.target.files[0] }));
  };

  // ✅ إضافة أو تعديل منتج
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("brand", form.brand);

    if (form.imageUrl) formData.append("ImageUrl", form.imageUrl);

    // Debug: log file object and FormData entries to console for troubleshooting
    console.log("debug: form.imageUrl =>", form.imageUrl);
    for (const pair of formData.entries()) {
      console.log("debug: formData entry =>", pair[0], pair[1]);
    }

    try {
      if (form.id) {
        // تعديل
         const token = localStorage.getItem("token");
        await api.put(`/products/${form.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage("✅ Product updated successfully");
      } else {
        // إضافة
         const token = localStorage.getItem("token");
        await api.post("/products", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage("✅ Product added successfully");
      }

      setForm({ id: null, name: "", price: "", stock: "", description: "", imageUrl: null ,category: "",   brand: "",});
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      setMessage("❌ Failed to save product");
    }
  };

  // ✅ تحميل بيانات المنتج في النموذج للتعديل
  const handleEdit = (product) => {
    setForm({
  id: product.id,
    name: product.name || "",
    price: product.price || "",
    stock: product.stock || "",
    description: product.description || "",
    imageUrl: null,
    category: product.category ?? "",   // ensure non-undefined
  brand: product.brand ?? "",
  });
  };

  // ✅ حذف منتج
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("🗑️ Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      setMessage("❌ Failed to delete product");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h2>🛒 Manage Products (Admin)</h2>

      {message && <p>{message}</p>}

      {/* ✅ Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <h3>{form.id ? "✏️ Edit Product" : "➕ Add New Product"}</h3>
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          required
        />
        <input
          name="price"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          required
        />
        <input
          name="stock"
          placeholder="Stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input type="file" onChange={handleFileChange} style={{ marginBottom: "10px" }} />

{/* <input
  type="text"
  placeholder="Category"
  value={form.category}
  onChange={(e) => setForm({ ...form, category: e.target.value })}
/>

<input
  type="text"
  placeholder="Brand"
  value={form.brand}
  onChange={(e) => setForm({ ...form, brand: e.target.value })}
/> */}
<input
  type="text"
  placeholder="Category"
  value={form.category || ""}
  onChange={(e) => setForm({ ...form, category: e.target.value })}
/>
<input
  type="text"
  placeholder="Brand"
  value={form.brand || ""}
  onChange={(e) => setForm({ ...form, brand: e.target.value })}
/>
        

        <button
          type="submit"
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {form.id ? "💾 Save Changes" : "➕ Add Product"}
        </button>
      </form>

      {/* ✅ Table */}
      <h3>📋 Product List</h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
        }}
      >
        <thead>
          <tr style={{ background: "#f3f3f3" }}>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
             
         <th>Image</th>


            <th>Category</th>
            <th>Brand</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
                     
              <td>
                {p.imageUrl ? (
                  <img
                    src={withHost(p.imageUrl)}
                    alt={p.name}
                    style={{ width: "60px", borderRadius: "8px" }}
                  />
                ) : (
                  "No image"
                )}
              </td>
              <td>{p.category}</td>
              <td>{p.brand}</td>
              <td>
                <button onClick={() => handleEdit(p)}>✏️ Edit</button>{" "}
                <button
                  onClick={() => handleDelete(p.id)}
                  style={{ color: "red", marginLeft: "5px" }}
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProducts;
