const { Price_quotation,Order } = require('../models');


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

//get all quotation req
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

//get quotation details by ID
const getRequestByID = async (req, res) => {
    try {
        const priceReq = await Price_quotation.findOne({
            where: {
                quotation_id: req.params.id,
            },
        });
        console.log("priceReq",priceReq.items)
        const order = await Order.findOne({
            where: {
                order_id: priceReq.order_id,
            },
        });
        const responseData = {
            priceReq: priceReq,
            order: order // Adding order.supplier_loc to the response
        };
        //console.table(responseData.order)
        //console.log("QID: "+req.params.id)
        res.status(200).json(responseData);
    } catch (error) {
        console.error("Error deleting courier:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

//download item image
const downloadImage = async (req, res) => {
    try {
        console.log(req.params.quotation_id)
        const imageOfItem = await Price_quotation.findOne({
            attributes: ['image'],
            where: {
                quotation_id: req.params.quotation_id,
            },
        });
        
        if (imageOfItem) {
            console.log("IMAGE ",imageOfItem.image);
            res.download(`./images/${imageOfItem.image}`);
        } else {
            res.status(404).json({ error: "Image not found" });
        }
        
    } catch (error) {
        console.error("Error deleting courier:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

//download invoice
const downloadInvoice = async (req, res) => {
    try {
        console.log(req.params.quotation_id)
        const invoiceOfItem = await Price_quotation.findOne({
            attributes: ['performa_invoice'],
            where: {
                quotation_id: req.params.quotation_id,
            },
        });
        
        if (invoiceOfItem) {
            console.log("IMAGE ",invoiceOfItem.performa_invoice);
            res.download(`./images/${invoiceOfItem.performa_invoice}`);
        } else {
            res.status(404).json({ error: "Image not found" });
        }
        
    } catch (error) {
        console.error("Error deleting courier:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

//delete quotation request
const deleteRequest = async (req, res) => {
    try {
        // Find the order_id associated with the given quotation_id
        const priceQuotation = await Price_quotation.findOne({
            attributes: ['order_id'],
            where: {
                quotation_id: req.params.quotation_id,
            },
        });

        if (!priceQuotation) {
            // If no price quotation is found, send a 404 response
            return res.status(404).json({ error: "Price quotation not found" });
        }

        const { order_id } = priceQuotation;

        // Delete the price quotation with the given quotation_id
        await Price_quotation.destroy({
            where: {
                quotation_id: req.params.quotation_id,
            },
        });

        // Delete the order with the found order_id
        await Order.destroy({
            where: {
                order_id: order_id,
            },
        });

        console.log("Quotation deleted: ", req.params.quotation_id);
        console.log("Order ID deleted: ", order_id);
        res.status(200).json("success");
    } catch (error) {
        console.error("Error deleting price quotation and order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    addAQuotationReq,
    allRequests,
    getRequestByID,
    downloadImage,
    downloadInvoice,
    deleteRequest
}
