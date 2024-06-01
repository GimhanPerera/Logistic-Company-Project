const express = require("express");
const router = express.Router();
const reportController = require('../controller/reportController') //import contraller

router.get("/income", reportController.getReportData);

module.exports = router;