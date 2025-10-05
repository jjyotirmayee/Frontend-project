import React, { useState } from "react";
import { useEffect } from "react";
import "./Flashcard.css"; // We'll add styles next

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
  // Alternate flip direction: even = clockwise, odd = anticlockwise
  const flipDirection = current % 2 === 0 ? 'clockwise' : 'anticlockwise';

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
      timeout = setTimeout(() => setShowClaps(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [showClaps]);

  return (
    <div className="flashcard-outer">
      {showClaps && (
        <div className="clap-overlay">
          {[...Array(40)].map((_, i) => {
            // Random horizontal position and animation delay
            const left = Math.random() * 100;
            const delay = Math.random() * 1.2;
            const duration = 1.2 + Math.random() * 0.8;
            return (
              <span
                key={i}
                className="clap-emoji"
                style={{
                  left: `${left}vw`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              >👏</span>
            );
          })}
        </div>
      )}
      <div
        className={`flashcard-box ${flipped ? `flipped flipped-${flipDirection}` : ""}`}
        style={{ background: currentColor }}
      >
        {!flipped ? (
          <div className="flashcard-front">
            <div className="question">{flashcardsData[current].question}</div>
            <input
              className="answer-input"
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
            />
            <button className="submit-btn" onClick={handleSubmit}>
              Submit
            </button>
            {isCorrect && <div className="result correct">👏 Correct!</div>}
          </div>
        ) : (
          <div className="flashcard-back">
            <div className="result incorrect">😊 Oops! Here’s the correct answer:</div>
            <div className="answer">{flashcardsData[current].answer}</div>
            <div className="explanation">{flashcardsData[current].explanation}</div>
            <button className="next-btn" onClick={handleNext}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}