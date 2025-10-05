import React, { useState } from "react";
import { useEffect } from "react";
import "./Flashcard.css"; // We'll add styles next
import Confetti from 'react-confetti'

const flashcardsData = [
  {
    question: "What is the capital of France?",
    answer: "Paris",
    explanation: "Paris is the capital and largest city of France, known for its art, fashion, and culture.",
  },
  {
    question: "What is 2 + 2?",
    answer: "4",
    explanation: "2 + 2 equals 4. It's basic arithmetic!",
  },
  {
    question: "What language is used for web styling?",
    answer: "CSS",
    explanation: "CSS (Cascading Style Sheets) is used to style HTML elements on web pages.",
  },
];

export default function Flashcard() {
  const [current, setCurrent] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showClaps, setShowClaps] = useState(false);

  // Solid color backgrounds for each flashcard
  const cardColors = [
    "#FFEBEE", // light red
    "#E3F2FD", // light blue
    "#FFFDE7", // light yellow
    "#E8F5E9", // light green
    "#F3E5F5", // light purple
    "#FBE9E7"  // light orange
  ];
  const currentColor = cardColors[current % cardColors.length];

  const handleSubmit = () => {
    const correct = userAnswer.trim().toLowerCase() === flashcardsData[current].answer.toLowerCase();
    setIsCorrect(correct);
    if (!correct) {
      setFlipped(true);
    } else {
      setShowClaps(true);
    }
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % flashcardsData.length);
    setUserAnswer("");
    setFlipped(false);
    setIsCorrect(false);
    setShowClaps(false);
  };

  // Falling claps animation
  useEffect(() => {
    let timeout: any;
    if (showClaps) {
      timeout = setTimeout(() => setShowClaps(false), 5000);
    }
    return () => clearTimeout(timeout);
  }, [showClaps]);

  return (
  <div className="flashcard-outer">
    {showClaps && <Confetti/>}
    <div className="flashcard-fan">
      <div className="fan-card fan-card-1"></div>
      <div className="fan-card fan-card-2"></div>
      <div className="fan-card fan-card-3"></div>
      <div className="fan-card fan-card-4"></div>
      <div
        style={{ background: currentColor }}
      >
        {!flipped ? (
          <div className="flashcard-box">
          <div className="flashcard-front">
            <div className="question">{flashcardsData[current].question}</div>
            <input
              className="answer-input"
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
            />
            <button className="submit-btn" onClick={handleSubmit} disabled={!userAnswer.trim()}>
              Submit
            </button>
            {isCorrect && <div className="result correct">👏 Correct!</div>}
          </div>
          </div>
        ) : (
          <div className="flashcard-box flipped" >
          <div className="flashcard-back">
            <div className="result incorrect">{"😊 Oops! Here’s the correct answer:"}</div>
            <div className="answer">{flashcardsData[current].answer}</div>
            <div className="explanation">{flashcardsData[current].explanation}</div>
            <button className="next-btn" onClick={handleNext}>
              Next
            </button>
          </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
}