const { Employee } = require('../models');
const bcrypt = require('bcrypt');


//1. Add a complain
const addAComplain = async (req, res) => {
    try {
        //NEED TO VALIDATE: order id is actualy this customer's order
        console.log("Complain: " + req.body);
        //if(!req.body.complain) return res.status(400).json({"error": "Complain no found"});
        const complainData = {
            complain: req.body.complain,
            status: "pending",
            order_id: req.body.order_id
        };
        await Complain.create(complainData);
        const respondData = {
            order_id: req.body.order_id,
            status: "success",
        };
        res.status(200).json(respondData);
    } catch (error) {
        // Handle error
        console.error('Error inserting complain:', error);
        throw error; // Rethrow the error for handling in the caller function
    }
}

// 2. Get all Courier
const getAllCourier = async (req, res) => {
    //const customer = await Customer.findByPk(id) //ID eken one nan
    const courier = await Courier.findAll({}) //{} : pass empty obj
    res.status(200).json(courier)
}

// Get Emp Data for Profile
const getEmployeeDataForProfile = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.user.sub,{
            attributes: ['emp_id','f_name', 'l_name', 'email', 'nic', 'position', 'tel_number']
        });
        
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        // Handle error
        console.error('Error: ', error);
    }
}

const setFromProfile = async (req, res) => {
    try {
        // Find the Employee by ID
        const employee = await Employee.findByPk(req.user.sub);

        // Check if the notice exists
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        employee.f_name = req.body.f_name;
        employee.l_name = req.body.l_name;
        employee.nic = req.body.nic;
        employee.email = req.body.email;
        employee.tel_number = req.body.tel_number;

        await employee.save();
        console.log("SAVED", employee)
        res.status(200).json(employee.dataValues);

    } catch (error) {
        console.error("Error :", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const changePwd = async (req, res) => {
    try {
        // Find the Employee by ID
        const employee = await Employee.findByPk(req.user.sub);

        // Check if the notice exists
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        //Check the password is correct
        const isMatch = await bcrypt.compare(req.body.oldPwd, employee.password);
        console.log("isMatch: ",isMatch)
        if(!isMatch){
            res.status(401).json("Wrong password");
            return
        }

        employee.password = req.body.newPwd;

        await employee.save();
        res.status(200).json(employee.dataValues);

    } catch (error) {
        console.error("Error :", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const test = async (req, res) => {
    res.status(200).json("TESTING DATA")
}

module.exports = {
    getEmployeeDataForProfile,
    setFromProfile,
    changePwd
}