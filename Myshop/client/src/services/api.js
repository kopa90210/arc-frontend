import axios from "axios";


import { API_BASE } from "../config/env";
const api = axios.create({ baseURL: API_BASE });
// const api = axios.create({
//   baseURL: "https://localhost:7000/api", // ✅ غيّرها حسب الـ API عندك
//   headers: {
//     "Content-Type": "application/json",
//   },
// });  /// old test u should remain it case of rollback


// لو بتستخدم JWT Token مستقبلاً:
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api; // 👈 دي هي اللي كانت ناقصة
