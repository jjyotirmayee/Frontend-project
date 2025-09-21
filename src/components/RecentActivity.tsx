import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Clock, 
  FileText, 
  Target, 
  CheckCircle, 
  BookOpen,
  Award
} from "lucide-react";

const recentActivities = [
  {
    id: 1,
    type: "test",
    title: "Completed Data Structures Quiz",
    description: "Scored 85% on Binary Trees",
    time: "2 hours ago",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    id: 2,
    type: "note",
    title: "Added Study Notes",
    description: "Machine Learning - Supervised Learning",
    time: "4 hours ago",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    id: 3,
    type: "goal",
    title: "Goal Achieved",
    description: "Completed 5 hours of study today",
    time: "6 hours ago",
    icon: Target,
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  {
    id: 4,
    type: "study",
    title: "Study Session Completed",
    description: "Database Systems - 2.5 hours",
    time: "1 day ago",
    icon: BookOpen,
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  {
    id: 5,
    type: "achievement",
    title: "Achievement Unlocked",
    description: "Week Warrior - 7 days streak",
    time: "2 days ago",
    icon: Award,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100"
  }
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className={`p-2 rounded-full ${activity.bgColor}`}>
                <activity.icon className={`w-4 h-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">{activity.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}