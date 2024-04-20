const { Complain } = require('../models');



//1. Add a complain
const addAComplain = async (req, res) => {
    try {
        //NEED TO VALIDATE: order id is actualy this customer's order
        console.log("Complain: "+req.body);
        //if(!req.body.complain) return res.status(400).json({"error": "Complain no found"});
        const complainData = {
            complain: req.body.complain,
            status: "pending",
            order_id: req.body.order_id
        };
        await Complain.create(complainData);
        const respondData = {
            order_id: req.body.order_id,
            status: "success",
        };
        res.status(200).json(respondData);
    } catch (error) {
        // Handle error
        console.error('Error inserting complain:', error);
        throw error; // Rethrow the error for handling in the caller function
    }
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

const test = async (req, res) => {
    res.status(200).json("TESTING DATA")
}

module.exports = {
    addAComplain,
}