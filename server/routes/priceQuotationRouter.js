const express = require("express");
const router = express.Router();
const priceQuotationController = require('../controller/priceQuotationController') //import contraller

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


router.post("/", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'invoice', maxCount: 1 }]), priceQuotationController.addAQuotationReq)

router.get("/", priceQuotationController.allRequests)

router.get("/searchby/id/:id", priceQuotationController.getRequestByID)

module.exports = router;