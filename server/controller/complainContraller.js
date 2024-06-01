const { Complain } = require('../models');


//Add a complain
const addAComplain = async (req, res) => {
    try {
        //NEED TO VALIDATE: order id is actualy this customer's order
        console.log("Complain: " + req.body);
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
        res.status(400).json("Server error");
    }
}

// Get all Complains
const getAllComplains = async (req, res) => {
    const complains = await Complain.findAll({});

    res.status(200).json(complains)
}

const setAsReviewed = async (req, res) => {
    try {
        const complain = await Complain.findByPk(req.body.complain_id);
        complain.status = req.body.status;

        await complain.save();
        res.status(200).json(complain);

    } catch (error) {
        res.status(400).json("Server error");
    }
}

const testFunction = async (req, res) => {
    try {
        res.status(200).json(complain);

    } catch (error) {
        res.status(400).json("Server error");
    }
}

module.exports = {
    addAComplain,
    getAllComplains,
    setAsReviewed
}