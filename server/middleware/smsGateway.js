const twilio = require('twilio');
const dotenv = require('dotenv');
const { Order, Customer, Sms, Order_sms } = require('../models');
const { getCurrentSriLankanDateTime } = require('./dateTime');
const axios = require('axios');


const sendOTPSMS = async (tp, msg) => {
    notifySMSGateway(tp, msg); //Paid gateway
    //twilioSMSGateway(tp,msg);
    console.log("----------------------------------------------------------------------------------------------\nOPT SEND SUCCESSFULLY: ", msg)

}

//In order view section. To specific order
const sendSMSToOrder = async (req, res) => {
    try {
        console.log(req.body.msg, req.user.sub, req.body.oid);
        sendNormalSMS(req.body.oid, req.body.msg, req.user.sub);

        res.status(200).json("SEND");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
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
        if (oid != '') {
            await Order_sms.create({
                order_id: oid,
                sms_id: newId
            });
        }

        console.log(`New SMS record inserted with id ${newId}`);
    } catch (error) {
        console.error('Error inserting SMS record:', error);
    }
}

const sendNormalSMS = async (oid, msg, empID) => {
    try {
        // Get the customer_id from the Order table
        const order = await Order.findOne({
            where: { order_id: oid },
            attributes: ['customer_id']
        });
        if (!order) {
            throw new Error('Order not found ');
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

        console.log("----------------------------------------------------------------------------------------------\nMSG SEND SUCCESSFULLY: ", msg)
        //twilioSMSGateway(customer_tp,msg); //free gateway
        notifySMSGateway(customer_tp, msg); //Paid gateway
        insertSmsRecord(msg, empID, oid);

        //res.status(200).json("SEND");
    } catch (error) {
        console.error("Error:", error);
        //res.status(500).json({ error: "Internal server error" });
    }
};

const sendDirectSMS = async (to, msg, empID) => {
    try {
        console.log("----------------------------------------------------------------------------------------------\nMSG SEND SUCCESSFULLY: ", msg)
        //twilioSMSGateway(customer_tp,msg); //free gateway
        notifySMSGateway(to, msg); //Paid gateway
        insertSmsRecord(msg, empID, '');

        //res.status(200).json("SEND");
    } catch (error) {
        console.error("Error:", error);
        //res.status(500).json({ error: "Internal server error" });
    }
};

const twilioSMSGateway = (async (tp, msg) => {
    const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    return client.messages
        .create({ body: `Creative Freight Way Logistics Pvt Ltd\n\n${msg}`, from: '+18284265490', to: process.env.MY_NUMBER })    //'\nHey,\nI am Gimhan. This is a dummy message'  //'+94755850243'
        .then(message => {
            console.log(message, "Message sent");
        })
        .catch(err => console.log(err))

})


//--------------Paid gateway-------------------------------------------------------------------

const notifySMSGateway = async (to, message) => {
    try {
        console.log("PAID SMS STARTED------------------");
        //console.log(process.env.NOTIFY_USER_ID, process.env.NOTIFY_API_KEY,process.env.NOTIFY_SENDER_ID,process.env.MY_NUMBER,message)
        const response = await axios.post('https://app.notify.lk/api/v1/send', {
            "user_id": process.env.NOTIFY_USER_ID,
            "api_key": process.env.NOTIFY_API_KEY,
            "sender_id": process.env.NOTIFY_SENDER_ID,
            "to": process.env.MY_NUMBER, //`94${to}`,
            "message": `Creative Freightway Logistics Pvt Ltd\n\n${message}`,
        });
        console.log(`PAID SMS SEND------------------To: 94${to}`)

        return response.data;
    } catch (error) {
        console.log("ERROR ", error)
        return "Error";
        //throw new Error(`Error sending SMS: ${error.message}`);
    }
}


module.exports = {
    sendNormalSMS,
    sendSMSToOrder,
    sendOTPSMS,
    sendDirectSMS,
}