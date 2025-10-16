import React, { useState, useEffect } from "react";
import "./Flashcard.css";
import Confetti from "react-confetti";

export default function Flashcard() {
  const [flashcardsData, setFlashcardsData] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showClaps, setShowClaps] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch data from your Django backend API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/exam/") // ✅ Update if your endpoint differs
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setFlashcardsData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  const cardColors = [
    "#FFEBEE", "#E3F2FD", "#FFFDE7", "#E8F5E9", "#F3E5F5", "#FBE9E7"
  ];
  const currentColor = cardColors[current % cardColors.length];

  // ✅ Handle submit
  const handleSubmit = () => {
    const correct =
      userAnswer.trim().toLowerCase() ===
      flashcardsData[current].answer.toLowerCase();
    setIsCorrect(correct);
    if (!correct) {
      setFlipped(true);
    } else {
      setShowClaps(true);
    }
  };

  // ✅ Handle next question
  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % flashcardsData.length);
    setUserAnswer("");
    setFlipped(false);
    setIsCorrect(false);
    setShowClaps(false);
  };

  // ✅ Auto-hide confetti
  useEffect(() => {
    let timeout: any;
    if (showClaps) {
      timeout = setTimeout(() => setShowClaps(false), 5000);
    }
    return () => clearTimeout(timeout);
  }, [showClaps]);

  // ✅ Loading & Empty states
  if (loading) {
    return <div className="loading">Loading questions...</div>;
  }

  if (flashcardsData.length === 0) {
    return <div className="empty">No flashcards found in database.</div>;
  }

  return (
    <div className="flashcard-outer">
      {showClaps && <Confetti />}
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
                <div className="question">{flashcardsData[current].subject}</div>
                <div className="question">{flashcardsData[current].question}</div>
                <input
                  className="answer-input"
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                />
                <div className="buttons">

                  <button className="submit-btn" onClick={handleSubmit} disabled={!userAnswer.trim()}>
                    Submit
                  </button>
                  <button className="submit-btn" onClick={handleNext}>
                    Next
                  </button>
                </div>
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