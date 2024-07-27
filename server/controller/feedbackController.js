const { Order } = require('../models');



// Add a feedback
const addAFeedback = async (req, res) => {
    try {
        //NEED TO VALIDATE: order id is actualy this customer's order
console.log("feedOrder ID: "+req.body.order_id)
        const order = await Order.findOne({ where: { order_id: req.body.order_id } });
        if (!order) {
            throw new Error('Order not found');
        }

        // Update rating and feedback description
        order.rating = req.body.rating;
        order.feedback_des = req.body.feedback;
        await order.save();
        res.status(200).json("Order rating and feedback submitted");
    } catch (error) {
        // Handle error
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    addAFeedback,
}