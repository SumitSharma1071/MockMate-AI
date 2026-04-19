
const express = require('express');
const router = express.Router();
const {isLoggedin} = require('../middlewares/logged');
const serviceController = require("../controllers/serviceController.js")

router.get("/:topic", isLoggedin, serviceController.topicService);
router.get('/other/:category', isLoggedin, serviceController.otherCategory);
module.exports = router;
