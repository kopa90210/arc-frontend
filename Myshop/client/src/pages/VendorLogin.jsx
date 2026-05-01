// import { useState } from "react";
// import api from "../services/api";
// import { useNavigate } from "react-router-dom";

// function VendorLogin() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await api.post("/vendors/login", form);

//       localStorage.setItem("token", res.data.token);
      

//       navigate("/vendors/dashboard");
//     } catch {
//       setMessage("❌ Invalid login");
//     }
//   };

//   return (
//     <div>
//       <h2>Vendor Login</h2>
//       {message && <p>{message}</p>}
//       <form onSubmit={handleSubmit}>
//         <input
//           name="email"
//           placeholder="Email"
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />

//         <button>Login</button>
//       </form>
//     </div>
//   );
// }

// export default VendorLogin;
