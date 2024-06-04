const express = require("express");
const router = express.Router();
const noticesController = require('../controller/noticesController') //import contraller
const loginController = require('../controller/loginContraller')

router.get("/", noticesController.getAllNotices);//get notices details

router.get("/public", noticesController.getAllPublicNotices);//get notices details: Public endpoint

router.post("/edit",loginController.authenticateToken, noticesController.editNotice);//edit a notice

router.post("/add",loginController.authenticateToken, noticesController.addNotice);//add a notice

router.delete("/:id", noticesController.deleteNotice);//remove a Notice

module.exports = router;