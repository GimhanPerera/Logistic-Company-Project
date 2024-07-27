const express = require("express");
const router = express.Router();
const smsGateway = require('../middleware/smsGateway')
const loginController = require('../controller/loginContraller')

//smsGateway Url and Controller
//router.get("/", smsGateway.sendTestSMS);

router.post("/",loginController.authenticateToken, smsGateway.sendSMSToOrder); //send custom sms

module.exports = router;