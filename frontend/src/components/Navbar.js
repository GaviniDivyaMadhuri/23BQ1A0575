import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px 20px", background: "#1976d2", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold", fontSize: "18px" }}>
        HealthCare Portal
      </Link>
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {!user ? (
          <>
            <Link to="/login" style={{ color: "#fff" }}>Login</Link>
            <Link to="/register" style={{ color: "#fff" }}>Register</Link>
          </>
        ) : (
          <>
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout} style={{ background: "#fff", color: "#1976d2", border: "none", padding: "5px 12px", cursor: "pointer", borderRadius: "4px" }}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
