const express = require("express");
const router = express.Router();
const invoiceController = require('../controller/invoiceController') //import contraller


router.get("/:orderId", invoiceController.getInvoiceDetails);//get invoice details

router.post("/", invoiceController.setInvoiceDetails);//update invoice details

module.exports = router;