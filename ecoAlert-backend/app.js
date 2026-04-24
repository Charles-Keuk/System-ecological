const express = require("express");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes test
app.get("/", (req, res) => {
  res.json({ message: "Backend OK" });
});

app.get("/api", (req, res) => {
  res.json({ message: "API EcoAlert OK 🚀" });
});

// routes auth
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

module.exports = app;