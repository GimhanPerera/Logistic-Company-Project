const { Shipment, Order } = require('../models');



//Add a shipmet
const addShipment = async (req, res) => {
    try {
        const shipment = [{
            BL_no: req.body.BLnumber,
            shipping_method: req.body.shippingMethod,
            loaded_date: new Date(req.body.loadedDate), // Convert to Date object
            arrival_date: new Date(req.body.arrivalDate), // Convert to Date object
            displayed_arrival_date: new Date(req.body.displayDate) // Convert to Date object
        }];
        
        console.log(req.body.displayDate);
        await Shipment.create(shipment[0]); //need to check duplications

        // Update orders concurrently
        const orderUpdatePromises = req.body.orderIds.map(orderId => {
            console.log(orderId);
            return Order.update({
                BL_no: req.body.BLnumber,
                status: 'Ship/airfreight',
            }, {
                where: { order_id: orderId }
            });
        });

        await Promise.all(orderUpdatePromises);

        res.status(200).json(shipment);
    } catch (error) {
        // Handle error
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// 2. Get all Shipment details
const getAllShipments = async (req, res) => {
    try {
        //const customer = await Customer.findByPk(id) //ID eken one nan
        const shipment = await Shipment.findAll({
            include: [{
                model: Order,
                attributes: ['order_id']
            }]
        }) //{} : pass empty obj
        res.status(200).json(shipment);
    } catch (error) {
        // Handle error
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// // 2. Get all Courier
// const getCourierAndOrder = async (req, res) => {
//     //const customer = await Customer.findByPK(id) //ID eken one nan
//     const courier = await Courier.findAll({
//         include: [{
//             model: Courier
//         }],
//         where: {courier_id: '1000'}
//     })
//     res.status(200).json(customer)
// }

// const test = async (req, res) => {
//     res.status(200).json("TESTING DATA")
// }

module.exports = {
    getAllShipments,
    addShipment
}