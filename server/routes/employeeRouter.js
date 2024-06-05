const express = require("express");
const router = express.Router();
const empolyeeController = require('../controller/empolyeeController') 
const loginController = require('../controller/loginContraller')

//get data for the profile
router.get("/getForProfile",loginController.authenticateToken, empolyeeController.getEmployeeDataForProfile);

//set data form the profile
router.post("/setProfileData",loginController.authenticateToken, empolyeeController.setFromProfile);

//Change pwd
router.post("/changePwd",loginController.authenticateToken, empolyeeController.changePwd);

//Get all data for cards
router.get("/", empolyeeController.getAllEmployee);

//edit employee details
router.post("/edit", empolyeeController.editByID);

module.exports = router;