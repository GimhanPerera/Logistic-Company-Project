const { Order, Customer, Shipment } = require('../models');



// //1. Add a order
const addOrder = async (req, res) => {
    const order = req.body;
    await Order.create(order);
    res.status(200),json(order)
}

// 2. Get all Order
const getAllOrderDetailsForOrderCard = async (req, res) => {
    try{
        const orders = await Order.findAll({
            include: [{
                model: Customer,
                attributes: ['customer_id', 'f_name','l_name']
            }]
        });
        
        res.status(200).json(orders);

    }catch (error) {
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
        where: {order_id: '1000'}
    })
    res.status(200).json(courier)
}

//After customer login, Access the tracking details
const trackingDetailsOfACustomer = async (req, res) => {
    console.table(req.user)
    const cus_id = req.user.sub
    console.log(cus_id)
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

const trackingDetailsOfAOrder = async (req, res) => {//All good
    const tracking_id = req.body.tracking_id
    console.log(tracking_id)
    const order = await Order.findAll({
        attributes: ['order_id', 'main_tracking_number', 'status', 'supplier_loc', 'order_open_date'],
        include: [{
            model: Shipment,
            attributes: ['desplayed_arriveal_date']
        }],
        where: {
            main_tracking_number: tracking_id
        }
    })
    res.status(200).json(order)
}

const isvalidtrackingnum = async (req, res) => {
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
    addOrder,
    trackingDetailsOfACustomer,
    trackingDetailsOfAOrder,
    isvalidtrackingnum
}