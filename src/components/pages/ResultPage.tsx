import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

interface ResultPageProps {
  result: {
    subject: string;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    detailedExplanation: { question: string; correctAnswer: string; yourAnswer: string }[];
  };
  onBack: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ result, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{result.subject} - Test Result</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total Questions: {result.totalQuestions}</p>
          <p>Correct Answers: {result.correctAnswers}</p>
          <p>Incorrect Answers: {result.incorrectAnswers}</p>
          <p className="font-bold mt-2">Detailed Explanation:</p>
          <ul className="list-disc ml-5 mt-2">
            {result.detailedExplanation.map((item, idx) => (
              <li key={idx} className="mb-1">
                <strong>Q:</strong> {item.question} <br />
                <strong>Your Answer:</strong> {item.yourAnswer} <br />
                <strong>Correct Answer:</strong> {item.correctAnswer}
              </li>
            ))}
          </ul>
          <Button className="mt-4" onClick={onBack}>
            Back to Tests
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
