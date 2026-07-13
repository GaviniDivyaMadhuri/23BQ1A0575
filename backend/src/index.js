const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// CloudWatch-style request logger
app.use((req, res, next) => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip,
  }));
  next();
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/patient", require("./routes/patient"));
app.use("/api/doctor", require("./routes/doctor"));
app.use("/api/admin", require("./routes/admin"));

app.get("/health", (req, res) => res.json({ status: "OK" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
