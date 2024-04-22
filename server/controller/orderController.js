const { Order, Customer, Shipment,Price_quotation } = require('../models');



const newOrder = async (req, res) => {//Add a order - NOT TESTED
    
    const order = req.body;
    await Order.create(order);
    res.status(200),json(order)
}

const getAllOrderDetailsForOrderCard = async (req, res) => { //Get all Order
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
        },{
            model: Price_quotation,
            attributes: ['no_of_packages','quotation','shipping_method']
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
    isvalidtrackingnum
}