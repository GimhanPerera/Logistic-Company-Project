const { Employee, Customer } = require('../models');
const bcrypt = require('bcrypt');
const { sendOTP, checkOTP } = require('./../middleware/opt');
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

        const existingEmployee = await Employee.findOne({
            where: {
                email: req.body.email,
                emp_id: {
                    [Op.ne]: req.user.sub
                }
            }
        });
        
        if (existingEmployee) {
            return res.status(400).json({ error: "Email already exists for another employee" });
        }
        const existingEmployee1 = await Employee.findOne({
            where: {
                nic: req.body.nic,
                emp_id: {
                    [Op.ne]: req.user.sub
                }
            }
        });
        
        if (existingEmployee1) {
            return res.status(400).json({ error: "NIC already exists for another employee" });
        }
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

const sendOtp = async (req, res) => {
    try {
        const email = req.body.email;

        if (email.startsWith("CFL")) {
            // Search by cus_id
            const customer = await Customer.findOne({
                where: { customer_id: email },
                attributes: ['customer_id']
            });

            if (!customer) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            await sendOTP(customer.customer_id);
            res.status(200).json("Sent");
        } else {
            // Search by email
            const employee = await Employee.findOne({
                where: { email },
                attributes: ['emp_id']
            });

            if (!employee) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            await sendOTP(employee.emp_id);
            res.status(200).json("Sent");
        }
    } catch (error) {
        console.error("Error :", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const checkOtp = async (req, res) => {
    try {
        let result = '';
        console.log("EMAIL: ", req.body.email)
        console.log("OTP: ", req.body.otp)
        const email = req.body.email;
        const otp = req.body.otp;
        if (!email.startsWith("CFL")) {
            const employee = await Employee.findOne({
                where: { email },
                attributes: ['emp_id']
            });

            if (!employee) {
                res.status(404).json({ error: "User not found" });
            }
            result = await checkOTP(employee.emp_id, otp);
        } else {
            result = await checkOTP(email, otp);
        }
        res.status(200).json(result);
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

        if (req.body.status == 'active') {
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
        console.log("PASSCODE: ", passcode)
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
        res.status(500).json(`Error sending SMS: ${error.message}`);
    }
}

const changePwdByOTP = async (req, res) => {
    try {
        let isCustomer = false;
        let user = '';
        // Find the Employee
        user = await Employee.findOne({
            where: {
                email: req.body.emailOrUserID
            }
        });

        if (!user) {
            isCustomer = true;
            user = await Customer.findByPk(req.body.emailOrUserID);
        }

        // Check if the user not exists
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const password = req.body.newPwd;
        const hashPassword = await bcrypt.hash(password, process.env.HASH);//convert password to hash
        if (isCustomer)
            user.passcode = hashPassword;
        else
            user.password = hashPassword;
        user.status = 'active';
        await user.save();
        console.log("User ", req.body.emailOrUserID, "New password ", password)
        res.status(200).json(true);
    } catch (error) {
        res.status(500).json(`Error : ${error}`);
    }
}

module.exports = {
    getEmployeeDataForProfile,
    setFromProfile,
    changePwd,
    sendOtp,
    checkOtp,
    getAllEmployee,
    editByID,
    textSms,
    addEmployee,
    changePwdByOTP
}