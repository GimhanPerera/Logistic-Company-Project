const { Employee } = require('../models');
const bcrypt = require('bcrypt');
const { sendOPT, checkOPT } = require('./../middleware/opt');
const { Op } = require('sequelize');
const axios = require('axios');
const { generatePassword } = require('./customerController')
require('dotenv').config()
const { sendDirectSMS } = require('../middleware/smsGateway');

//Get all Employee
const getAllEmployee = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            attributes: {
                exclude: ['password', 'wrong_attempts']
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

        const password = req.body.newPwd;
        const hashPassword = await bcrypt.hash(password, process.env.HASH);//convert password to hash
        employee.password = hashPassword;

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
        employee.email = req.body.email;
        employee.position = req.body.position;
        employee.tel_number = req.body.tel_number;
        employee.status = req.body.status;
        
        if(req.body.status == 'active'){
            employee.wrong_attempts = 0;
        }

        await employee.save();

        res.status(200).json(employee.dataValues);

    } catch (error) {
        console.error("Error :", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const addEmployee = async (req, res) => {
    try {
        // Retrieve the last inserted primary key
        const lastEmployee = await Employee.findOne({
            order: [['emp_id', 'DESC']]
        });

        // Generate the new primary key
        let newEmpId = 'EMP02';
        if (lastEmployee) {
            const lastEmpId = lastEmployee.emp_id;
            const empNumber = parseInt(lastEmpId.substring(3));
            newEmpId = `EMP${(empNumber + 1).toString().padStart(2, '0')}`;
        }

        const passcode = await generatePassword();
        const hashPassword = await bcrypt.hash(passcode, process.env.HASH);//convert password to hash

        // Create a new employee
        const newEmployee = await Employee.create({
            emp_id: newEmpId,
            f_name: req.body.f_name,
            l_name: req.body.l_name,
            nic: req.body.nic,
            email: req.body.email,
            password: hashPassword, // Ensure password is hashed before saving
            tel_number: req.body.tel_number,
            status: req.body.status,
            position: req.body.position,
            last_attempt_date_time: new Date(), // Set initial date/time
            wrong_attempts: 0 // Initialize wrong attempts
        });
        console.log("PASSCODE: ",passcode)
        const message = `Hello ${req.body.f_name},\nWelcome to the company. Use following credentials to log to the system.\nemail: ${req.body.email}\nTemporary pwd: ${passcode}`
        sendDirectSMS(req.body.tel_number, message, req.user.sub);//send sms

        res.status(201).json(newEmployee);
    } catch (error) {
        console.error("Error in addEmployee:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

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
    textSms,
    addEmployee
}