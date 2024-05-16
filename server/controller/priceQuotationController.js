const { Price_quotation } = require('../models');



//add a quotation request
const addAQuotationReq = async (req, res) => {//Add a order - NOT TESTED
    try {
        // Extract the filename
        const { filename: productImage } = req.files['image'][0];
        const { filename: invoice } = req.files['invoice'][0];

        //----------------------Update Price_quotation table----------------------------------
        // Get the last Price_quotation_id
        const last_price_quotation_id = await Price_quotation.findOne({
            order: [['quotation_id', 'DESC']]
        });
        console.log("Last PQ_ID: " + last_price_quotation_id.quotation_id)
        // Calculate the new complain_id
        const new_price_quotation_id = last_price_quotation_id.quotation_id ? last_price_quotation_id.quotation_id + 1 : 1001;
        // Insert the new record
        console.log("New PQ_ID: " + new_price_quotation_id)
        const newPriceQuotation = await Price_quotation.create({
            "quotation_id": new_price_quotation_id,
            "items": req.body.items,
            "raugh_weight": req.body.weight,
            "shipping_method": req.body.shippingmethod,
            "no_of_packages": req.body.packages,
            "description": req.body.description,
            "image": productImage,
            "performa_invoice": invoice,
            "status":"request"
        });
        console.log("Price quotation table updated")
        console.log("PRODUCT IMAGE: " + productImage)
        console.log("PERFORMA INVOICE: " + invoice)
        
        res.status(200).json("SUCCESS")

    } catch (error) {
        // Handle error
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const allRequests = async (req, res) => {
    try {
        const priceReq = await Price_quotation.findAll({
            where: {
                status: "request",
            },
        });
        console.log(priceReq);
        res.status(200).json(priceReq);
    } catch (error) {
        console.error("Error deleting courier:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    addAQuotationReq,
    allRequests
}