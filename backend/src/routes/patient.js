const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getDoctors, getSlots, bookAppointment,
  getMyAppointments, cancelAppointment, rescheduleAppointment
} = require("../controllers/patientController");

router.get("/doctors", auth(["patient"]), getDoctors);
router.get("/doctors/:doctorId/slots", auth(["patient"]), getSlots);
router.post("/appointments", auth(["patient"]), bookAppointment);
router.get("/appointments", auth(["patient"]), getMyAppointments);
router.put("/appointments/:id/cancel", auth(["patient"]), cancelAppointment);
router.put("/appointments/:id/reschedule", auth(["patient"]), rescheduleAppointment);

module.exports = router;
