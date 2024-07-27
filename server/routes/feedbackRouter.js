const express = require("express");
const router = express.Router();
const feedbackContraller = require('../controller/feedbackController') //import controller
const loginController = require('../controller/loginContraller') //import controller


router.post("/", feedbackContraller.addAFeedback) //add feedback


module.exports = router;