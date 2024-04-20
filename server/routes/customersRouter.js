const express = require("express");
const router = express.Router();
const customerController = require('../controller/customerController') //import contraller

//Customer Url and Controllor
router.get("/", customerController.getAllCustomers)
router.post("/", customerController.addCustomer)

module.exports = router;