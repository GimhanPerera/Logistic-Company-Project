const express = require("express");
const router = express.Router();
const noticesController = require('../controller/noticesController') //import contraller


router.get("/", noticesController.getAllNotices);//get notices details

router.get("/public", noticesController.getAllPublicNotices);//get notices details: Public endpoint

// router.post("/addPayment", invoiceController.addPayment);//add payment

router.delete("/:id", noticesController.deleteNotice);//remove a Notice

module.exports = router;