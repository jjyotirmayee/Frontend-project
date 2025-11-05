import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

interface ResultPageProps {
  result: {
    score: number;
    correctCount: number;
    incorrectCount: number;
    totalQuestions: number;
    questions: { question: string; correctAnswer: string }[];
    answers: string[];
  };
  onBack?: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ result, onBack }) => {
  if (!result) return null;

  const { score, correctCount, incorrectCount, totalQuestions, questions, answers } = result;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium">Total Score: {score} / {totalQuestions * 4}</p>
          <p>Correct Answers: {correctCount}</p>
          <p>Incorrect Answers: {incorrectCount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Explanation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((q, idx) => (
            <div key={idx} className="p-4 border rounded-lg">
              <p className="font-medium">Q{idx + 1}: {q.question}</p>
              <p>Your Answer: {answers[idx] || "Not Answered"}</p>
              <p>Correct Answer: {q.correctAnswer}</p>
              <p>
                {answers[idx]?.trim().toLowerCase() === q.correctAnswer.toLowerCase() 
                  ? <span className="text-green-600 font-semibold">Correct (+4)</span>
                  : <span className="text-red-600 font-semibold">Wrong (-4)</span>}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {onBack && (
        <div className="text-center">
          <Button onClick={onBack}>Back to Tests</Button>
        </div>
      )}
    </div>
  );
};
