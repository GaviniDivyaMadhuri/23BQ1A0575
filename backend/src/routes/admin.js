const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getDashboardStats, getAllDoctors, approveDoctor, deleteDoctor,
  getAllPatients, deletePatient, getAllAppointments
} = require("../controllers/adminController");

router.get("/dashboard", auth(["admin"]), getDashboardStats);
router.get("/doctors", auth(["admin"]), getAllDoctors);
router.put("/doctors/:id/approve", auth(["admin"]), approveDoctor);
router.delete("/doctors/:id", auth(["admin"]), deleteDoctor);
router.get("/patients", auth(["admin"]), getAllPatients);
router.delete("/patients/:id", auth(["admin"]), deletePatient);
router.get("/appointments", auth(["admin"]), getAllAppointments);

module.exports = router;
