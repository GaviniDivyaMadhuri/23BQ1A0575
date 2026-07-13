const db = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const [[{ total_patients }]] = await db.query("SELECT COUNT(*) as total_patients FROM users WHERE role = 'patient'");
    const [[{ total_doctors }]] = await db.query("SELECT COUNT(*) as total_doctors FROM doctors");
    const [[{ total_appointments }]] = await db.query("SELECT COUNT(*) as total_appointments FROM appointments");
    const [[{ pending }]] = await db.query("SELECT COUNT(*) as pending FROM appointments WHERE status = 'pending'");
    res.json({ total_patients, total_doctors, total_appointments, pending_appointments: pending });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT u.id, u.name, u.email, u.phone, d.id as doctor_id, d.specialization, d.experience, d.is_approved FROM users u JOIN doctors d ON u.id = d.user_id"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const approveDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("UPDATE doctors SET is_approved = TRUE WHERE id = ?", [id]);
    res.json({ message: "Doctor approved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const [doctor] = await db.query("SELECT user_id FROM doctors WHERE id = ?", [id]);
    await db.query("DELETE FROM users WHERE id = ?", [doctor[0].user_id]);
    res.json({ message: "Doctor removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, email, phone, created_at FROM users WHERE role = 'patient'");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletePatient = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM users WHERE id = ? AND role = 'patient'", [id]);
    res.json({ message: "Patient removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.id, a.status, a.notes, a.created_at,
              p.name as patient_name, doc.name as doctor_name,
              d.specialization, ts.date, ts.start_time, ts.end_time
       FROM appointments a
       JOIN users p ON a.patient_id = p.id
       JOIN doctors d ON a.doctor_id = d.id
       JOIN users doc ON d.user_id = doc.id
       JOIN time_slots ts ON a.slot_id = ts.id
       ORDER BY ts.date DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboardStats, getAllDoctors, approveDoctor, deleteDoctor, getAllPatients, deletePatient, getAllAppointments };
