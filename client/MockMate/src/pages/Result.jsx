import { useLocation, useNavigate } from "react-router-dom";
import {motion} from 'framer-motion';
import { useInView } from "react-intersection-observer";
import { container, letter, formVariant } from "../services/Register";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const {result, question} = location.state || {}
  console.log(result, question);

  const [ref, inView] = useInView({
    threshold: 0.5,  // 20% element visible
    triggerOnce: true // animation sirf ek baar chale
  });

  const score = `Score : ${result.passed} / ${result.total}`

  // 🔹 For now, static data
  const result1 = {
    total: 4,
    passed: 3,
    results: [
      { input: "leetcode", status: "Passed" },
      { input: "loveleetcode", status: "Passed" },
      { input: "aabb", status: "Failed", expected: 0, got: -1 },
      { input: "dddccdbba", status: "Passed" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20 w-full">
      <div className="bg-white shadow rounded p-6 w-3/4">
        <h1 className="text-2xl font-bold mb-4">Test Result</h1>
       <motion.h2
                    className="text-5xl sm:text-6xl md:text-7xl fonts-style mb-4 text-center"
                    variants={container}
                    custom={1}
                    initial="hidden"
                    animate="visible"
            >
                    {score.split("").map((char, index) => (
                    <motion.span key={index} variants={letter}>
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                    ))}
        </motion.h2>

        {/* Test Cases */}
        {result.results.map((res, idx) => (
          <motion.div
            ref={ref}
            variants={container}
            custom={1}
            initial={{ opacity: 0, y: 100 }}
            transition={{ type: "keyframes", duration : 2 }}
            animate={{ opacity: 1, y: 0 }}
            key={idx}
            className={`p-3 mb-2 rounded ${
              res.status === "Passed"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <div className="font-semibold">
              Test Case {idx + 1}: {res.status === "Passed" ? "✅ Passed" : "❌ Failed"}
            </div>
            <div className="text-sm mt-1">
              <b>Input:</b> {res.input}
            </div>
            {res.status !== "Passed" && (
              <>
                <div className="text-sm">
                  <b>Expected:</b> {res.expected}
                </div>
                <div className="text-sm">
                  <b>Got:</b> {res.got}
                </div>
              </>
            )}
          </motion.div>
        ))}

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          onClick={() => navigate("/service")}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}