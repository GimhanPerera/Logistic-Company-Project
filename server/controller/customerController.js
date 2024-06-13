const { Customer, Order, Price_quotation } = require('../models');
const { Op } = require('sequelize');
require('dotenv').config()
const bcrypt = require('bcrypt');

//1. Add a customer
const addCustomer = async (req, res) => {
    try {
        // Extract the filename
        const { filename: nicFrontImg } = req.files['nicFront'][0];
        const { filename: nicBackImg } = req.files['nicBack'][0];

        // Check if NIC already exists
        const existingCustomer = await Customer.findOne({ where: { nic: req.body.nic } });
        if (existingCustomer) {
            return res.status(400).json({ error: "NIC already exists" });
        }

        const cus_id = await generateNextPKforCustomer();
        const passcode = await generatePassword();
        const hashPassword = await bcrypt.hash(passcode, process.env.HASH);//convert password to hash
        const customer = await Customer.create({
            "customer_id": cus_id,
            "passcode": hashPassword,
            "f_name": req.body.f_name,
            "l_name": req.body.l_name,
            "tel_number": req.body.tel_number,
            "address": req.body.address,
            "nic": req.body.nic,
            "status": "active",
            "wrong_attempts": 0,
            "last_attempt_date_time": '2024-03-02 03:03:44',
            "nicFront": nicFrontImg,
            "nicBack": nicBackImg,
        })

        //const customer = req.body;
        console.log({
            "cus_id: ": cus_id,
            "passcode": passcode
        })
        //await Customer.create(customer);

        res.status(200).json({
            "cus_id": cus_id,
            "passcode": passcode
        })
    } catch (error) {
        // Handle error
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const generateNextPKforCustomer = async () => {//create new PK for customer
    try {
        // Find the last record in the Customer table
        const lastCustomer = await Customer.findOne({
            order: [['customer_id', 'DESC']]
        });

        if (!lastCustomer) {
            // If no records found, return the initial PK
            return 'CFL001'; // Assuming the initial PK starts with 1
        }

        // Extract the numeric part of the last PK and increment it
        const lastNumericPart = parseInt(lastCustomer.customer_id.substring(3));
        const nextNumericPart = lastNumericPart + 1;
        console.log("Checkpoint 1 " + lastCustomer.customer_id)
        // Format the next PK
        const nextPK = `CFL${nextNumericPart}`;

        return nextPK;
    } catch (error) {
        throw new Error('Error generating next PK');
    }
};

function generatePassword() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
    const passwordLength = 8;
    let password = '';

    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    return password;
}

// 2. Get all Customers
const getAllCustomers = async (req, res) => {
    //const customer = await Customer.findByPk(id) //ID eken one nan
    const customers = await Customer.findAll({}) //{} : pass empty obj

    // For each customer, get the order count and order IDs
    const customersWithOrderDetails = await Promise.all(customers.map(async (customer) => {
        // Retrieve orders where the status is not 'FINISH'
        const orders = await Order.findAll({
            where: { customer_id: customer.customer_id, status: { [Op.ne]: 'FINISH' } },
            attributes: ['order_id'] // Only select the order ID
        });

        // Extract order IDs
        const orderIds = orders.map(order => order.order_id);

        return {
            ...customer.dataValues, // Spread the customer's data values
            order_count: orders.length, // Add the order_count attribute
            order_ids: orderIds // Add the order_ids attribute
        };
    }));

    res.status(200).json(customersWithOrderDetails)
}

// 2. Get all Customers
const getCustomerAndOrder = async (req, res) => {
    //const customer = await Customer.findByPK(id) //ID eken one nan
    const customer = await Customer.findAll({
        include: [{
            model: Order
        }],
        where: { customer_id: 'CFL610' }
    })
    res.status(200).json(customer)
}

const searchCustomerByID = async (req, res) => { //Search customer (Order creation part)
    try {
        console.log(req.params.customerID)
        const customer = await Customer.findByPk(req.params.customerID);
        res.status(200).json({
            "order_id": customer.customer_id,
            "name": customer.f_name + " " + customer.l_name,
            "tel_number": customer.tel_number,
            "status": customer.status
        });

    } catch (error) {
        // Handle error
        console.error("Error fetching customer details:", error);
        res.status(500).json({ error: "Internal server error" });
    }

}

const searchCustomerByQuotationID = async (req, res) => { //Search customer (Order creation part)
    try {
        console.log(req.params.quotationID)
        const price_quotation = await Price_quotation.findByPk(req.params.quotationID);

        const customer = await Customer.findByPk(price_quotation.order_id.substring(0, 6));
        res.status(200).json({
            "customer_id": customer.customer_id,
            "name": customer.f_name + " " + customer.l_name,
            "tel_number": customer.tel_number
        });

    } catch (error) {
        // Handle error
        console.error("Error fetching customer details:", error);
        res.status(500).json({ error: "Internal server error" });
    }

}

const editProfile = async (req, res) => {
    try {
        // Find the Customer by ID
        const customer = await Customer.findByPk(req.body.customer_id);

        // Check if the notice exists
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        customer.f_name = req.body.f_name;
        customer.l_name = req.body.l_name;
        customer.nic = req.body.nic;
        customer.address = req.body.address;
        customer.tel_number = req.body.tel_number;
        customer.status = req.body.status;
        if(req.body.status == 'active'){
            customer.wrong_attempts = 0;
        }

        await customer.save();
        console.log("SAVED", customer)
        res.status(200).json(customer.dataValues);

    } catch (error) {
        console.error("Error :", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const changePwd = async (req, res) => {
    try {
        // Find the Employee by ID
        const customer = await Customer.findByPk(req.user.sub);

        // Check if the notice exists
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        //Check the password is correct
        const isMatch = await bcrypt.compare(req.body.oldPwd, customer.passcode);
        console.log("isMatch: ", isMatch)
        if (!isMatch) {
            res.status(401).json("Wrong password");
            return
        }
        const passcode = req.body.newPwd;
        const hashPassword = await bcrypt.hash(passcode, process.env.HASH);//convert password to hash
        customer.passcode = hashPassword;
        await customer.save();
        console.log("NEW PWD: ",passcode);
        res.status(200).json("Success");

    } catch (error) {
        console.error("Error :", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const downloadNIC = async (req, res) => {
    try {
        console.log(req.params.image);
        const image = req.params.image;
        // const imageOfItem = await Price_quotation.findOne({
        //     attributes: ['image'],
        //     where: {
        //         quotation_id: req.params.image,
        //     },
        // });
        
        if (image) {
            console.log("IMAGE ",image);
            res.download(`./images/${image}`);
        } else {
            res.status(404).json({ error: "Image not found" });
        }
        
    } catch (error) {
        console.error("Error deleting courier:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    addCustomer,
    getAllCustomers,
    searchCustomerByID,
    searchCustomerByQuotationID,
    editProfile,
    generatePassword,
    changePwd,
    downloadNIC

}