const express = require("express");
const router = express.Router();
const smsGateway = require('../middleware/smsGateway') //import contraller

//smsGateway Url and Controller
router.get("/", smsGateway.sendTestSMS);


module.exports = router;