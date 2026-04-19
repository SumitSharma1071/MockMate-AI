const express = require('express');
const router = express.Router();
const executeController = require('../controllers/dsaTest.js');

const getFileName = (ext) => `temp_${Date.now()}${ext}`;

router.post("/run", executeController.run);
router.post("/submit-question", executeController.submitQuestion);
router.post("/submit-test", executeController.submitTest);

module.exports = router;