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
    // const customer = await Customer.create(data)

    const customer = req.body;
    await Customer.create(customer);
    res.status(200),json(customer)
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

module.exports = {
    addCustomer,
    getAllCustomers
}