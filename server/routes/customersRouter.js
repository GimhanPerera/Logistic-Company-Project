const express = require("express");
const router = express.Router();
const customerController = require('../controller/customerController') //import controller
const loginController = require('../controller/loginContraller')
//---------------------------------
const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
// For handling file uploads
const upload = multer({storage: storage})
//-------------------------------------


router.get("/", customerController.getAllCustomers) //get all customer data
router.post("/", upload.fields([{ name: 'nicFront', maxCount: 1 }, { name: 'nicBack', maxCount: 1 }]), customerController.addCustomer) //Add a customer
router.get("/search/:customerID", customerController.searchCustomerByID) //Search customer by ID - Order creation part
router.get("/searchby/quotation/:quotationID", customerController.searchCustomerByQuotationID) //Search customer by quotation ID: for confirm order part
router.post("/edit", customerController.editProfile) //edit customer data

//Change pwd
router.post("/changePwd",loginController.authenticateToken, customerController.changePwd);
router.get("/nic/:image", customerController.downloadNIC);

module.exports = router;