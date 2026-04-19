import { useState, useEffect } from "react";
import API from "../../services/index";
import Editor from "@monaco-editor/react";
import { useLocation, useNavigate } from "react-router-dom";

export default function DSA() {
  const navigate = useNavigate();
  const location = useLocation();

  const { topic, level } = location.state || {};

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [question, setQuestion] = useState([]);

  // 🔥 LOADING STATES
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [finalSubmitting, setFinalSubmitting] = useState(false);

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

  // TIMER
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

  // FETCH QUESTIONS
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/service/${topic}?level=${level}`);
        if (Array.isArray(res.data)) {
          setQuestion(res.data);
        }
        console.log(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

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

  //RUN CODE
  const runCode = async () => {
    setRunning(true);
    const code = answers[currentQuestion] || "";
    const input = question[currentQuestion]?.testCases?.[0]?.input || "";

    try {
      if (selectedLanguage === "javascript") {
        const result = eval(code);
        setOutput(String(result));
      } else {
        const { data } = await API.post("/execute/run", {
          language: selectedLanguage,
          code,
          input,
        });
        setOutput(data.output);
      }
    } catch (err) {
      setOutput("Error: " + err.message);
    } finally {
      setRunning(false);
    }
  };

  // SUBMIT CODE
  const submitCode = async () => {
    setSubmitting(true);
    try {
      const code = answers[currentQuestion];

      const { data } = await API.post("/execute/submit-question", {
        code,
        language: selectedLanguage,
        testCases: question[currentQuestion].testCases,
      });

      setResult(data);
      setOutput("");
    } catch (err) {
      setOutput("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // FINAL SUBMIT
  const handleSubmit = async () => {
    setFinalSubmitting(true);
    try {
      const { data } = await API.post("/execute/submit-test", {
        answers: answers || "No answer",
        language: selectedLanguage,
        questions: question,
      });

      navigate("/result", {
        state: { result: data, question },
      });
    } catch (err) {
      console.log(err);
    } finally {
      setFinalSubmitting(false);
    }
  };

  // FULL SCREEN LOADER
  if (loading) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-slate-900">
        <div className="w-20 h-20 border-8 border-slate-700 border-t-green-500 rounded-full animate-spin shadow-[0_0_20px_#22c55e]"></div>
        <p className="mt-6 text-green-500">Loading Questions...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden pt-24 relative">

      {/* OVERLAY LOADER */}
      {(running || submitting || finalSubmitting) && (
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center z-50">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-green-400 rounded-full animate-spin"></div>

          <p className="text-green-400 mt-4">
            {running && "Running Code..."}
            {submitting && "Checking Testcases..."}
            {finalSubmitting && "Submitting Test..."}
          </p>
        </div>
      )}

      <div className="flex flex-1 gap-4 px-4 overflow-hidden">

        {/* LEFT */}
        <div className="w-1/2 bg-slate-900 text-white shadow rounded p-4 flex flex-col overflow-hidden">

          <header className="flex justify-between mb-3">
            <h1 className="text-xl text-green-500 font-bold">DSA Test</h1>
            <div className="text-red-500 font-mono">
              {formatTime(timeLeft)}
            </div>
          </header>

         <div className="flex-1 overflow-y-auto pr-2">

                <div className="mb-3 font-semibold">
                  Question {currentQuestion + 1} of {question.length}
                </div>

                <div className="mb-4 text-gray-800">
                  <p className="text-white">{question[currentQuestion]?.question}</p>

                  {/*  EXAMPLES */}
                  <p className="mt-2 text-white">
                    <b className="text-green-500">Example 1:</b> {question[currentQuestion]?.examples?.[0]}
                  </p>

                  <p className="text-white">
                    <b className="text-green-500">Example 2:</b> {question[currentQuestion]?.examples?.[1]}
                  </p>

                  {/*  HINT */}
                  <p className="mt-2 text-white">
                    <b className="text-green-500">Hint:</b> {question[currentQuestion]?.hint}
                  </p>
                </div>

                {/* NAV */}
                <div className="flex justify-between mb-4">
                  <button
                    className="bg-gray-300 px-4 py-2 rounded text-black"
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
                  <pre className="whitespace-pre-wrap break-words text-black">
                    <b>Output:</b> {output}
                  </pre>
                </div>

                {/* TESTCASE RESULT */}
                {result && (
                  <div className="bg-slate-700 p-3 rounded">
                    <div className="font-bold mb-2">
                      Score: {result.passed} / {result.total}
                    </div>

                    {result.results.map((res, index) => (
                      <div
                        key={index}
                        className={`p-2 mb-2 rounded ${
                          res.status === "Passed"
                            ? "bg-green-300"
                            : "bg-red-400"
                        }`}
                      >
                        <div>Test {index + 1}: {res.status}</div>
                        <div className="text-sm">Input: {res.input}</div>

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
        <div className="w-1/2 bg-gray-900 p-4 flex flex-col">

          <select
            className="mb-2 p-2 bg-gray-800 text-white"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {languages.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>

          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage={selectedLanguage}
              value={answers[currentQuestion] || ""}
              onChange={(val) =>
                setAnswers({ ...answers, [currentQuestion]: val })
              }
              theme="vs-dark"
            />
          </div>

          <button
            onClick={runCode}
            disabled={running}
            className="bg-green-500 text-white p-2 mt-2"
          >
            {running ? "Running..." : "Run Code"}
          </button>

          <button
            onClick={submitCode}
            disabled={submitting}
            className="bg-blue-500 text-white p-2 mt-2"
          >
            {submitting ? "Checking..." : "Submit Code"}
          </button>

        </div>
      </div>
    </div>
  );
}