const express = require("express");
const router = express.Router();
const dashboardController = require('../controller/dashboardController') //import contraller

router.get("/", dashboardController.getDashboardData);

module.exports = router;