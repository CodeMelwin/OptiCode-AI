const express = require('express');

const { getResponse, codeReview } = require('../controllers/ai.controllers.js')

const router = express.Router();

// General AI response endpoint
router.get("/get-response", getResponse);

// Code review endpoint (POST for sending code in body, GET for query param)
router.post("/review-code", codeReview);
router.get("/review-code", codeReview);

module.exports = router;
module.exports = router;