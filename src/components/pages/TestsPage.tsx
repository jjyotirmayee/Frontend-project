// import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { Button } from '../ui/button';
// import { Badge } from '../ui/badge';
// import { Progress } from '../ui/progress';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
// import { 
//   Play, 
//   FileText, 
//   Clock, 
//   CheckCircle, 
//   XCircle, 
//   Target,
//   Brain,
//   Award,
//   TrendingUp
// } from 'lucide-react';
// import { useApp } from '../../contexts/AppContext';
// import { toast } from 'sonner@2.0.3';

// interface TestResult {
//   id: string;
//   subject: string;
//   score: number;
//   totalQuestions: number;
//   correctAnswers: number;
//   timeSpent: number;
//   date: string;
//   difficulty: 'easy' | 'medium' | 'hard';
// }

// export function TestsPage() {
//   const { subjects } = useApp();
//   const [selectedTest, setSelectedTest] = useState<string>('');
//   const [isTestStarted, setIsTestStarted] = useState(false);
  
//   // Mock test results data
//   const [testResults] = useState<TestResult[]>([
//     {
//       id: '1',
//       subject: 'Data Structures & Algorithms',
//       score: 85,
//       totalQuestions: 20,
//       correctAnswers: 17,
//       timeSpent: 25,
//       date: '2025-09-06',
//       difficulty: 'medium'
//     },
//     {
//       id: '2',
//       subject: 'Machine Learning',
//       score: 92,
//       totalQuestions: 15,
//       correctAnswers: 14,
//       timeSpent: 18,
//       date: '2025-09-05',
//       difficulty: 'hard'
//     },
//     {
//       id: '3',
//       subject: 'Database Systems',
//       score: 78,
//       totalQuestions: 25,
//       correctAnswers: 19,
//       timeSpent: 30,
//       date: '2025-09-04',
//       difficulty: 'easy'
//     }
//   ]);

//   const availableTests = [
//     {
//       id: '1',
//       subject: 'Data Structures & Algorithms',
//       topic: 'Binary Trees & BST',
//       questions: 20,
//       duration: 30,
//       difficulty: 'medium' as const
//     },
//     {
//       id: '2',
//       subject: 'Machine Learning',
//       topic: 'Supervised Learning',
//       questions: 15,
//       duration: 25,
//       difficulty: 'hard' as const
//     },
//     {
//       id: '3',
//       subject: 'Database Systems',
//       topic: 'SQL Queries',
//       questions: 25,
//       duration: 35,
//       difficulty: 'easy' as const
//     },
//     {
//       id: '4',
//       subject: 'Data Structures & Algorithms',
//       topic: 'Graph Algorithms',
//       questions: 18,
//       duration: 28,
//       difficulty: 'hard' as const
//     }
//   ];

//   const difficultyColors = {
//     easy: 'bg-green-100 text-green-700',
//     medium: 'bg-yellow-100 text-yellow-700',
//     hard: 'bg-red-100 text-red-700'
//   };

//   const startTest = (testId: string) => {
//     const test = availableTests.find(t => t.id === testId);
//     if (test) {
//       setSelectedTest(testId);
//       setIsTestStarted(true);
//       toast.success(`Starting ${test.topic} test. Good luck!`);
      
//       // Simulate test completion after 3 seconds for demo
//       setTimeout(() => {
//         setIsTestStarted(false);
//         toast.success('Test completed! Check your results.');
//       }, 3000);
//     }
//   };

//   const averageScore = testResults.length > 0 
//     ? Math.round(testResults.reduce((sum, test) => sum + test.score, 0) / testResults.length)
//     : 0;

