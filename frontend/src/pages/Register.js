import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "patient", specialization: "", experience: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", padding: 20 }}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={inputStyle} />
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={inputStyle} />
        <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={inputStyle}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>
        {form.role === "doctor" && (
          <>
            <input placeholder="Specialization" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} style={inputStyle} />
            <input placeholder="Years of Experience" type="number" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} style={inputStyle} />
          </>
        )}
        <button type="submit" style={btnStyle}>Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

const inputStyle = { display: "block", width: "100%", marginBottom: 12, padding: 8, fontSize: 14 };
const btnStyle = { width: "100%", padding: 10, background: "#1976d2", color: "#fff", border: "none", cursor: "pointer", fontSize: 16 };
