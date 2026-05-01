import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import AppLayout from "./components/AppLayout";
import UserLayout from "./pages/UserLayout";
import EditProfile from "./pages/EditProfile";
import Products from "./pages/Products";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import VendorDashboard from "./pages/VendorDashboard";
import VendorProfile from "./pages/VendorProfile";
import VendorProducts from "./pages/VendorProducts";
import VendorOrders from "./pages/VendorOrders";
import VendorRegister from "./pages/VendorRegister";
// import VendorLogin from "./pages/VendorLogin";
import Wardrobe from "./pages/Wardrobe";
import OutfitBuilder from "./pages/OutfitBuilder";
import PublicOutfitsFeed from "./pages/PublicOutfitsFeed";
import CreatorProfile from "./pages/CreatorProfile";
import ProtectedRoute from "./components/ProtectedRoute";






import AdminProducts from "./pages/AdminProducts";
import { useEffect, useState } from "react";

import api from "./services/api";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data.items || []))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  document.addEventListener("click", () => {
    window.userInteracted = true;
  }, { once: true });

  return (
    <Router>
      <Routes>
        {/* الصفحة الرئيسية → المنتجات */}
        <Route
          path="/"
          element={
            <div style={{ padding: "20px" }}>
              <h1>🛍️ قائمة المنتجات</h1>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                {products.map((product) => (
                  <div
                    key={product.id}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      padding: "15px",
                      width: "200px",
                    }}
                  >
                    <h3>{product.name}</h3>
                    <p>السعر: {product.price} جنيه</p>
                    <p>التصنيف: {product.category}</p>
                    <p>العلامة التجارية: {product.brand}</p>
                  </div>
                ))}
              </div>
            </div>
          }
        />
        <Route path="/user" element={<ProtectedRoute allowedRoles={["User", "Admin"]}> <UserLayout /></ProtectedRoute>}>
          {/* Nested routes for user layout */}
          <Route path="profile" element={<Profile />} />
          <Route path="products" element={<Products />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wardrobe" element={<Wardrobe />} />
          <Route path="outfit-builder" element={<OutfitBuilder />} />
          <Route path="outfits/public" element={<PublicOutfitsFeed />} />
          <Route path="creators/:creatorId/outfits" element={<CreatorProfile />} />
        </Route>

        {/* الصفحات الأخرى */}
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route element={<AppLayout />}>
          <Route path="/Products" element={<Products />} />
          <Route path="/wardrobe" element={<Wardrobe />} />
          <Route path="/outfit-builder" element={<OutfitBuilder />} />
          <Route path="/outfits/public" element={<PublicOutfitsFeed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users/:creatorId/outfits" element={<CreatorProfile />} />
          <Route path="/creators/:creatorId/outfits" element={<CreatorProfile />} />
        </Route>
        
        {/* الصفحات الأخرى */}
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/products" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminProducts />
          </ProtectedRoute>
        } />

        <Route path="/vendors/profile" element={<ProtectedRoute allowedRoles={["VENDOR"]}> <VendorProfile /> </ProtectedRoute>} />
        <Route path="/vendors/products" element={<ProtectedRoute allowedRoles={["VENDOR"]}> <VendorProducts /> </ProtectedRoute>} />
        <Route path="/vendors/orders" element={<ProtectedRoute allowedRoles={["VENDOR"]}> <VendorOrders /> </ProtectedRoute>} />
        <Route path="/vendors/register" element={<VendorRegister />} />

        {/* <Route path="/vendors/login" element={<VendorLogin />} /> */}
        <Route path="/vendors/dashboard" element={<ProtectedRoute allowedRoles={["VENDOR"]}>  <VendorDashboard />  </ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
