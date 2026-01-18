import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Brain, Play, FileText, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Question } from './QuestionnairePage';

interface AvailableTest {
  id: string;
  subject: string;
  questions: number;
  duration: number;
}

interface TestsPageProps {
  onStartTest?: (subject: string, questions: Question[]) => void;
}

export function TestsPage({ onStartTest }: TestsPageProps) {
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [isTestStarted, setIsTestStarted] = useState(false);

  const availableTests: AvailableTest[] = [
    { id: '1', subject: 'Data Structures & Algorithms', questions: 20, duration: 30 },
    { id: '2', subject: 'Theory of Computation', questions: 20, duration: 30 },
    { id: '3', subject: 'Computer Networks', questions: 20, duration: 30 },
    { id: '4', subject: 'Computer Organization & Architecture', questions: 20, duration: 30 },
    { id: '5', subject: 'Operating Systems', questions: 20, duration: 30 },
  ];


  const subjectEndpoints: Record<string, string> = {
    'Data Structures & Algorithms': 'http://127.0.0.1:8000/api/test/dsa/',
    'Theory of Computation': 'http://127.0.0.1:8000/api/test/toc',
    'Computer Networks': 'http://127.0.0.1:8000/api/test/cn',
    'Computer Organization & Architecture': 'http://127.0.0.1:8000/api/test/coa',
    'Operating Systems': 'http://127.0.0.1:8000/api/test/os',
  };

  const startTest = async (test: AvailableTest) => {
    setSelectedTest(test.id);
    setIsTestStarted(true);
    const endpoint = subjectEndpoints[test.subject];

    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Failed to fetch questions');
      const data = await res.json();
      const questions: Question[] = Array.isArray(data)
        ? data.map((q: any) => ({
          question: q.question,
          correctAnswer: q.answer,
        }))
        : [];

      toast.success(`Starting ${test.subject} test...`);
      if (onStartTest) onStartTest(test.subject, questions);
    } catch (err) {
      toast.error('Could not load questions. Please try again.');
    }
    setIsTestStarted(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Available Tests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableTests.map((test) => (
          <Card key={test.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                {test.subject}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {test.questions} questions
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {test.duration} min
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => startTest(test)}
                disabled={isTestStarted}
              >
                <Play className="mr-2 h-4 w-4" />
                Start
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
