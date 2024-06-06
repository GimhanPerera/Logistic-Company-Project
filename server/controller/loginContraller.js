require('dotenv').config()
const { Op } = require('sequelize');

const { getCurrentSriLankanDateTime } = require('./../middleware/dateTime');

const { Courier, Employee, Customer } = require('../models');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
let refreshTokens = [];

const customerLogin = async (req, res) => {
    try {
        //Authentication
        const customer = await Customer.findOne({
            where: { customer_id: req.body.cus_id,
                status: {
                    [Op.or]: ['active', 'blocked']
                }
            }
        });

        if (!customer) {
            console.error("Wrong username or password");
            return res.status(401).json({ error: "Wrong username or password" });
        }
        
        const password = req.body.pwd;
        
        customer.last_attempt_date_time = getCurrentSriLankanDateTime(); //Set attempt date time

        //Check the password is correct
        const isMatch = await bcrypt.compare(password, customer.passcode);
        console.log("isMatch: ",isMatch)
        if(!isMatch){
            customer.wrong_attempts++;
            if(customer.wrong_attempts >= 3){
                customer.status = 'blocked';
            }
            await customer.save();
            console.error("Wrong username or password");
            return res.status(401).json({ error: "Wrong username or password" });
        }
        if (customer.status === 'blocked') {
            console.error("Your account is temporarily blocked. Please contact the company.");
            return res.status(403).json({ error: "Your account is temporarily blocked. Please contact the company." });
        }
        customer.wrong_attempts = 0;
        await customer.save();
        
        //Set the user
        const user = {
            sub: req.body.cus_id,
            role: 'customer'
        }
        const accessToken = createAccessToken(user, "30m") //Create the access token
        const refreshToken = createRefreshToken(user, "6h"); // Create the refresh token
        refreshTokens.push(refreshToken);
        //console.log("Access token: " + accessToken);
        res.json({
            isValid: true,
            role: 'customer',
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error("Error in customer Login:", error);
        res.status(500).json({ error: "Internal server error" });
    }

}

const stuffLogin = async (req, res) => {
    try {
        // Authentication
        const userFromDB = await Employee.findOne({
            where: { email: req.body.email,
                status: {
                    [Op.or]: ['active', 'blocked']
                } }
        });
        if (!userFromDB) {
            console.error("Wrong username or password");
            return res.status(401).json({ error: "Wrong username or password" });
        }

        userFromDB.last_attempt_date_time = getCurrentSriLankanDateTime(); //Set attempt date time

        const isMatch = await bcrypt.compare(req.body.password, userFromDB.password);
        console.log("isMatch: ",isMatch)

        if(!isMatch){
            userFromDB.wrong_attempts++;
            if(userFromDB.wrong_attempts >= 3){
                userFromDB.status = 'blocked';
            }
            await userFromDB.save();
            console.error("Wrong username or password");
            return res.status(401).json({ error: "Wrong username or password" });
        }
        if (userFromDB.status === 'blocked') {
            console.error("Your account is temporarily blocked. Please contact the company.");
            return res.status(403).json({ error: "Your account is temporarily blocked. Please contact the company." });
        }

        userFromDB.wrong_attempts = 0;
        await userFromDB.save();

        //if (userFromDB) {
            // If user is found
            console.log("User found - emp_id:", userFromDB.emp_id, ", f_name:", userFromDB.f_name);
            const user = {
                sub: userFromDB.emp_id,
                role: userFromDB.position
            };
            //console.log("User ", user)
            const accessToken = createAccessToken(user, "300m"); // Create the access token
            const refreshToken = createRefreshToken(user, "6h"); // Create the refresh token
            refreshTokens.push(refreshToken);
            console.log("Access token: " + accessToken);
            res.json({
                isValid: true,
                role: userFromDB.position,
                accessToken,
                refreshToken,
            });
    } catch (error) {
        console.error("Error in stuffLogin:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// Auth link
const getData = async (req, res) => {
    const courier = await Courier.findAll({})
    //req.user
    console.log(courier)
    res.status(200).json(req.user)
    //res.status(200).json(courier.courier_id)
}

//Middleware to authenticate the token
const authenticateToken = async (req, res, next) => {
    //console.log("REQ:", req)
    const authHeader = req.headers['x-auth-token']//req.headers['authorization']
    const token = authHeader//authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log("USER: ",user) //For testing
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

const refreshAccessToken = async (req, res) => {
    const refreshToken = req.headers['x-auth-token']

    if (!refreshToken) {
        res.status(401).json({
            errors: [
                {
                    msg: "Token not found",
                },
            ],
        });
    }
    if (!refreshTokens.includes(refreshToken)) {
        res.status(403).json({
            errors: [
                {
                    msg: "Invalid refresh token",
                },
            ],
        });
    }
    try {
        const user = await jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        //const {} = user;
        const accessToken = await jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
        res.json({ accessToken });
    } catch (error) {
        res.status(403).json({
            errors: [
                {
                    msg: "Invalid refresh token",
                },
            ],
        });
    }
}

const deleteToken = async (req, res) => {
    const refreshToken = req.header("x-auth-token");
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    res.sendStatus(204);
}

//create the access token
function createAccessToken(user, exp_time) {
    //return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET) //Create the access token
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: exp_time }) //Create the access token with expire time

}

//create the refresh token
function createRefreshToken(user, exp_time) {
    //return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET) //Create the access token
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: exp_time }) //Create the access token with expire time

}



module.exports = {
    customerLogin,
    stuffLogin,
    getData,
    authenticateToken
}