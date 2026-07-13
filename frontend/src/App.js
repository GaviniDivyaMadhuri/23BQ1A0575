import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchDoctors from "./pages/patient/SearchDoctors";
import MyAppointments from "./pages/patient/MyAppointments";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import AdminDashboard from "./pages/admin/AdminDashboard";

const Protected = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/patient/doctors" element={<Protected role="patient"><SearchDoctors /></Protected>} />
          <Route path="/patient/appointments" element={<Protected role="patient"><MyAppointments /></Protected>} />
          <Route path="/doctor/appointments" element={<Protected role="doctor"><DoctorAppointments /></Protected>} />
          <Route path="/admin/dashboard" element={<Protected role="admin"><AdminDashboard /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
