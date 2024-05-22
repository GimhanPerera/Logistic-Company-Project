const { Order, Customer, Shipment, Price_quotation } = require('../models');
const Sequelize = require('sequelize');


const newOrder = async (req, res) => {//Add a order - NOT TESTED
    try {
        // Extract the filename
        const { filename: productImage } = req.files['image'][0];
        const { filename: invoice } = req.files['invoice'][0];
        let cus_id;
        console.log("Req: ");
        if (req.body.status == "Just opened") {
            cus_id = req.body.cusID;
        } else if (req.body.status == "Request") {
            cus_id = req.user.sub;
        }
        console.log("CID: ", cus_id);

        //----------------------Update Order table----------------------------------
        // Get the last order ID of the given customer
        const lastOrder = await Order.findOne({
            where: {
                customer_id: cus_id
            },
            order: [['order_id', 'DESC']]
        });

        // Extract the numeric portion from the last order ID and increment by one
        let newNumericPortion = 1001;
        if (lastOrder) {
            const lastOrderId = lastOrder.order_id;
            const lastNumericPortion = parseInt(lastOrderId.substring(8), 10);
            //parseInt(lastOrderId.substring(orderId.length - 4), 10);
            newNumericPortion = lastNumericPortion + 1;
            //console.log("lastNumericPortion: "+lastNumericPortion)
        }

        let shippingmethod = 'A'
        if (req.body.shippingmethod == "Ship cargo") shippingmethod = 'S'

        // Combine customer ID, shipping method, and the new numeric portion to create the new order ID
        const newOrderId = `${cus_id}${shippingmethod}-${newNumericPortion}`;
        console.log("NEW OID: " + newOrderId)

        const existingTrackingNumbers = await Order.findAll({
            attributes: ['main_tracking_number']
        });
        const newTnumbers = generateUniqueTrackingNumber(existingTrackingNumbers.map(order => order.main_tracking_number));



        const newOrder = await Order.create({
            "order_id": newOrderId,
            "order_open_date": getCurrentSriLankanDateTime(),
            "supplier_loc": req.body.supplierLoc,
            "main_tracking_number": newTnumbers, //NEW TRACKING NUMBER
            "status": req.body.status,
            "customer_id": cus_id
        });

        console.log("Order table updated")

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
            "quotation": req.body.quotation,
            "order_id": newOrderId,
            "status": req.body.status,
        });
        console.log("Price quotation table updated")
        console.log("PRODUCT IMAGE: " + productImage)
        console.log("PERFORMA INVOICE: " + invoice)
        console.log("NEW ORDER OPENED: " + newOrderId)

        res.status(200).json("SUCCESS")

    } catch (error) {
        // Handle error
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const confirmOrder = async (req, res) => {
    try {
        console.log("Updateing",req.body.order_id)
        const resultO = await Order.update({
            "status": "Just opened",
        }, {
            where: {
                order_id: req.body.order_id // orderID HERE
            }
        })
        const resultQ = await Price_quotation.update(
            {
                "items": req.body.items,
                "packages": req.body.packages,
                "weight": req.body.weight,
                "shippingmethod": req.body.shippingmethod,
                "quotation": req.body.quotation,
                "description": req.body.description,
                "supplierLoc": req.body.supplierLoc,//values.supplierLoc,
                "status": "confirmed",
            }, {
            where: {
                quotation_id: req.body.quotation_id // orderID HERE
            }
        })
        res.status(200).json("Updated");
    } catch (error) {
        // Handle error
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }

}

// Function to generate a random alphanumeric string of a specified length
const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// Function to generate a unique tracking number
const generateUniqueTrackingNumber = (existingTrackingNumbers) => {
    let trackingNumber;
    do {
        trackingNumber = generateRandomString(11);
    } while (existingTrackingNumbers.includes(trackingNumber));
    return trackingNumber;
};

const getCurrentSriLankanDateTime = () => { //Not working well

    const currentDate = new Date();

    const formattedDateTime = currentDate.toISOString().slice(0, 19).replace('T', ' '); // Format: 'YYYY-MM-DD HH:mm:ss'
    return formattedDateTime;
}



const getAllOrderDetailsForOrderCard = async (req, res) => { //Get all Order
    try {
        const orders = await Order.findAll({
            include: [{
                model: Customer,
                attributes: ['customer_id', 'f_name', 'l_name', 'tel_number']
            }]
        });

        res.status(200).json(orders);

    } catch (error) {
        // Handle error
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }

}


// 2. Get all Courier
const getCourierAndOrder = async (req, res) => {
    //const courier = await Customer.findByPk(id) //ID eken one nan
    const courier = await Order.findAll({
        include: [{
            model: Customer
        }],
        where: { order_id: '1000' }
    })
    res.status(200).json(courier)
}

const trackingDetailsOfACustomer = async (req, res) => { //After customer login, Access the tracking details
    //console.table(req.user)
    const cus_id = req.user.sub //"CFL610"
    //console.log(cus_id)
    const order = await Order.findAll({
        attributes: ['order_id', 'main_tracking_number', 'status', 'supplier_loc', 'order_open_date'],
        include: [{
            model: Shipment,
            attributes: ['desplayed_arriveal_date']
        }],
        where: {
            customer_id: cus_id
        }
    })
    res.status(200).json(order)
}

const trackingDetailsOfAOrder = async (req, res) => {//Tracking details of individual orders
    const tracking_id = req.body.tracking_id
    console.log(tracking_id)
    const order = await Order.findAll({
        attributes: ['order_id', 'main_tracking_number', 'status', 'supplier_loc', 'order_open_date'],
        include: [{
            model: Shipment,
            attributes: ['desplayed_arriveal_date']
        }, {
            model: Price_quotation,
            attributes: ['no_of_packages', 'quotation', 'shipping_method']
        }],
        where: {
            main_tracking_number: tracking_id
        }
    })
    res.status(200).json(order)
}

const isvalidtrackingnum = async (req, res) => {//When customer enter the tracking number. This check it is valid or not
    try {
        const tracking_id = req.body.tracking_id;
        console.log(tracking_id);
        if (!tracking_id) {
            const valid = { isValid: false };
            res.status(200).json(valid);
            return;
        }
        const order = await Order.findAll({
            where: { main_tracking_number: tracking_id }
        });
        console.log(order)
        if (order && order.length > 0) { // Check if order is not empty
            const valid = { isValid: true };
            res.status(200).json(valid);
        } else {
            const valid = { isValid: false };
            res.status(200).json(valid);
        }
    } catch (error) {
        // Handle error
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};




module.exports = {
    getAllOrderDetailsForOrderCard,
    newOrder,
    trackingDetailsOfACustomer,
    trackingDetailsOfAOrder,
    isvalidtrackingnum,
    confirmOrder,

}