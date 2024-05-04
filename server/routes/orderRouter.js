const express = require("express");
const router = express.Router();
const orderController = require('../controller/orderController') //import contraller
const loginController = require('../controller/loginContraller') //import contraller

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

//Customer Url and Controllor
router.get("/", orderController.getAllOrderDetailsForOrderCard)

router.post("/", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'invoice', maxCount: 1 }]), orderController.newOrder);

//In the website, After custoemr login
router.get("/myTrackingDetails",loginController.authenticateToken, orderController.trackingDetailsOfACustomer)//

//Tracking details of paticulaer order
router.post("/trackorder", orderController.trackingDetailsOfAOrder)

//Check the tracking number is correct
router.post("/isvalidtrackingnum", orderController.isvalidtrackingnum)

module.exports = router;