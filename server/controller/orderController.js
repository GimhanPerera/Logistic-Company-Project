const { Order, Customer } = require('../models');



// //1. Add a order
const addOrder = async (req, res) => {
    const courier = req.body;
    await Courier.create(courier);
    res.status(200),json(courier)
}

// 2. Get all Order
const getAllOrderDetailsForOrderCard = async (req, res) => {
    try{
        const orders = await Order.findAll({
            attributes: ['order_id', 'status'],
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
const getOrderAndOrder = async (req, res) => {
    //const customer = await Customer.findByPK(id) //ID eken one nan
    const courier = await Order.findAll({
        include: [{
            model: Customer
        }],
        where: {order_id: '1000'}
    })
    res.status(200).json(customer)
}

module.exports = {
    addOrder,
    getAllOrderDetailsForOrderCard,
    getOrderAndOrder
}