import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  Play, 
  Plus, 
  Calendar, 
  FileText, 
  Target, 
  BookOpen 
} from "lucide-react";

interface QuickActionsProps {
  onNavigate: (page: string) => void;
}

export function QuickActions({ onNavigate }: QuickActionsProps) {
  const quickActions = [
    {
      icon: Play,
      title: "Start Practice Test",
      description: "Take a quick practice test",
      color: "bg-green-100 text-green-700 hover:bg-green-200",
      iconColor: "text-green-600",
      action: () => onNavigate('tests')
    },
    {
      icon: Plus,
      title: "Add Subject",
      description: "Add a new subject to study",
      color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      iconColor: "text-blue-600",
      action: () => onNavigate('settings')
    },
    {
      icon: Calendar,
      title: "View Planner",
      description: "Check your study schedule",
      color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
      iconColor: "text-purple-600",
      action: () => onNavigate('planner')
    },
    {
      icon: FileText,
      title: "Create Notes",
      description: "Make new study notes",
      color: "bg-orange-100 text-orange-700 hover:bg-orange-200",
      iconColor: "text-orange-600",
      action: () => onNavigate('notes')
    },
    {
      icon: Target,
      title: "View Progress",
      description: "Check your achievements",
      color: "bg-pink-100 text-pink-700 hover:bg-pink-200",
      iconColor: "text-pink-600",
      action: () => onNavigate('progress')
    },
    {
      icon: BookOpen,
      title: "Study Session",
      description: "Start focused study time",
      color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
      iconColor: "text-indigo-600",
      action: () => onNavigate('planner')
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className={`h-auto p-4 flex flex-col items-center gap-3 ${action.color} border-transparent hover:scale-105 transition-all duration-200`}
              onClick={action.action}
            >
              <action.icon className={`w-6 h-6 ${action.iconColor}`} />
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs opacity-80">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}