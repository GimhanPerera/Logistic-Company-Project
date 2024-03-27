const express = require("express");
const router = express.Router();
const { Customer } = require('../models');


router.get("/", async (req,res) => {
    const listOfCustomers = await Customer.findAll();
    res.json(listOfCustomers);
    console.log(listOfCustomers);
    //res.send("Hello world");
    //res.json("Hello world");//JSON walin yawanna one nan
});

router.post("/", async (req, res) => {
    const customer = req.body;
    await Customer.create(customer);
    res.json(customer);
    //post.title
})

module.exports = router;