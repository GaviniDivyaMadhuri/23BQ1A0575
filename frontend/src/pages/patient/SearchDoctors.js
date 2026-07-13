import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function SearchDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/patient/doctors?specialization=${search}`).then(r => setDoctors(r.data));
  }, [search]);

  const loadSlots = async (doctor) => {
    setSelectedDoctor(doctor);
    const { data } = await api.get(`/patient/doctors/${doctor.doctor_id}/slots`);
    setSlots(data);
  };

  const book = async () => {
    try {
      await api.post("/patient/appointments", { doctor_id: selectedDoctor.doctor_id, slot_id: selectedSlot, notes });
      setMsg("Appointment booked!");
      setSelectedDoctor(null);
    } catch (err) {
      setMsg(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Find Doctors</h2>
      <button onClick={() => navigate("/patient/appointments")} style={{ marginBottom: 15, padding: "6px 14px" }}>My Appointments</button>
      <input placeholder="Search by specialization..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: 8, width: 300, marginBottom: 20 }} />
      {msg && <p style={{ color: "green" }}>{msg}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 15 }}>
        {doctors.map(d => (
          <div key={d.doctor_id} style={cardStyle}>
            {d.profile_image && <img src={d.profile_image} alt="profile" style={{ width: 60, height: 60, borderRadius: "50%" }} />}
            <h3>{d.name}</h3>
            <p>{d.specialization}</p>
            <p>{d.experience} years experience</p>
            <p style={{ fontSize: 12 }}>{d.bio}</p>
            <button onClick={() => loadSlots(d)} style={btnStyle}>Book Appointment</button>
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <div style={{ marginTop: 20, padding: 20, border: "1px solid #ccc", maxWidth: 400 }}>
          <h3>Book with Dr. {selectedDoctor.name}</h3>
          <select value={selectedSlot} onChange={e => setSelectedSlot(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 10 }}>
            <option value="">Select a slot</option>
            {slots.map(s => (
              <option key={s.id} value={s.id}>{s.date} | {s.start_time} - {s.end_time}</option>
            ))}
          </select>
          <textarea placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 10 }} />
          <button onClick={book} style={btnStyle}>Confirm Booking</button>
          <button onClick={() => setSelectedDoctor(null)} style={{ marginLeft: 10 }}>Cancel</button>
        </div>
      )}
    </div>
  );
}

const cardStyle = { border: "1px solid #ddd", borderRadius: 8, padding: 15, width: 220 };
const btnStyle = { background: "#1976d2", color: "#fff", border: "none", padding: "8px 14px", cursor: "pointer", borderRadius: 4 };
