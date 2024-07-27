const express = require("express");
const router = express.Router();
const courierController = require('../controller/courierController') //import controller

//Customer Url and controller
router.get("/", courierController.getAllCourier)
router.post("/", courierController.addCourier) //Add a courier service
router.post("/assign", courierController.assignCourier) //assign courier
router.post("/edit", courierController.editCourier) //not tested
router.get("/test", courierController.test) //For testing
router.delete("/:courier_id", courierController.deleteCourier); //Delete a courier
router.post("/clear", courierController.clearCourier); //clear courier assign


module.exports = router;