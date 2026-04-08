import { useState, useEffect } from "react";
import API from "../../services/index";
import Editor from "@monaco-editor/react";
import {useLocation ,useNavigate } from "react-router-dom";

export default function DSA() {
  const navigate = useNavigate();
  const location = useLocation();

  const {topic, level} = location.state || {};

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [question, setQuestion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [result, setResult] = useState(null);

  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem("dsaTimer");
    return saved ? Number(saved) : 30 * 60;
  });

  const languages = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "C/C++", value: "cpp" },
    { label: "Java", value: "java" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");

  // ✅ TIMER FIX
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev > 0 ? prev - 1 : 0;
        localStorage.setItem("dsaTimer", newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ✅ FETCH QUESTIONS
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/service/${topic}?level=${level}`);
        if (!Array.isArray(res.data)) return;
        setQuestion(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // ✅ Output reset when question changes
  useEffect(() => {
    setOutput("");
  }, [currentQuestion]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  // ✅ RUN CODE
  const runCode = async () => {
  const code = answers[currentQuestion] || "";

  // 🔥 TEST INPUT (temporary)
  const input = question[currentQuestion]?.testCases?.[0]?.input || "";

  if (selectedLanguage === "javascript") {
    try {
      const result = eval(code);
      setOutput(String(result));
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  } else {
    try {
      const { data } = await API.post("/execute/run", {
        language: selectedLanguage,
        code,
        input   // ✅ INPUT bhejna zaroori hai
      });

      setOutput(data.output);
    } catch (err) {
      setOutput("Error: " + (err.response?.data?.output || err.message));
    }
  }
};
  const submitCode = async () => {
  try {
    const code = answers[currentQuestion];

    const { data } = await API.post("/execute/submit-question", {
      code,
      language: selectedLanguage,
      testCases: question[currentQuestion].testCases
    });

    setResult(data);   // ✅ store full result
    setOutput("");     // optional (clear old output)

  } catch (err) {
    setOutput("Error: " + err.message);
  }
};

const handleSubmit = async () => {
  try {
    const { data } = await API.post("/execute/submit-test", {
      answers : answers || "No answer is Here",      
      language: selectedLanguage,
      questions : question,
    });
    console.log(question);
    navigate("/result", {
      state: {
        result: data,
        question,
      }
    });

  } catch (err) {
    console.log(err);
  }
};

  if (loading) return <div>Loading Questions...</div>;

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden pt-24">

      <div className="flex flex-1 gap-4 px-4 overflow-hidden">

        {/* LEFT */}
        <div className="w-1/2 bg-white shadow rounded p-4 flex flex-col overflow-hidden">

            {/* Header (fixed) */}
            <header className="flex justify-between items-center mb-3">
              <h1 className="text-xl font-bold">DSA Test</h1>
              <div className="text-red-500 font-mono">
                {formatTime(timeLeft)}
              </div>
            </header>

            {/* 🔥 IMPORTANT WRAPPER */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-2">

              <div className="mb-3 font-semibold">
                Question {currentQuestion + 1} of {question.length}
              </div>

              <div className="mb-4 text-gray-800">
                <p>{question[currentQuestion]?.question}</p>

                <p className="mt-2">
                  <b>Example 1:</b> {question[currentQuestion]?.examples?.[0]}
                </p>

                <p>
                  <b>Example 2:</b> {question[currentQuestion]?.examples?.[1]}
                </p>

                <p className="mt-2">
                  <b>Hint:</b> {question[currentQuestion]?.answer}
                </p>
              </div>

              {/* NAV */}
              <div className="flex justify-between mb-4">
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  disabled={currentQuestion === 0}
                  onClick={() => setCurrentQuestion((prev) => prev - 1)}
                >
                  Previous
                </button>

                {currentQuestion < question.length - 1 ? (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => setCurrentQuestion((prev) => prev + 1)}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                )}
              </div>

              {/* OUTPUT */}
             <div className="bg-gray-100 p-2 rounded mb-4 overflow-auto max-h-40">
                <pre className="whitespace-pre-wrap break-words">
                  <b>Output:</b> {output}
                </pre>
              </div>

              {/* TESTCASE */}
              {result && (
                <div className="bg-gray-200 p-3 rounded">

                  <div className="font-bold mb-2">
                    Score: {result.passed} / {result.total}
                  </div>

                  {result.results.map((res, index) => (
                    <div
                      key={index}
                      className={`p-2 mb-2 rounded ${
                        res.status === "Passed"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      <div>
                        Test {index + 1}: {res.status}
                      </div>

                      <div className="text-sm">
                        Input: {res.input}
                      </div>

                      {res.status !== "Passed" && (
                        <>
                          <div className="text-sm">Expected: {res.expected}</div>
                          <div className="text-sm">Got: {res.got}</div>
                        </>
                      )}
                    </div>
                  ))}

                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                    onClick={() => setResult(null)}
                  >
                    Close
                  </button>
                </div>
              )}

            </div>
          </div>
        {/* RIGHT */}
       <div className="w-1/2 bg-gray-900 rounded-xl p-4 flex flex-col">

              {/* Header */}
              <div className="mb-2 flex justify-between items-center">
                <h1 className="text-white text-xl">Code Here</h1>

                <select
                  className="bg-gray-800 text-white p-2 rounded"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 🔥 IMPORTANT: Editor wrapper */}
              <div className="flex-1 min-h-0">
                <Editor
                  key={selectedLanguage}
                  height="100%"
                  defaultLanguage={selectedLanguage}
                  value={answers[currentQuestion] || ""}
                  onChange={(value) =>
                    setAnswers({ ...answers, [currentQuestion]: value })
                  }
                  theme="vs-dark"
                />
              </div>

              {/* Buttons */}
              <button
                onClick={runCode}
                className="bg-green-500 text-white px-4 py-2 rounded mt-2"
              >
                Run Code
              </button>

              <button
                onClick={submitCode}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Submit Code
              </button>

            </div>
        </div>
    </div>
  );
}