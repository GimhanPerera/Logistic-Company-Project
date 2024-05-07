const express = require("express");
const router = express.Router();
const packageContraller = require('../controller/packageContraller') //import contraller


router.post("/addpackages", packageContraller.addPackages);//add packages

module.exports = router;