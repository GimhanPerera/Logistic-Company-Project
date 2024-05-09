const express = require("express");
const router = express.Router();
const supplierController = require('../controller/supplierController') //import contraller


router.get("/", supplierController.getAllSuppliers);//get all Supplier details
router.get("/foraddpackages", supplierController.getAllSuppliersForAddPackage);//get Supplier details for add packages
router.post("/", supplierController.addSupplier);//Add new supplier

module.exports = router;