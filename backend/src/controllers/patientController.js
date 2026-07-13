const db = require("../config/db");

const getDoctors = async (req, res) => {
  const { specialization } = req.query;
  try {
    let query = `SELECT u.id, u.name, u.email, d.id as doctor_id, d.specialization, d.experience, d.profile_image, d.bio
                 FROM users u JOIN doctors d ON u.id = d.user_id WHERE d.is_approved = TRUE`;
    const params = [];
    if (specialization) {
      query += " AND d.specialization LIKE ?";
      params.push(`%${specialization}%`);
    }
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSlots = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM time_slots WHERE doctor_id = ? AND is_booked = FALSE AND date >= CURDATE()",
      [doctorId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const bookAppointment = async (req, res) => {
  const { doctor_id, slot_id, notes } = req.body;
  const patient_id = req.user.id;
  try {
    const [slot] = await db.query("SELECT * FROM time_slots WHERE id = ? AND is_booked = FALSE", [slot_id]);
    if (!slot.length) return res.status(400).json({ message: "Slot not available" });

    await db.query(
      "INSERT INTO appointments (patient_id, doctor_id, slot_id, notes) VALUES (?, ?, ?, ?)",
      [patient_id, doctor_id, slot_id, notes]
    );
    await db.query("UPDATE time_slots SET is_booked = TRUE WHERE id = ?", [slot_id]);
    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.*, u.name as doctor_name, d.specialization, ts.date, ts.start_time, ts.end_time
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       JOIN time_slots ts ON a.slot_id = ts.id
       WHERE a.patient_id = ? ORDER BY ts.date DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const cancelAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const [appt] = await db.query(
      "SELECT * FROM appointments WHERE id = ? AND patient_id = ?",
      [id, req.user.id]
    );
    if (!appt.length) return res.status(404).json({ message: "Appointment not found" });

    await db.query("UPDATE appointments SET status = 'cancelled' WHERE id = ?", [id]);
    await db.query("UPDATE time_slots SET is_booked = FALSE WHERE id = ?", [appt[0].slot_id]);
    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const rescheduleAppointment = async (req, res) => {
  const { id } = req.params;
  const { new_slot_id } = req.body;
  try {
    const [appt] = await db.query(
      "SELECT * FROM appointments WHERE id = ? AND patient_id = ?",
      [id, req.user.id]
    );
    if (!appt.length) return res.status(404).json({ message: "Appointment not found" });

    const [newSlot] = await db.query("SELECT * FROM time_slots WHERE id = ? AND is_booked = FALSE", [new_slot_id]);
    if (!newSlot.length) return res.status(400).json({ message: "New slot not available" });

    await db.query("UPDATE time_slots SET is_booked = FALSE WHERE id = ?", [appt[0].slot_id]);
    await db.query("UPDATE appointments SET slot_id = ?, status = 'pending' WHERE id = ?", [new_slot_id, id]);
    await db.query("UPDATE time_slots SET is_booked = TRUE WHERE id = ?", [new_slot_id]);
    res.json({ message: "Appointment rescheduled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDoctors, getSlots, bookAppointment, getMyAppointments, cancelAppointment, rescheduleAppointment };
