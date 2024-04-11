const { Courier } = require('../models');



//1. Add a customer
const addCourier = async (req, res) => {
    const courier = req.body;
    await Courier.create(courier);
    res.status(200),json(courier)
}

// 2. Get all Courier
const getAllCourier = async (req, res) => {
    //const customer = await Customer.findByPk(id) //ID eken one nan
    const courier = await Courier.findAll({}) //{} : pass empty obj
    res.status(200).json(courier)
}

// 2. Get all Courier
const getCourierAndOrder = async (req, res) => {
    //const customer = await Customer.findByPK(id) //ID eken one nan
    const courier = await Courier.findAll({
        include: [{
            model: Courier
        }],
        where: {courier_id: '1000'}
    })
    res.status(200).json(customer)
}

module.exports = {
    addCourier,
    getAllCourier,
    getCourierAndOrder
}