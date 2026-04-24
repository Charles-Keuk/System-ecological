const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/db-test", (req, res) => {
  db.query("SELECT 1 + 1 AS result", (err, data) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(data);
  });
});

const testRoutes = require("./routes/test.routes");

app.use("/api", testRoutes);

module.exports = router;