//const Redis = require('ioredis');
//const redis = new Redis(); // Defaults to localhost:6379
const {sendOPTSMS} = require('./smsGateway');
const { Employee, Customer } = require('../models');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOPT = async (userID) => {
    try {
        const otp = generateOTP();
        const uid = userID;
        let tp = '';
        // Get the customer_tp from the Customer table using the customer_id
        const customer = await Customer.findOne({
            where: { customer_id : uid },
            attributes: ['tel_number']
        });
        if (!customer) {
            employee = await Employee.findOne({
                where: { emp_id : uid },
                attributes: ['tel_number']
            });
        }
        if(customer){
            tp = customer.tel_number;
        }
        else if(employee){
            tp = employee.tel_number;
        }
        else{
            throw new Error('Customer not found');
        }

        const data = await redis.get(uid);
        if (data) {
            return res.status(400).json({ error: 'OTP already send' });
        }

        // Save OTP to Redis with an expiration time (5 minutes)
        //await redis.setex(oid, 300, JSON.stringify({ oid, otp }));

        //await sendOPTSMS(tp, `This is your OPT: ${otp}`);

        res.status(200).json('OTP sent');
    } catch (error) {
        // Handle error
        console.error('Error inserting complain:', error);
        throw error; // Rethrow the error for handling in the caller function
    }
}

const checkOPT = (userID) => {
};

module.exports = {
    sendOPT,
    checkOPT,
}