import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ date: "", start_time: "", end_time: "" });
  const [msg, setMsg] = useState("");

  const loadAll = () => {
    api.get("/doctor/appointments").then(r => setAppointments(r.data));
    api.get("/doctor/slots").then(r => setSlots(r.data));
  };
  useEffect(() => { loadAll(); }, []);

  const addSlot = async (e) => {
    e.preventDefault();
    await api.post("/doctor/slots", newSlot);
    setMsg("Slot added"); setNewSlot({ date: "", start_time: "", end_time: "" }); loadAll();
  };

  const updateStatus = async (id, status) => {
    await api.put(`/doctor/appointments/${id}/status`, { status });
    loadAll();
  };

  const statusColor = { pending: "orange", accepted: "green", rejected: "red", cancelled: "gray" };

  return (
    <div style={{ padding: 20 }}>
      <h2>Doctor Dashboard</h2>
      {msg && <p style={{ color: "green" }}>{msg}</p>}

      <h3>Add Time Slot</h3>
      <form onSubmit={addSlot} style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input type="date" value={newSlot.date} onChange={e => setNewSlot({ ...newSlot, date: e.target.value })} required style={{ padding: 6 }} />
        <input type="time" value={newSlot.start_time} onChange={e => setNewSlot({ ...newSlot, start_time: e.target.value })} required style={{ padding: 6 }} />
        <input type="time" value={newSlot.end_time} onChange={e => setNewSlot({ ...newSlot, end_time: e.target.value })} required style={{ padding: 6 }} />
        <button type="submit" style={btnStyle}>Add Slot</button>
      </form>

      <h3>My Slots</h3>
      <table style={{ borderCollapse: "collapse", marginBottom: 20, width: "100%", maxWidth: 500 }}>
        <thead><tr>{["Date", "Start", "End", "Booked"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
        <tbody>
          {slots.map(s => (
            <tr key={s.id}>
              <td style={tdStyle}>{s.date}</td>
              <td style={tdStyle}>{s.start_time}</td>
              <td style={tdStyle}>{s.end_time}</td>
              <td style={tdStyle}>{s.is_booked ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Appointments</h3>
      {appointments.map(a => (
        <div key={a.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15, marginBottom: 12, maxWidth: 500 }}>
          <p><strong>{a.patient_name}</strong> — {a.phone}</p>
          <p>{a.date} | {a.start_time} - {a.end_time}</p>
          <p>Status: <span style={{ color: statusColor[a.status], fontWeight: "bold" }}>{a.status}</span></p>
          {a.status === "pending" && (
            <>
              <button onClick={() => updateStatus(a.id, "accepted")} style={{ ...btnStyle, marginRight: 8 }}>Accept</button>
              <button onClick={() => updateStatus(a.id, "rejected")} style={{ ...btnStyle, background: "#e53935" }}>Reject</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

const btnStyle = { background: "#1976d2", color: "#fff", border: "none", padding: "7px 14px", cursor: "pointer", borderRadius: 4 };
const thStyle = { border: "1px solid #ccc", padding: "6px 10px", background: "#f5f5f5" };
const tdStyle = { border: "1px solid #ccc", padding: "6px 10px" };
