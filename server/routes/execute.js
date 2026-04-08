const express = require('express');
const router = express.Router();
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

// helper: unique file name
const getFileName = (ext) => `temp_${Date.now()}${ext}`;

router.post("/run", (req, res) => {
  const { language, code, input } = req.body;

  if (!language || !code) {
    return res.json({ output: "Missing data" });
  }

  // ---------------- PYTHON ----------------
  if (language === "python") {
    const fileName = getFileName(".py");
    const filePath = path.join(__dirname, fileName);

    fs.writeFileSync(filePath, code);

    exec(`echo "${input || ""}" | python3 "${filePath}"`, (err, stdout, stderr) => {
      fs.unlinkSync(filePath); // cleanup

      if (err) return res.json({ output: stderr || err.message });
      res.json({ output: stdout });
    });

  // ---------------- C++ ----------------
  } else if (language === "cpp") {
    const fileName = getFileName(".cpp");
    const exeName = fileName.replace(".cpp", "");
    const filePath = path.join(__dirname, fileName);
    const outputPath = path.join(__dirname, exeName);

    fs.writeFileSync(filePath, code);

    exec(`g++ "${filePath}" -o "${outputPath}" && echo "${input || ""}" | "${outputPath}"`,
      (err, stdout, stderr) => {
        // cleanup
        fs.unlinkSync(filePath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

        if (err) return res.json({ output: stderr || err.message });
        res.json({ output: stdout });
      });

  // ---------------- JAVA ----------------
  } else if (language === "java") {
    const filePath = path.join(__dirname, "Main.java");

    fs.writeFileSync(filePath, code);

    exec(`cd ${__dirname} && javac Main.java && echo "${input || ""}" | java Main`,
      (err, stdout, stderr) => {
        // cleanup
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        if (fs.existsSync(path.join(__dirname, "Main.class")))
          fs.unlinkSync(path.join(__dirname, "Main.class"));

        if (err) return res.json({ output: stderr || err.message });
        res.json({ output: stdout });
      });

  } else {
    res.json({ output: "Unsupported language" });
  }
});

// ---------------- SUBMIT ----------------
router.post("/submit-question", async (req, res) => {
  const { code, language, testCases } = req.body;

  if (!testCases || testCases.length === 0) {
    return res.json({ output: "No test cases found" });
  }

  let passed = 0;
  let results = [];

  for (let test of testCases) {
    try {
      const { data } = await axios.post("http://localhost:3000/api/execute/run", {
        language,
        code,
        input: test.input
      });

      const output = (data.output || "").trim();
      const expected = test.output.trim();

      if (output === expected) {
        passed++;
        results.push({ input: test.input, status: "Passed" });
      } else {
        results.push({
          input: test.input,
          status: "Failed",
          expected,
          got: output
        });
      }

    } catch (err) {
      results.push({
        input: test.input,
        status: "Error",
        error: err.message
      });
    }
  }

  res.json({
    total: testCases.length,
    passed,
    results
  });
});

router.post("/submit-test", async (req, res) => {
  const { answers, language, questions } = req.body;

  let total = 0;
  let passed = 0;
  let results = [];

  for (let i = 0; i < questions.length; i++) {
    const code = answers[i];
    const testCases = questions[i].testCases;

    let questionPassed = true;

    for (let test of testCases) {
      try {
        const { stdout } = await runCodeHelper(language, code, test.input);

        const output = stdout.trim();

        if (output !== test.output) {
          questionPassed = false;

          results.push({
            questionIndex: i,
            input: test.input,
            status: "Failed",
            expected: test.output,
            got: output
          });

        } else {
          results.push({
            questionIndex: i,
            input: test.input,
            status: "Passed"
          });
        }

      } catch (err) {
        questionPassed = false;

        results.push({
          questionIndex: i,
          input: test.input,
          status: "Error",
          error: err.message
        });
      }
    }

    total++;
    if (questionPassed) passed++;
  }

  res.json({
    total,
    passed,
    results
  });
});

module.exports = router;