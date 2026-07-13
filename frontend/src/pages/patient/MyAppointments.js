import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newSlotId, setNewSlotId] = useState("");
  const [slots, setSlots] = useState([]);
  const [msg, setMsg] = useState("");

  const load = () => api.get("/patient/appointments").then(r => setAppointments(r.data));
  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    await api.put(`/patient/appointments/${id}/cancel`);
    setMsg("Cancelled"); load();
  };

  const startReschedule = async (appt) => {
    setRescheduleId(appt.id);
    const { data } = await api.get(`/patient/doctors/${appt.doctor_id}/slots`);
    setSlots(data);
  };

  const reschedule = async () => {
    await api.put(`/patient/appointments/${rescheduleId}/reschedule`, { new_slot_id: newSlotId });
    setMsg("Rescheduled"); setRescheduleId(null); load();
  };

  const statusColor = { pending: "orange", accepted: "green", rejected: "red", cancelled: "gray" };

  return (
    <div style={{ padding: 20 }}>
      <h2>My Appointments</h2>
      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {appointments.length === 0 && <p>No appointments found.</p>}
      {appointments.map(a => (
        <div key={a.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15, marginBottom: 12, maxWidth: 500 }}>
          <p><strong>Dr. {a.doctor_name}</strong> — {a.specialization}</p>
          <p>{a.date} | {a.start_time} - {a.end_time}</p>
          <p>Status: <span style={{ color: statusColor[a.status], fontWeight: "bold" }}>{a.status}</span></p>
          {a.notes && <p>Notes: {a.notes}</p>}
          {a.status === "pending" && (
            <>
              <button onClick={() => cancel(a.id)} style={{ marginRight: 8, padding: "5px 12px", background: "#e53935", color: "#fff", border: "none", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => startReschedule(a)} style={{ padding: "5px 12px", background: "#fb8c00", color: "#fff", border: "none", cursor: "pointer" }}>Reschedule</button>
            </>
          )}
          {rescheduleId === a.id && (
            <div style={{ marginTop: 10 }}>
              <select value={newSlotId} onChange={e => setNewSlotId(e.target.value)} style={{ padding: 6, marginRight: 8 }}>
                <option value="">Select new slot</option>
                {slots.map(s => <option key={s.id} value={s.id}>{s.date} | {s.start_time} - {s.end_time}</option>)}
              </select>
              <button onClick={reschedule} style={{ padding: "5px 12px", background: "#1976d2", color: "#fff", border: "none", cursor: "pointer" }}>Confirm</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
