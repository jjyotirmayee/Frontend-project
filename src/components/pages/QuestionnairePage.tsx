import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { toast } from "sonner";

export interface Question {
  question: string;
  correctAnswer: string;
}

interface QuestionnairePageProps {
  questions: Question[];
  subject: string;
  onFinish?: (score: number) => void;
}

export const QuestionnairePage: React.FC<QuestionnairePageProps> = ({ questions, subject, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(30 * 60); // 30 minutes in seconds

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleSubmit = () => {
    let score = 0;
    answers.forEach((ans, idx) => {
      if (ans.trim().toLowerCase() === questions[idx].correctAnswer.toLowerCase()) {
        score += 1;
      }
    });
    toast.success(`Test submitted! Your score: ${score} / ${questions.length}`);
    if (onFinish) onFinish(score);
  };

  return (
    <Card className="max-w-xl mx-auto mt-10 p-6">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{subject} Test</h2>
          <div className="text-red-500 font-bold text-lg">
            Time Left: {formatTime(timeLeft)}
          </div>
        </div>

        <h3 className="mb-4">Question {currentIndex + 1} of {questions.length}</h3>
        <p className="mb-4">{questions[currentIndex].question}</p>
        <input
          type="text"
          value={answers[currentIndex]}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentIndex === 0}>Previous</Button>
          {currentIndex < questions.length - 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
