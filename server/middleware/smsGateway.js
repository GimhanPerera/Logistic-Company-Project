const twilio = require('twilio');
const dotenv = require('dotenv');
const { Order,Customer, Sms, Order_sms } = require('../models');
const { getCurrentSriLankanDateTime} = require('./dateTime');

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

const insertSmsRecord = async (massage, emp_id, oid) => {
    try {
        // Check if the table is empty
        const count = await Sms.count();
        
        let newId;
        if (count === 0) {
            newId = 100000;
        } else {
            // Get the maximum sms_id
            const maxId = await Sms.max('sms_id');
            newId = maxId + 1;
        }

        const dateTime = await getCurrentSriLankanDateTime();
        
        // Insert the new record
        await Sms.create({
            sms_id: newId,
            massage: massage,
            Date_time: dateTime,
            emp_id: emp_id ? emp_id : 'EMP02'
        });
        await Order_sms.create({
            order_id: oid,
            sms_id: newId
        });

        console.log(`New SMS record inserted with id ${newId}`);
    } catch (error) {
        console.error('Error inserting SMS record:', error);
    }
}

const sendNormalSMS = async (oid, msg, empID) => {
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
        insertSmsRecord(msg, empID, oid);

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
        console.log(message, "Message sent");
    })
    .catch(err => console.log(err))

})

module.exports = {
    sendTestSMS,
    testRUNS,
    sendNormalSMS
}