const express = require("express");
const router = express.Router();
const courierContraller = require('../controller/courierContraller') //import contraller

//Customer Url and Controllor
router.get("/", courierContraller.getAllCourier)
router.post("/", courierContraller.addCourier)
router.get("/test", courierContraller.test)

module.exports = router;