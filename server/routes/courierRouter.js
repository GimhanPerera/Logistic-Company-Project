const express = require("express");
const router = express.Router();
const courierController = require('../controller/courierController') //import contraller

//Customer Url and Controllor
router.get("/", courierController.getAllCourier)
router.post("/", courierController.addCourier) //Add a courier service
router.post("/edit", courierController.editCourier) //not tested
router.get("/test", courierController.test) //For testing
router.delete("/:courier_id", courierController.deleteCourier); //Delete a courier


module.exports = router;