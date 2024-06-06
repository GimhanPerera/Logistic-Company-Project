const express = require("express");
const router = express.Router();
const reportController = require('../controller/reportController') //import contraller

router.get("/income/yearReport", reportController.getYearReport);

module.exports = router;