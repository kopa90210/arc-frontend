import { Navigate } from "react-router-dom";

export default function VendorGuard({ children }) {
  const token = localStorage.getItem("vendorToken");
 
  if (!token) return <Navigate to="/vendors/login" />;
  
  return children;
}
