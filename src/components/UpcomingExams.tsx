import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar, Clock } from "lucide-react";
import { useApp } from "../contexts/AppContext";

const upcomingExams = [
  { id: 1, subject: "Data Structures & Algorithms", date: "2025-10-16", time: "10:00" },
  { id: 2, subject: "Computer Networks", date: "2025-10-17", time: "14:00" },
  { id: 3, subject: "Operating Systems", date: "2025-10-18", time: "09:00" },
  { id: 4, subject: "Theory of Computation", date: "2025-10-19", time: "11:00" },
  { id: 5, subject: "Computer Organization & Architecture", date: "2025-10-20", time: "10:00" },
];

export function UpcomingExams({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { setSelectedTest, setIsTestStarted } = useApp();

  const handleStart = (exam: typeof upcomingExams[0]) => {
    // Start test immediately for demo
    if (setSelectedTest) setSelectedTest(exam.subject);
    if (setIsTestStarted) setIsTestStarted(true);

    // Navigate to TestsPage
    onNavigate("tests");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Upcoming Exams
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingExams.map((exam) => (
            <div
              key={exam.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="space-y-1">
                <h4 className="font-medium">{exam.subject}</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(exam.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {exam.time}
                  </div>
                </div>
              </div>
              <Button onClick={() => handleStart(exam)}>Start</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
