const { Courier } = require('../models');



//1. Add a customer
const addCourier = async (req, res) => {
    const courier = req.body;
    await Courier.create(courier);
    res.status(200).json(courier)
}

const editCourier = async (req, res) => {
    try {
        console.table(req.body);

        // Convert tel_number to an integer
        const telNumber = parseInt(req.body.tel_number);

        // Find the courier by ID
        const courier = await Courier.findByPk(req.body.courier_id);

        // Update the courier's name and tel_number
        courier.name = req.body.name;
        courier.tel_number = telNumber; // Assign the integer tel_number
        await courier.save();

        res.status(200).json(req.body.courier_id + ' Updated');
    } catch (error) {
        console.error('Error updating courier:', error);
        res.status(500).json({ error: 'Internal server error' });
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

const deleteCourier = async (req, res) => {
    try {
        const a = await Courier.destroy({
            where: {
                courier_id: req.params.courier_id,
            },
        });
        console.log(a);
        res.status(200).json("Courier number " + req.params.courier_id + " deleted");
    } catch (error) {
        console.error("Error deleting courier:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const test = async (req, res) => {
    res.status(200).json("TESTING DATA")
}

module.exports = {
    addCourier,
    getAllCourier,
    getCourierAndOrder,
    deleteCourier,
    editCourier,
    test
}