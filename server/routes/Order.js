const express = require("express");
const router = express.Router();
const orderController = require('../controller/orderController') //import contraller
const loginController = require('../controller/loginContraller') //import contraller

//Customer Url and Controllor
router.get("/", orderController.getAllOrderDetailsForOrderCard)

router.post("/", orderController.addOrder)//DIDN'T USED OR CHECKED YET

//In the website, After custoemr login
router.get("/myTrackingDetails",loginController.authenticateToken, orderController.trackingDetailsOfACustomer)

//Tracking details of paticulaer order
router.post("/trackorder", orderController.trackingDetailsOfAOrder)

//Check the tracking number is correct
router.post("/isvalidtrackingnum", orderController.isvalidtrackingnum)

module.exports = router;