import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [tab, setTab] = useState("dashboard");

  useEffect(() => {
    api.get("/admin/dashboard").then(r => setStats(r.data));
    api.get("/admin/doctors").then(r => setDoctors(r.data));
    api.get("/admin/patients").then(r => setPatients(r.data));
    api.get("/admin/appointments").then(r => setAppointments(r.data));
  }, []);

  const approveDoctor = async (id) => {
    await api.put(`/admin/doctors/${id}/approve`);
    api.get("/admin/doctors").then(r => setDoctors(r.data));
  };

  const deleteDoctor = async (id) => {
    await api.delete(`/admin/doctors/${id}`);
    api.get("/admin/doctors").then(r => setDoctors(r.data));
  };

  const deletePatient = async (id) => {
    await api.delete(`/admin/patients/${id}`);
    api.get("/admin/patients").then(r => setPatients(r.data));
  };

  const tabs = ["dashboard", "doctors", "patients", "appointments"];
  const statusColor = { pending: "orange", accepted: "green", rejected: "red", cancelled: "gray" };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Panel</h2>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "7px 16px", background: tab === t ? "#1976d2" : "#eee", color: tab === t ? "#fff" : "#333", border: "none", cursor: "pointer", borderRadius: 4, textTransform: "capitalize" }}>
            {t}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            { label: "Total Patients", value: stats.total_patients },
            { label: "Total Doctors", value: stats.total_doctors },
            { label: "Total Appointments", value: stats.total_appointments },
            { label: "Pending Appointments", value: stats.pending_appointments },
          ].map(s => (
            <div key={s.label} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 20, minWidth: 160, textAlign: "center" }}>
              <h1 style={{ margin: 0, color: "#1976d2" }}>{s.value}</h1>
              <p style={{ margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "doctors" && (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead><tr>{["Name", "Email", "Specialization", "Experience", "Approved", "Actions"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
          <tbody>
            {doctors.map(d => (
              <tr key={d.doctor_id}>
                <td style={tdStyle}>{d.name}</td>
                <td style={tdStyle}>{d.email}</td>
                <td style={tdStyle}>{d.specialization}</td>
                <td style={tdStyle}>{d.experience} yrs</td>
                <td style={tdStyle}>{d.is_approved ? "✅" : "❌"}</td>
                <td style={tdStyle}>
                  {!d.is_approved && <button onClick={() => approveDoctor(d.doctor_id)} style={{ ...btnStyle, marginRight: 6 }}>Approve</button>}
                  <button onClick={() => deleteDoctor(d.doctor_id)} style={{ ...btnStyle, background: "#e53935" }}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "patients" && (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead><tr>{["Name", "Email", "Phone", "Joined", "Actions"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.id}>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>{p.email}</td>
                <td style={tdStyle}>{p.phone}</td>
                <td style={tdStyle}>{new Date(p.created_at).toLocaleDateString()}</td>
                <td style={tdStyle}><button onClick={() => deletePatient(p.id)} style={{ ...btnStyle, background: "#e53935" }}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "appointments" && (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead><tr>{["Patient", "Doctor", "Specialization", "Date", "Time", "Status"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a.id}>
                <td style={tdStyle}>{a.patient_name}</td>
                <td style={tdStyle}>{a.doctor_name}</td>
                <td style={tdStyle}>{a.specialization}</td>
                <td style={tdStyle}>{a.date}</td>
                <td style={tdStyle}>{a.start_time} - {a.end_time}</td>
                <td style={{ ...tdStyle, color: statusColor[a.status], fontWeight: "bold" }}>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const btnStyle = { background: "#1976d2", color: "#fff", border: "none", padding: "5px 12px", cursor: "pointer", borderRadius: 4 };
const thStyle = { border: "1px solid #ccc", padding: "8px 12px", background: "#f5f5f5", textAlign: "left" };
const tdStyle = { border: "1px solid #ccc", padding: "8px 12px" };
