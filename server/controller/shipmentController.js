const { Shipment, Order } = require('../models');



// //1. Add a customer
// const addCourier = async (req, res) => {
//     const courier = req.body;
//     await Courier.create(courier);
//     res.status(200),json(courier)
// }

// 2. Get all Shipment details
const getAllShipments = async (req, res) => {
    //const customer = await Customer.findByPk(id) //ID eken one nan
    const shipment = await Shipment.findAll({
        include: [{
            model: Order,
            attributes: ['order_id']
        }]
    }) //{} : pass empty obj
    res.status(200).json(shipment)
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
}