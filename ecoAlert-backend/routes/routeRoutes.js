const express = require("express");
const router = express.Router();
const { getRoute } = require("../controllers/routeController");

router.post("/route", getRoute);

module.exports = router;