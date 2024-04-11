const express = require("express");
const router = express.Router();
const orderController = require('../controller/orderController') //import contraller

//Customer Url and Controllor
router.get("/", orderController.getAllOrderDetailsForOrderCard)
router.post("/", orderController.addOrder)

module.exports = router;