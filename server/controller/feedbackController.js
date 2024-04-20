const { Order } = require('../models');



//1. Add a feedback
const addAFeedback = async (req, res) => {
    try {
        //NEED TO VALIDATE: order id is actualy this customer's order

        const order = await Order.findOne({ where: { order_id: req.body.order_id } });
        if (!order) {
            throw new Error('Order not found');
        }

        // Update rating and feedback description
        order.rating = req.body.rating;
        order.feedback_des = req.body.feedback;
        await order.save();

        return { success: true, message: 'Order rating and feedback updated successfully' };
    } catch (error) {
        // Handle error
        console.error('Error inserting complain:', error);
        throw error; 
    }
}

module.exports = {
    addAFeedback,
}