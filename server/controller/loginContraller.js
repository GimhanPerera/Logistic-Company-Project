require('dotenv').config()
const { Courier } = require('../models');
const jwt = require('jsonwebtoken')


const customerLogin = async (req, res) => {

    //Authentication
    
    const user = {
        sub: req.body.cus_id,
        role: 'customer'
    }
    const accessToken = createToken(user, 600) //Create the access token
    res.json({
        isValid: "True",
        accessToken: accessToken
    })
}

const stuffLogin = async (req, res) => {

    //Authentication

    const username = req.body.username;
    const user = {
        name: username,
        role: 'staff'
    }
    const accessToken = createToken(user, 120) //Create the access token
    console.log("Access token: "+accessToken)
    res.json({accessToken: accessToken})
}

// Auth link
const getData = async (req, res) => {
    const courier = await Courier.findAll({})
    //req.user
    console.log(courier)
    res.status(200).json(req.user)
    //res.status(200).json(courier.courier_id)
}

//Meddleware to authenticate the token
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