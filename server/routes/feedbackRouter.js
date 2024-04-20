const express = require("express");
const router = express.Router();
const feedbackContraller = require('../controller/feedbackController') //import contraller
const loginController = require('../controller/loginContraller') //import contraller


router.post("/", feedbackContraller.addAFeedback)


module.exports = router;