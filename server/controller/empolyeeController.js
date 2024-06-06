const { Employee } = require('../models');
const bcrypt = require('bcrypt');
const { sendOPT, checkOPT } = require('./../middleware/opt');
const { Op } = require('sequelize');
const axios = require('axios');

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

//Get all Employee
const getAllEmployee = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            attributes: {
                exclude: ['password', 'wrong_attempts', 'last_attempt_date_time']
            },
            where: {
                position: {
                    [Op.ne]: 'ADMIN'
                }
            }
        });
        res.status(200).json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ error: "An error occurred while fetching employees" });
    }
}

// Get Emp Data for Profile
const getEmployeeDataForProfile = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.user.sub, {
            attributes: ['emp_id', 'f_name', 'l_name', 'email', 'nic', 'position', 'tel_number']
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
        console.log("isMatch: ", isMatch)
        if (!isMatch) {
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

const sendOpt = async (req, res) => {
    try {
        sendOPT(req.user.sub);
        res.status(200).json("Sent");
    } catch (error) {
        console.error("Error :", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const editByID = async (req, res) => {
    try {
        // Find the Customer by ID
        const employee = await Employee.findByPk(req.body.emp_id);

        // Check if the notice exists
        if (!employee) {
            console.log("ID not found: ", req.body.emp_id)
            return res.status(404).json({ error: "Employee not found" });
        }

        employee.f_name = req.body.f_name;
        employee.l_name = req.body.l_name;
        employee.nic = req.body.nic;
        employee.position = req.body.position;
        employee.tel_number = req.body.tel_number;
        employee.status = req.body.status;

        await employee.save();

        res.status(200).json(employee.dataValues);

    } catch (error) {
        console.error("Error :", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const textSms = async (req, res) => {
    try {
        const response = await axios.post('https://app.notify.lk/api/v1/send', {
            "user_id": '27270',
            "api_key": 'sFMdHDUeJUD9ZKcuEj4Y',
            "sender_id": 'NotifyDEMO',
            "to": '94778652698',
            "message": 'Hello this is the first test message',
        });

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json( `Error sending SMS: ${error.message}` );
    }
}

module.exports = {
    getEmployeeDataForProfile,
    setFromProfile,
    changePwd,
    sendOpt,
    getAllEmployee,
    editByID,
    textSms
}