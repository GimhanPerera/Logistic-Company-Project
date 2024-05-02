const { Customer, Order } = require('../models');



//1. Add a customer
const addCustomer = async (req, res) => {
    // let data = {
    //     customer_id: req.body.customer_id,
    //     passcode: req.body.passcode,
    //     f_name: req.body.f_name,
    //     l_name: req.body.l_name,
    //     tel_number: req.body.tel_number,
    //     address: req.body.address,
    //     nic: req.body.nic,
    //     status: req.body.status,
    //     wrong_attempts: req.body.wrong_attempts,
    //     first_attempt_date_time: req.body.first_attempt_date_time
    // }
    console.log("Hello")
    console.table(req.body)
    //const a = await generateNextPKforCustomer()
    //console.log(typeof a)
    const cus_id = await generateNextPKforCustomer()
    const customer = await Customer.create({
        "customer_id": cus_id,
        "passcode": await generatePassword(),
        "f_name": req.body.customerData.f_name,
        "l_name": req.body.customerData.l_name,
        "tel_number": req.body.customerData.tel_number,
        "address": req.body.customerData.address,
        "nic": req.body.customerData.nic,
        "status": "New",
        "wrong_attempts":0,
        "last_attempt_date_time": '2024-03-02 03:03:44'
    })

    //const customer = req.body;
    //await Customer.create(customer);
    console.log("cus_id: "+ cus_id)
    res.status(200).json({"cus_id": cus_id})
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
console.log("Checkpoint 1"+lastCustomer.customer_id)
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
    const customer = await Customer.findAll({}) //{} : pass empty obj
    res.status(200).json(customer)
}

// 2. Get all Customers
const getCustomerAndOrder = async (req, res) => {
    //const customer = await Customer.findByPK(id) //ID eken one nan
    const customer = await Customer.findAll({
        include: [{
            model: Order
        }],
        where: {customer_id: 'CFL610'}
    })
    res.status(200).json(customer)
}

const searchCustomerByID = async (req, res) => { //Search customer (Order creation part)
    try{
        console.log(req.params.customerID)
        const customer = await Customer.findByPk(req.params.customerID);
        res.status(200).json({
            "order_id": customer.customer_id,
            "name": customer.f_name+" "+customer.l_name ,
            "tel_number": customer.tel_number
        });

    }catch (error) {
        // Handle error
        console.error("Error fetching customer details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    
}

module.exports = {
    addCustomer,
    getAllCustomers,
    searchCustomerByID
}