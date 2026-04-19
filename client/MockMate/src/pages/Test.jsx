import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {motion} from 'framer-motion';
import { useInView } from "react-intersection-observer";
import { container, letter, formVariant } from "../services/Register";

export default function TestPage() {

    const [ref, inView] = useInView({
    threshold: 0.5,  
    triggerOnce: true
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { category, topic, level, questions } = location.state || {};

  const [userAnswers, setUserAnswers] = useState(
    questions?.map(() => "") || []
  );
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const q = questions[currentIndex];

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl">No questions found for this selection.</h2>
      </div>
    );
  }

  const handleOptionChange = (qIndex, value) => {
    const newAnswers = [...userAnswers];
    newAnswers[qIndex] = value;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let tempScore = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) tempScore += 1;
    });
    setScore(tempScore);
    setShowResult(true);
  };

 return (
  <div className="min-h-screen bg-gray-50 p-6 pt-24">
    <h1 className="text-3xl font-bold mb-6 text-center">
      {category} Test
    </h1>

    <h2 className="text-xl mb-4 text-center">
      Topic: {topic} | Level: {level}
    </h2>

    {/* QUESTION SCREEN */}
    {!showResult && q && (
      <div className="space-y-6">

        <p className="text-center">
          Question {currentIndex + 1} of {questions.length}
        </p>

        <div className="bg-white p-4 rounded shadow">
          <p className="font-semibold mb-2">
            {currentIndex + 1}. {q.question}
          </p>

          {q.options?.map((opt, idx) => (
            <label key={idx} className="block mb-1 cursor-pointer">
              <input
                type="radio"
                name="question"
                value={["A","B","C","D"][idx]}
                checked={
                  userAnswers[currentIndex] === ["A","B","C","D"][idx]
                }
                onChange={(e) =>
                  handleOptionChange(currentIndex, e.target.value)
                }
                className="mr-2 "
              />
              {opt}
            </label>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentIndex(prev => prev - 1)}
            disabled={currentIndex === 0}
            className="bg-gray-400 text-slate-950 px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
          >
            Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    )}

    {/* RESULT SCREEN */}
    {showResult && (
      <div className="mt-6 space-y-6">
        <h2 className="text-2xl font-bold text-center">
          Your Score: {score} / {questions.length}
        </h2>

        {questions.map((q, i) => (
          <div key={i} className="bg-white p-4 rounded shadow">
            <p className="font-semibold mb-2">
              {i + 1}. {q.question}
            </p>

            <p>
              <span className="font-semibold">Your Answer:</span>{" "}
              <span
                className={
                  userAnswers[i] === q.correctAnswer
                    ? "text-green-600 font-bold"
                    : "text-red-600 font-bold"
                }
              >
                {userAnswers[i] || "Not Answered"}
              </span>
            </p>

            <p>
              <span className="font-semibold">Correct Answer:</span>{" "}
              <span className="text-green-600 font-bold">
                {q.correctAnswer}
              </span>
            </p>

            <p>
              <span className="font-semibold">Explanation:</span>{" "}
              {q.explanation}
            </p>
          </div>
        ))}

        <div className="text-center mt-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-green-500 text-white px-6 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    )}
  </div>
);
}