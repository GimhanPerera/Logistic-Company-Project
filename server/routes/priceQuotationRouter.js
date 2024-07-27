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

//add a price quotation
router.post("/", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'invoice', maxCount: 1 }]), priceQuotationController.addAQuotationReq)

//Get all price quotation
router.get("/", priceQuotationController.allRequests)

//search price quotation by id
router.get("/searchby/id/:id", priceQuotationController.getRequestByID)

//req: Quotation id, res: Image
router.get("/download/image/:quotation_id", priceQuotationController.downloadImage)

//req: Quotation id, res: Performa invoice
router.get("/download/invoice/:quotation_id", priceQuotationController.downloadInvoice)

//Delete request
router.delete("/:quotation_id", priceQuotationController.deleteRequest)


module.exports = router;