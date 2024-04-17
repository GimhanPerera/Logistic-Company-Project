const express = require("express");
const router = express.Router();
const shipmentController = require('../controller/shipmentController') //import contraller

//Customer Url and Controllor
router.get("/", shipmentController.getAllShipments)



module.exports = router;