const { Order, Customer, Shipment, Price_quotation, Package,Invoice, Payment,Courier } = require('../models');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { sendNormalSMS } = require('../middleware/smsGateway');

const newOrder = async (req, res) => {//Add a order
    try {
        // Extract the filename
        const { filename: productImage } = req.files['image'][0];
        const { filename: invoice } = req.files['invoice'][0];
        let cus_id;
        if (req.body.status == "Just opened") {
            cus_id = req.body.cusID;
        } else if (req.body.status == "Request") {
            cus_id = req.user.sub;
        }
        console.log("CID: ", cus_id);

        let shippingmethod = 'A'
        if (req.body.shippingmethod == "Ship cargo") shippingmethod = 'S'

        //----------------------Update Order table----------------------------------
        // Get the last order ID of the given customer
        const lastOrder = await Order.findOne({
            where: {
                customer_id: cus_id,
        order_id: {
            [Op.like]: `${cus_id}${shippingmethod}%`
        }
            },
            order: [['order_id', 'DESC']]
        });
        

        // Extract the numeric portion from the last order ID and increment by one
        let newNumericPortion = 1001;
        if (lastOrder) {
            console.log("Last order: ",lastOrder.dataValues.order_id)
            const lastOrderId = lastOrder.order_id;
            const lastNumericPortion = parseInt(lastOrderId.substring(8), 10);
            //parseInt(lastOrderId.substring(orderId.length - 4), 10);
            newNumericPortion = lastNumericPortion + 1;
            //console.log("lastNumericPortion: "+lastNumericPortion)
        }

        

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
            "customer_id": cus_id,
            "category":req.body.category,
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
        console.log("New PQ_ID: " + new_price_quotation_id);

        let chatLink='';
        if(req.body.chatLink!=''){
            chatLink = `\nWECHAT link: ${req.body.chatLink}`;
        }
        const tempPwd = generateRandomPassword(6);
        sendNormalSMS(newOrderId, `Order placed\nOrder ID: ${newOrderId}\nCustomer ID: ${cus_id}\nTemplary pwd: ${tempPwd}${chatLink}\nContact: 0714744874`);//send sms
        

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

function generateRandomPassword(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
    }
    return password;
}

const confirmOrder = async (req, res) => {
    try {
        console.log("Updateing",req.body.order_id)
        const category = await Order.update({
            "status": "Just opened",
            "category": req.body.category,
        }, {
            where: {
                order_id: req.body.order_id // orderID HERE
            }
        })
        const resultQ = await Price_quotation.update(
            {
                "items": req.body.items,
                "packages": req.body.packages,
                "raugh_weight": req.body.weight,
                "shippingmethod": req.body.shippingmethod,
                "quotation": req.body.quotation,
                "quotation": req.body.quotation,
                "description": req.body.description,
                "supplierLoc": req.body.supplierLoc,//values.supplierLoc,
                "status": "confirmed",
            }, {
            where: {
                quotation_id: req.body.quotation_id // orderID HERE
            }
        })

        let chatLink='';
        if(req.body.chatLink!=''){
            chatLink = `\nWECHAT link: ${req.body.chatLink}`;
        }
        //const tempPwd = generateRandomPassword(6);
        sendNormalSMS(req.body.order_id, `Order placed\nOrder ID: ${req.body.order_id}\nCustomer ID: ${req.body.cusID}${chatLink}\nContact: 0714744874`);//send sms

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

const getCurrentSriLankanDateTime = () => {
    
    const currentDate = new Date();
    //const time = currentDate.toLocaleTimeString();//This give the GMT time. Need to add 5.30hours to convert to Sri Lankan time
    currentDate.setHours(currentDate.getHours() + 5);
    currentDate.setMinutes(currentDate.getMinutes() + 30);
    const updatedTime = currentDate.toLocaleTimeString(); //Sri lankan time

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${updatedTime}`;
    return formattedDate;
};

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
            attributes: ['displayed_arrival_date']
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
            attributes: ['displayed_arrival_date']
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

const updateTracking = async (req, res) => {
    try {
        console.log("BODY",req.body)
        //const tracking_id = req.body.tracking_id
        // const package = await Package.findAll({
        //     where: {order_id: req.params.orderId}
        // })
        // const order = await Order.findByPk(req.params.orderId, {
        //     attributes: ['main_tracking_number']
        // });
        Order.update({
            status: req.body.status
        },{
            where: { order_id: req.params.orderId } }
        );
        
        req.body.packages.forEach(packageData => {
            Package.update({
                status: packageData.status,
                warehouse_tracking_number: packageData.warehouse_tracking_number,
            },{
                where: { shipping_mark: packageData.shipping_mark } }
            );
        })
        res.status(200).json( req.params.orderId);
    } catch (error) {
        // Handle error
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const readyToShipOrderIDs = async (req, res) => {
    try {
        
        const orders = await Order.findAll({
            attributes: ['order_id', 'category'],
            where: { status: 'In Warehouse' }
        });
        //const orderIds = orders.map(item => item.order_id);
        res.status(200).json( orders);
    } catch (error) {
        // Handle error
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getAllDetailsOfAOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        // /const customer = await Customer.findByPk(req.params.customerID);

        const order = await Order.findOne({
            where: { order_id: orderId }
        });
        const customer = await Customer.findByPk(order.customer_id, {
            attributes: ['customer_id', 'f_name', 'l_name', 'tel_number', 'address']
        });
        const packages = await Package.findAll({
            where: { order_id: orderId }
        });
        const invoice = await Invoice.findOne({
            where: { order_id: orderId }
        });
        if (!invoice) {
            // Get the last invoice ID
            const lastInvoice = await Invoice.findOne({
                attributes: ['invoice_id'],
                order: [['invoice_id', 'DESC']]
            });

            // Determine the new invoice ID
            const newInvoiceId = lastInvoice ? lastInvoice.invoice_id + 1 : 10000;

            // Create a new invoice
            invoice = await Invoice.create({
                invoice_id: newInvoiceId,
                discount: 0.00, // Or any default value
                total: 0.00, // Or any default value
                order_id: orderId,
            });

        }
        const payment = await Payment.findAll({
            where: { order_id: orderId }
        });
        // if (!payment) {
        //     // Get the last invoice ID
        //     const lastPayment = await Payment.findOne({
        //         attributes: ['payment_id'],
        //         order: [['payment_id', 'DESC']]
        //     });

        //     // Determine the new invoice ID
        //     const newPaymentId = lastPayment ? lastPayment.invoice_id + 1 : 10000;

        //     // Create a new invoice
        //     invoice = await Invoice.create({
        //         payment_id: newPaymentId,
        //         payment_method: '', // Or any default value
        //         payment: 0.00, // Or any default value
        //         date_time: '',
        //         order_id: orderId,
        //     });

        // }

        //---------------------------------------------
        const priceReq = await Price_quotation.findAll({
            where: {
                order_id: orderId,
            },
        });
        const courier = await Courier.findOne({
            where: { courier_id: order.courier_id }
        });
        //res.status(200).json(responseData);
        //--------------------------------------------

        const respond = {
            order: order,
            customer: customer,
            packages: packages,
            invoice: invoice,
            priceReq: priceReq,
            payment: payment,
            courier: courier
        }
        res.status(200).json(respond)
    }catch (error) {
        // Handle error
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const toggleReadyStatus = async (req, res) => {
    try {
        console.log("OID ",req.body)
        const order = await Order.findByPk(req.body.oid);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Toggle the status
        if (order.status === 'onhand') {
            order.status = 'Ready';
            if(req.body.sendSMS)
                sendNormalSMS(req.body.oid, `ORDER STATUS UPDATE\n\nOrder ID: ${req.body.oid}\nYour order is ready.\nContact: 0714744874`);//send sms
        } else if (order.status === 'Ready') {
            order.status = 'onhand';
        }

        await order.save();
        res.json(order);

    }catch (error) {
        // Handle error
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getAllOrderDetailsForOrderCard = async (req, res) => { //Get all Order
    try {
        const orders = await Order.findAll({
            where: {
                status: {
                    [Op.ne]: 'Request'
                }
            },
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

const toggleCompleteStatus = async (req, res) => {
    try {
        console.log("OID ",req.body)
        const order = await Order.findByPk(req.body.oid);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Toggle the status
        // if (order.status === 'onhand') {
        //     order.status = 'Ready';
        // } else if (order.status === 'Ready') {
        //     order.status = 'onhand';
        // }

        order.status = 'FINISH';
        order.order_close_date = getCurrentSriLankanDateTime();

        await order.save();
        if(req.body.sendSMS)
            sendNormalSMS(req.body.oid, `ORDER STATUS UPDATE\n\nOrder ID: ${req.body.oid}\nYour order is completed.\nContact: 0714744874`);//send sms
        res.json(order);

    }catch (error) {
        // Handle error
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

//Delete order in just opend state
const deleteOrderJOstate = async (req, res) => {
    try {
        console.log(req.params.orderID);
        const paymnet = await Payment.destroy({
            where: {
                order_id: req.params.orderID,
            },
        });
        const package = await Package.destroy({
            where: {
                order_id: req.params.orderID,
            },
        });
        const quotation = await Price_quotation.destroy({
            where: {
                order_id: req.params.orderID,
            },
        });
        const order = await Order.destroy({
            where: {
                order_id: req.params.orderID,
            },
        });
        
        console.log(order);
        res.status(200).json("orderID " + req.params.orderID + " deleted");
    } catch (error) {
        console.error("Error deleting courier:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = {
    getAllOrderDetailsForOrderCard,
    newOrder,
    trackingDetailsOfACustomer,
    trackingDetailsOfAOrder,
    isvalidtrackingnum,
    confirmOrder,
    updateTracking,
    readyToShipOrderIDs,
    getAllDetailsOfAOrder,
    toggleReadyStatus,
    toggleCompleteStatus,
    deleteOrderJOstate,
}