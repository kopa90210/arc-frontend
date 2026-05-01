// src/components/ProtectedRoute.jsx
// Wrap any route that requires authentication or a specific role

import { Navigate } from "react-router-dom";
import { getRole, isLoggedIn } from "../services/authServices";

// Usage in App.jsx:
//
// <Route path="/admin/*" element={
//   <ProtectedRoute allowedRoles={["Admin"]}>
//     <AdminDashboard />
//   </ProtectedRoute>
// } />
//
// <Route path="/vendors/*" element={
//   <ProtectedRoute allowedRoles={["VENDOR"]}>
//     <VendorOrders />
//   </ProtectedRoute>
// } />
//
// <Route path="/orders" element={
//   <ProtectedRoute allowedRoles={["User", "Admin"]}>
//     <MyOrders />
//   </ProtectedRoute>
// } />

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    const role = getRole();

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        // Logged in but wrong role — redirect to their correct home
        switch (role) {
            case "Admin":
                return <Navigate to="/admin/dashboard" replace />;
            case "VENDOR":
                return <Navigate to="/vendors/orders" replace />;
            default:
                return <Navigate to="/profile" replace />;
        }
    }

    return children;
}
