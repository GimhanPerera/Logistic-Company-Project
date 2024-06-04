const { Courier, Order, SpecialNotice } = require('../models');
const { Op } = require('sequelize');


//1. Add a notice
const addNotice = async (req, res) => {
    try {
        // Get the last invoice ID
        const lastNotice = await SpecialNotice.findOne({
            attributes: ['notice_id'],
            order: [['notice_id', 'DESC']]
        });

        // Determine the new invoice ID
        const newPaymentId = lastNotice ? parseInt(lastNotice.notice_id, 10) + 1 : 10000;


        const notice = await SpecialNotice.create({
            notice_id: newPaymentId,
            title: req.body.title,
            description: req.body.description,
            expire_date: req.body.expireDate,
            emp_id: req.user.sub
        });

        res.status(200).json(notice);
    } catch (error) {
        // Handle error
        console.error("Error fetching customer details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

//get all notices
const getAllNotices = async (req, res) => {
    try {
        const today = new Date(); // Get the current date
        const notices = await SpecialNotice.findAll({});
console.log(today)
        // Add isLive attribute based on expire_date
        const noticesWithIsLive = notices.map(notice => {
            const isLive = new Date(notice.expire_date) > today;
            return {
                ...notice.toJSON(), // Convert Sequelize instance to plain object
                isLive
            };
        });

        res.status(200).json(noticesWithIsLive);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

//get all public notices
const getAllPublicNotices = async (req, res) => {
    try {
        const today = new Date(); // Get the current date
        const notices = await SpecialNotice.findAll({
            where: {
                expire_date: {
                    [Op.gt]: today // Filter notices where expire_date is greater than today
                }
            },
            attributes: ['notice_id', 'title', 'description']
        });
        res.status(200).json(notices);
    } catch (error) {
        console.error("Error :", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const editNotice = async (req, res) => {
    try {
        console.log('title ',req.body.title);
        console.log('description ',req.body.description);
        console.log('expire_date ',req.body.expire_date);
        //return
        // Find the notice by ID
        const notice = await SpecialNotice.findByPk(req.body.notice_id);

        // Check if the notice exists
        if (!notice) {
            return res.status(404).json({ error: "Notice not found" });
        }

        notice.title = req.body.title;
        notice.description = req.body.description;
        notice.expire_date = req.body.expire_date;
        notice.emp_id = req.user.sub

        await notice.save();
        console.log('DONE');
        res.status(200).json(notice);
    } catch (error) {
        console.error("Error :", error);
        res.status(500).json({ error: "Internal server error" });
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

const deleteNotice = async (req, res) => {
    try {
        const a = await SpecialNotice.destroy({
            where: {
                notice_id: req.params.id,
            },
        });
        console.log(a);
        res.status(200).json("Courier number " + req.params.id + " deleted");
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
            courier_id: req.body.selectCourier
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
            courier_id: null
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
    getAllNotices,
    getAllPublicNotices,
    deleteNotice,
    editNotice,
    addNotice
}