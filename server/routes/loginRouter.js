const express = require("express");
const router = express.Router();
const loginContraller = require('../controller/loginContraller') //import contraller

//Auth link
router.get("/", loginContraller.authenticateToken, loginContraller.getData)

//Staff login - create token
router.post("/staff", loginContraller.stuffLogin)

//Customer login - create token
router.post("/customer", loginContraller.customerLogin)
module.exports = router;