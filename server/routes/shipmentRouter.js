const express = require("express");
const router = express.Router();
const shipmentController = require('../controller/shipmentController') //import contraller

//Customer Url and Controllor
router.get("/", shipmentController.getAllShipments);

//addShipment
router.post("/", shipmentController.addShipment);

module.exports = router;