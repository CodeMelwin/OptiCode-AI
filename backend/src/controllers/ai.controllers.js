const { generateContent, reviewCode } = require('../services/ai.service.js');

const getResponse = async (req, res) => {
    try {
        const prompt = req.query.prompt;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const response = await generateContent(prompt);
        res.json({ response });
    } catch (error) {
        console.error("AI Service Error:", error.message);
        res.status(500).json({ error: error.message });
    }
}

const codeReview = async (req, res) => {
    try {
        const code = req.body.code || req.query.code;

        if (!code) {
            return res.status(400).json({ error: "Code is required" });
        }

        const review = await reviewCode(code);
        res.json({ 
            originalCode: code,
            review: review 
        });
    } catch (error) {
        console.error("Code Review Error:", error.message);
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getResponse, codeReview };