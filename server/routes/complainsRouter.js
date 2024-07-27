const express = require("express");
const router = express.Router();
const complainContraller = require('../controller/complainContraller') //import controller
const loginController = require('../controller/loginContraller') //import controller

//Complain Url and Controllor
router.post("/", complainContraller.addAComplain)

//Get all complains
router.get("/", complainContraller.getAllComplains)

//Get all complains
router.post("/reviewed", complainContraller.setAsReviewed)

module.exports = router;