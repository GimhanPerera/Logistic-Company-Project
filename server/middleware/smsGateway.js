const twilio = require('twilio');
const dotenv = require('dotenv');
const { Order,Customer } = require('../models');
const sendTestSMS = async (req, res) => {
    try {
        sendSMS();

        res.status(200).json("SEND");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const testRUNS = async () => {
    try {
        console.log("TEST IS SUCCESS");

        //res.status(200).json("SEND");
    } catch (error) {
        console.error("Error:", error);
        //res.status(500).json({ error: "Internal server error" });
    }
};

const sendNormalSMS = async (oid, msg) => {
    try {
        // Get the customer_id from the Order table
        const order = await Order.findOne({
            where: { order_id : oid },
            attributes: ['customer_id']
        });
        if (!order) {
            throw new Error('Order not found');
        }
        const customer_id = order.customer_id;

        // Get the customer_tp from the Customer table using the customer_id
        const customer = await Customer.findOne({
            where: { customer_id },
            attributes: ['tel_number']
        });
        if (!customer) {
            throw new Error('Customer not found');
        }
        const customer_tp = customer.tel_number;

        console.log("----------------------------------------------------------------------------------------------\nMSG SEND SUCCESSFULLY: ",msg)
        //sendSMS(customer_tp,msg);

        //res.status(200).json("SEND");
    } catch (error) {
        console.error("Error:", error);
        //res.status(500).json({ error: "Internal server error" });
    }
};

const sendSMS = ( async (tp, msg)=>{
    const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    return client.messages
    .create({body: `Creative Freight Way Logistics Pvt Ltd\n\n${msg}`, from:'+18284265490', to: process.env.MY_NUMBER})    //'\nHey,\nI am Gimhan. This is a dummy message'  //'+94755850243'
    .then(message => {
        console.log(message, "Message sent")
    })
    .catch(err => console.log(err))

})

module.exports = {
    sendTestSMS,
    testRUNS,
    sendNormalSMS
}