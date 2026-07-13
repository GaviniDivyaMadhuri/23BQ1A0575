import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.user, data.token);
      if (data.user.role === "admin") navigate("/admin/dashboard");
      else if (data.user.role === "doctor") navigate("/doctor/appointments");
      else navigate("/patient/doctors");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 20 }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={inputStyle} />
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={inputStyle} />
        <button type="submit" style={btnStyle}>Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}

const inputStyle = { display: "block", width: "100%", marginBottom: 12, padding: 8, fontSize: 14 };
const btnStyle = { width: "100%", padding: 10, background: "#1976d2", color: "#fff", border: "none", cursor: "pointer", fontSize: 16 };
