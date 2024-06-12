const express = require("express");
const router = express.Router();
const shipmentController = require('../controller/shipmentController') //import contraller
const loginController = require('../controller/loginContraller')

//Customer Url and Controllor
router.get("/", shipmentController.getAllShipments);

//addShipment
router.post("/", shipmentController.addShipment);

//get all packages of a shipment
router.get("/getPackagesOf/:BLnumber", shipmentController.getPackagesOfAShipment);

//get all packages of a shipment
router.post("/saveScanUpdates",loginController.authenticateToken, shipmentController.saveScanUpdates);

//delete Shipment
router.delete("/:BL_number", shipmentController.deleteShipment);

//get shipment
router.post("/update", shipmentController.editShipment);

//Get package details for show in completed Shipments
router.get("/getPackagesDetails/:BLnumber", shipmentController.getPackagesDetailsFromBL);

module.exports = router;