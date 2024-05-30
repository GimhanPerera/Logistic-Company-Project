require('dotenv').config()
const { Courier, Employee } = require('../models');
const jwt = require('jsonwebtoken')


const customerLogin = async (req, res) => {
try{
    //Authentication
    
    const user = {
        sub: req.body.cus_id,
        role: 'customer'
    }
    const accessToken = createToken(user, 3600) //Create the access token
    res.json({
        isValid: "True",
        accessToken: accessToken
    })
}catch (error) {
    console.error("Error in customer Login:", error);
    res.status(500).json({ error: "Internal server error" });
}

}

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
            console.log("User ",user)
            const accessToken = createToken(user, 36000); // Create the access token
            console.log("Access token: " + accessToken);
            res.json({
                isValid: true,
                accessToken: accessToken
            });
        } else {
            console.log("User not found");
            const user = {
                sub: '0',
                role: ''
            };
            const accessToken = createToken(user, 36000); // Create the access token
            console.log("Access token: " + accessToken);
            res.json({
                isValid: false,
                accessToken: accessToken
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
const authenticateToken  = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(user) //For testing
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

//create the token
function createToken(user, exp_time){
    //return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET) //Create the access token
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: exp_time}) //Create the access token with expire time
    
}



module.exports = {
    customerLogin,
    stuffLogin,
    getData,
    authenticateToken
}