const router = require("express").Router();
const auth = require("../middleware/auth");
const { upload } = require("../config/s3");
const {
  getDoctorProfile, uploadProfileImage,
  addSlot, getMySlots, getDoctorAppointments, updateAppointmentStatus
} = require("../controllers/doctorController");

router.get("/profile", auth(["doctor"]), getDoctorProfile);
router.post("/profile/image", auth(["doctor"]), upload.single("image"), uploadProfileImage);
router.post("/slots", auth(["doctor"]), addSlot);
router.get("/slots", auth(["doctor"]), getMySlots);
router.get("/appointments", auth(["doctor"]), getDoctorAppointments);
router.put("/appointments/:id/status", auth(["doctor"]), updateAppointmentStatus);

module.exports = router;
