const {GoogleGenAI} = require('@google/genai');
const express = require('express');
const router = express.Router();
const {isLoggedin} = require('../middlewares/logged');

const ai = new GoogleGenAI({ apiKey : process.env.GEMINI_API_KEY});


router.get("/:topic", isLoggedin, async (req, res) => {

  let topic = req.params.topic;
  let level = req.query.level;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 5 ${level} level DSA coding questions on ${topic} array.

                Each question must include:
                - question
                - examples
                - answer
                - hint
                - testCases (IMPORTANT)

                Format:
                [
                {
                "question": "...",
                "examples": ["..."],
                "answer": "...",
                "testCases": [
                    { "input": "2 \n 3", "output": "5" },
                    { "input": "4 \n 6", "output": "10" }
                ]
                }
                ]`
            });

    const clean = response.text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/other/:category', isLoggedin, async(req, res) =>{
    let category = req.params.category;
    let topic = req.query.topic;
    let level = req.query.level;

    if(!topic && !level){
      res.status(500).json({message : "Topic and level are required"});
    }

    try{
      const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 20 multiple-choice question (MCQ) based on the following:

              - Category: ${category}
              - Topic: ${topic}
              - Difficulty: ${level}

              Requirements:
              1. Provide **one clear question**.
              2. Provide **four options** labeled A, B, C, D.
              3. Specify the **correct answer** (A/B/C/D).
              4. Provide a **brief explanation** for why the answer is correct.
              5. Format your output strictly in JSON like this:

            [  
              {
                "question": "<Question text here>",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctAnswer": "<A/B/C/D>",
                "explanation": "<Short explanation here>"
              }
            ] 
              Do not add any extra text outside the JSON.`
            });

    const clean = response.text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
