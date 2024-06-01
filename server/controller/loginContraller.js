require('dotenv').config()
const { Courier, Employee } = require('../models');
const jwt = require('jsonwebtoken')


const customerLogin = async (req, res) => {
    try {
        //Authentication

        const user = {
            sub: req.body.cus_id,
            role: 'customer'
        }
        const accessToken = createAccessToken(user, "30m") //Create the access token
        const refreshToken = createRefreshToken(user, "6h"); // Create the refresh token
        refreshTokens.push(refreshToken);
        console.log("Access token: " + accessToken);
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

let refreshTokens = [];
const stuffLogin = async (req, res) => {
    try {
        // Authentication
        const userFromDB = await Employee.findOne({
            attributes: ['emp_id', 'f_name', 'position'],
            where: { email: req.body.email, password: req.body.password }
        });

        if (userFromDB) {
            // If user is found
            console.log("User found - emp_id:", userFromDB.emp_id, ", f_name:", userFromDB.f_name);
            const user = {
                sub: userFromDB.emp_id,
                role: userFromDB.position
            };
            console.log("User ", user)
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
        } else {
            console.log("User not found");
            const user = {
                sub: '0',
                role: ''
            };
            const accessToken = createAccessToken(user, "1m"); // Create the access token
            const refreshToken = createRefreshToken(user, "6h"); // Create the access token
            console.log("Access token: " + accessToken);
            res.json({
                isValid: false,
            });
        }
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
    console.log("REQ:", req)
    const authHeader = req.headers['x-auth-token']//req.headers['authorization']
    const token = authHeader//authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(user) //For testing
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