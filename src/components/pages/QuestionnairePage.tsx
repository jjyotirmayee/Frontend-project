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
  onFinish?: (result: any) => void;
}

export const QuestionnairePage: React.FC<QuestionnairePageProps> = ({ questions, subject, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
    let correctCount = 0;
    let incorrectCount = 0;

    answers.forEach((ans, idx) => {
      if (ans.trim().toLowerCase() === questions[idx].correctAnswer.toLowerCase()) {
        score += 4; // correct +4
        correctCount += 1;
      } else {
        score -= 4; // wrong -4
        incorrectCount += 1;
      }
    });

    toast.success(`Test submitted! Your score: ${score} / ${questions.length * 4}`);

    if (onFinish)
      onFinish({
        score,
        correctCount,
        incorrectCount,
        totalQuestions: questions.length,
        questions,
        answers
      });
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Card className="max-w-xl mx-auto mt-10 p-6">
      <CardContent>
        <h2 className="text-xl font-bold mb-2">{subject} Test</h2>
        <p className="mb-4">
          Time Left: {minutes}:{seconds < 10 ? "0" : ""}{seconds}
        </p>
        <h3 className="mb-4">
          Question {currentIndex + 1} of {questions.length}
        </h3>
        <p className="mb-4">{questions[currentIndex].question}</p>
        <input
          type="text"
          value={answers[currentIndex]}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentIndex === 0}>
            Previous
          </Button>
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
