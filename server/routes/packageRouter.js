const express = require("express");
const router = express.Router();
const packageContraller = require('../controller/packageContraller') //import contraller


router.post("/addpackages", packageContraller.addPackages);//add packages

router.get("/getpackages/:orderId", packageContraller.getPackages);//get packages

module.exports = router;