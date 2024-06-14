const { Courier,Order } = require('../models');
const { Op } = require('sequelize');

//1. Add a customer
const addCourier = async (req, res) => {
    try {
        const courierEmployee1 = await Courier.findOne({
            where: {
                name: req.body.name,
            }
        });
        if (courierEmployee1) {
            console.log("EXISTE name")
            return res.status(400).json({ error: "Name already exists for another courier" });
        }

        const courierEmployee2 = await Courier.findOne({
            where: {
                tel_number: req.body.tel_number,
            }
        });
        if (courierEmployee2) {
            console.log("EXISTE telephone")
            return res.status(400).json({ error: "Telephone number already exists for another courier" });
        }

    const courier = req.body;
    await Courier.create(courier);
    res.status(200).json(courier)
} catch (error) {
    console.error('Error updating courier:', error);
    res.status(500).json({ error: 'Internal server error' });
}
}

const editCourier = async (req, res) => {
    try {
        console.table(req.body);

        // Convert tel_number to an integer
        const telNumber = parseInt(req.body.tel_number);
        const courierEmployee1 = await Courier.findOne({
            where: {
                name: req.body.name,
                courier_id: {
                    [Op.ne]: req.body.courier_id
                }
            }
        });
        if (courierEmployee1) {
            console.log("EXISTE name")
            return res.status(400).json({ error: "Name already exists for another courier" });
        }

        const courierEmployee2 = await Courier.findOne({
            where: {
                tel_number: req.body.tel_number,
                courier_id: {
                    [Op.ne]: req.body.courier_id
                }
            }
        });
        if (courierEmployee2) {
            console.log("EXISTE telephone")
            return res.status(400).json({ error: "Telephone number already exists for another courier" });
        }

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
    try {
        const couriers = await Courier.findAll({
            include: {
                model: Order,
                attributes: ['order_id'], // Select only the order_id attribute
            }
        });

        res.status(200).json(couriers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve couriers' });
    }
}

// 2. Get all Courier
const getCourierAndOrder = async (req, res) => {
    //const customer = await Customer.findByPK(id) //ID eken one nan
    const courier = await Courier.findAll({
        include: [{
            model: Courier
        }],
        where: { courier_id: '1000' }
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

    const getCurrentDateTime = () => {
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because January is 0
        const day = String(currentDate.getDate()).padStart(2, '0');

        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');

        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        console.log(formattedDateTime); // Output: 2024-04-25 14:32:30 (for example)
        res.status(200).json(formattedDateTime)

    }
}

const assignCourier = async (req, res) => {
    try {
        const order = await Order.update({
            courier_id: req.body.selectCourier,
            courier_tracking_number: req.body.courier_tracking_number ==''? null :req.body.courier_tracking_number,
            issue_date: req.body.issue_date ==''? null : req.body.issue_date,

        }, {
            where: { order_id: req.body.orderId }
        }
        );
        res.status(200).json(order);

    } catch (error) {
        console.error("Error deleting courier:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const clearCourier = async (req, res) => {
    try {
        const order = await Order.update({
            courier_id: null,
            courier_tracking_number: null,
            issue_date: null
        }, {
            where: { order_id: req.body.orderId }
        }
        );
        res.status(200).json(order);

    } catch (error) {
        console.error("Error deleting courier:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    addCourier,
    getAllCourier,
    getCourierAndOrder,
    deleteCourier,
    editCourier,
    test,
    assignCourier,
    clearCourier
}