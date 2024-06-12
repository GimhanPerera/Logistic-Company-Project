//const Redis = require('ioredis');
//const redis = new Redis(); // Defaults to localhost:6379
const {sendOTPSMS} = require('./smsGateway');
const { Employee, Customer } = require('../models');

let opt = []
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (userID) => {
    try {
        const otp = generateOTP();
        const uid = userID;
        let tp = '';
        // Get the customer_tp from the Customer table using the customer_id
        const customer = await Customer.findOne({
            where: { customer_id : uid },
            attributes: ['tel_number']
        });
        let employee;
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
        let expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 1); // Set expiration time to 1 minute from now
        opt[userID] = { otp, expirationTime };
        console.log(otp,'----', expirationTime)
        await sendOTPSMS(tp, `This is your Number: ${otp}-A1111A`);
        console.log("OPT LIST ",opt)
        return 'OTP sent';
    } catch (error) {
        // Handle error
        console.error('Error sending OTP:', error);
        throw error; // Rethrow the error for handling in the caller function
    }
}

const checkOTP = (userID, otp) => {
    try {
        console.log("OPT LIST ",opt)
        const userData = opt[userID];

        if (!userData) {
            return false; // OTP record not found for the userID
        }

        const { otp: storedOTP, expirationTime } = userData;
        const currentTime = new Date();

        if (currentTime > expirationTime) {
            delete opt[userID]; // Remove expired OTP record
            return false; // OTP expired
        }

        if (otp === storedOTP) {
            delete opt[userID]; // Remove OTP record after successful verification
            return true; // OTP verified
        } else {
            return false; // Incorrect OTP
        }
    } catch (error) {
        console.error('Error checking OTP:', error);
        throw error;
    }
};


module.exports = {
    sendOTP,
    checkOTP,
}