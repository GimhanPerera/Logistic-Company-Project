const express = require("express");
const router = express.Router();
const { Courier } = require('../models');


router.get("/", async (req,res) => {
    const listOfCouriers = await Courier.findAll();
    res.json(listOfCouriers);
    console.log(listOfCouriers);
    console.log(listOfCouriers);
});

router.post("/", async (req, res) => {
    const courier = req.body;
    await Courier.create(courier);
    res.json(courier);
})

module.exports = router;