//   const totalTestsTaken = testResults.length;
//   const recentImprovement = testResults.length > 1 
//     ? testResults[0].score - testResults[1].score 
//     : 0;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">Practice Tests</h1>
//           <p className="text-muted-foreground mt-2">
//             Test your knowledge and track your progress
//           </p>
//         </div>
//       </div>

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-primary/10 rounded-lg">
//                 <Target className="w-6 h-6 text-primary" />
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Average Score</p>
//                 <p className="text-2xl font-bold">{averageScore}%</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-blue-100 rounded-lg">
//                 <FileText className="w-6 h-6 text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Tests Taken</p>
//                 <p className="text-2xl font-bold">{totalTestsTaken}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-green-100 rounded-lg">
//                 <TrendingUp className="w-6 h-6 text-green-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Improvement</p>
//                 <p className="text-2xl font-bold">
//                   {recentImprovement > 0 ? '+' : ''}{recentImprovement}%
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Available Tests */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Brain className="w-5 h-5 text-primary" />
//               Available Tests
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {availableTests.map((test) => (
//                 <div
//                   key={test.id}
//                   className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
//                 >
//                   <div className="space-y-2">
//                     <h4 className="font-medium">{test.topic}</h4>
//                     <p className="text-sm text-muted-foreground">{test.subject}</p>
//                     <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                       <div className="flex items-center gap-1">
//                         <FileText className="w-3 h-3" />
//                         {test.questions} questions
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Clock className="w-3 h-3" />
//                         {test.duration} min
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Badge className={difficultyColors[test.difficulty]}>
//                       {test.difficulty}
//                     </Badge>
//                     <Button 
//                       size="sm" 
//                       onClick={() => startTest(test.id)}
//                       disabled={isTestStarted}
//                     >
//                       {isTestStarted && selectedTest === test.id ? (
//                         <>
//                           <Clock className="mr-2 h-4 w-4 animate-pulse" />
//                           In Progress
//                         </>
//                       ) : (
//                         <>
//                           <Play className="mr-2 h-4 w-4" />
//                           Start
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Recent Results */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Award className="w-5 h-5 text-primary" />
//               Recent Results
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {testResults.map((result) => (
//                 <div
//                   key={result.id}
//                   className="p-4 border rounded-lg"
//                 >
//                   <div className="flex items-center justify-between mb-3">
//                     <h4 className="font-medium">{result.subject}</h4>
//                     <Badge className={difficultyColors[result.difficulty]}>
//                       {result.difficulty}
//                     </Badge>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between text-sm">
//                       <span>Score</span>
//                       <span className="font-medium">{result.score}%</span>
//                     </div>
//                     <Progress value={result.score} className="h-2" />
//                   </div>
                  
//                   <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
//                     <div className="flex items-center gap-4">
//                       <div className="flex items-center gap-1">
//                         <CheckCircle className="w-3 h-3 text-green-600" />
//                         {result.correctAnswers}/{result.totalQuestions}
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Clock className="w-3 h-3" />
//                         {result.timeSpent} min
//                       </div>
//                     </div>
//                     <span>{new Date(result.date).toLocaleDateString()}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Subject Performance */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Subject Performance</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {subjects.map((subject) => {
//               const subjectTests = testResults.filter(test => test.subject === subject.name);
//               const avgScore = subjectTests.length > 0 
//                 ? Math.round(subjectTests.reduce((sum, test) => sum + test.score, 0) / subjectTests.length)
//                 : 0;
              
//               return (
//                 <div key={subject.id} className="p-4 border rounded-lg">
//                   <h4 className="font-medium mb-2">{subject.name}</h4>
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between text-sm">
//                       <span>Average Score</span>
//                       <span className="font-medium">{avgScore}%</span>
//                     </div>
//                     <Progress value={avgScore} className="h-2" />
//                     <div className="flex items-center justify-between text-sm text-muted-foreground">
//                       <span>Tests Taken</span>
//                       <span>{subjectTests.length}</span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


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
  difficulty: 'easy' | 'medium' | 'hard';
}

interface TestsPageProps {
  onStartTest?: (subject: string, questions: Question[]) => void;
}

export function TestsPage({ onStartTest }: TestsPageProps) {
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [isTestStarted, setIsTestStarted] = useState(false);

  const availableTests: AvailableTest[] = [
    { id: '1', subject: 'Data Structures & Algorithms', questions: 20, duration: 30, },
    { id: '2', subject: 'Theory of Computation', questions: 20, duration: 30,  },
    { id: '3', subject: 'Computer Networks', questions: 20, duration: 30, },
    { id: '4', subject: 'Computer Organization & Architecture', questions: 20, duration: 30, },
    { id: '5', subject: 'Operating Systems', questions: 20, duration: 30,  },
  ];

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  };

  const startTest = (test: AvailableTest) => {
    setSelectedTest(test.id);
    setIsTestStarted(true);

    const dummyQuestions: Question[] = Array.from({ length: test.questions }, (_, idx) => ({
      question: `Sample Question ${idx + 1} for ${test.subject}?`,
      correctAnswer: `Answer ${idx + 1}`,
    }));

    toast.success(`Starting ${test.subject} test...`);

    if (onStartTest) onStartTest(test.subject, dummyQuestions);

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
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {test.questions} questions
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {test.duration} min
                  </div>
                </div>
                <Badge className={difficultyColors[test.difficulty]}>{test.difficulty}</Badge>
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
