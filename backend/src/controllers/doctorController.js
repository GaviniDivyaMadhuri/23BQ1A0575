const db = require("../config/db");
const { uploadToS3 } = require("../config/s3");

const getDoctorProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT u.name, u.email, u.phone, d.* FROM users u JOIN doctors d ON u.id = d.user_id WHERE u.id = ?",
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const result = await uploadToS3(req.file);
    const [doctor] = await db.query("SELECT id FROM doctors WHERE user_id = ?", [req.user.id]);
    await db.query("UPDATE doctors SET profile_image = ? WHERE id = ?", [result.Location, doctor[0].id]);
    res.json({ imageUrl: result.Location });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addSlot = async (req, res) => {
  const { date, start_time, end_time } = req.body;
  try {
    const [doctor] = await db.query("SELECT id FROM doctors WHERE user_id = ?", [req.user.id]);
    await db.query(
      "INSERT INTO time_slots (doctor_id, date, start_time, end_time) VALUES (?, ?, ?, ?)",
      [doctor[0].id, date, start_time, end_time]
    );
    res.status(201).json({ message: "Slot added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMySlots = async (req, res) => {
  try {
    const [doctor] = await db.query("SELECT id FROM doctors WHERE user_id = ?", [req.user.id]);
    const [rows] = await db.query("SELECT * FROM time_slots WHERE doctor_id = ? ORDER BY date", [doctor[0].id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const [doctor] = await db.query("SELECT id FROM doctors WHERE user_id = ?", [req.user.id]);
    const [rows] = await db.query(
      `SELECT a.*, u.name as patient_name, u.phone, ts.date, ts.start_time, ts.end_time
       FROM appointments a
       JOIN users u ON a.patient_id = u.id
       JOIN time_slots ts ON a.slot_id = ts.id
       WHERE a.doctor_id = ? ORDER BY ts.date DESC`,
      [doctor[0].id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const [doctor] = await db.query("SELECT id FROM doctors WHERE user_id = ?", [req.user.id]);
    await db.query(
      "UPDATE appointments SET status = ? WHERE id = ? AND doctor_id = ?",
      [status, id, doctor[0].id]
    );
    res.json({ message: `Appointment ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDoctorProfile, uploadProfileImage, addSlot, getMySlots, getDoctorAppointments, updateAppointmentStatus };
