import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Clock } from "lucide-react";

const upcomingExams = [
  {
    id: 1,
    subject: "Data Structures & Algorithms",
    date: "2025-09-15",
    time: "10:00 AM",
    type: "Midterm",
    priority: "high"
  },
  {
    id: 2,
    subject: "Machine Learning",
    date: "2025-09-22",
    time: "2:00 PM",
    type: "Quiz",
    priority: "medium"
  },
  {
    id: 3,
    subject: "Database Systems",
    date: "2025-09-28",
    time: "9:00 AM",
    type: "Final",
    priority: "high"
  },
  {
    id: 4,
    subject: "Software Engineering",
    date: "2025-10-05",
    time: "11:00 AM",
    type: "Project Presentation",
    priority: "medium"
  }
];

const priorityColors = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200"
};

export function UpcomingExams() {
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
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={priorityColors[exam.priority as keyof typeof priorityColors]}>
                  {exam.type}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}