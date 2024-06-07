const express = require("express");
const router = express.Router();
const reportController = require('../controller/reportController') //import contraller
const packageReportController = require('../controller/packageReportController')

router.get("/income/yearReport", reportController.getYearReport);
router.get("/income/monthReport", reportController.getMonthReport);
router.get("/package/monthReport", packageReportController.getYearReport);

module.exports = router;