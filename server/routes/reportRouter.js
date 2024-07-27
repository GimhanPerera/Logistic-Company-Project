const express = require("express");
const router = express.Router();
const reportController = require('../controller/reportController') //import contraller
const packageReportController = require('../controller/packageReportController')

router.get("/income/yearReport", reportController.getYearReport); //get yearly income report
router.get("/income/monthReport", reportController.getMonthReport); //get monthly income report
router.get("/package/monthReport", packageReportController.getYearReport); //get monthly package report

module.exports = router;