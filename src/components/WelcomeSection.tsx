import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Sparkles, Target } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useApp } from "../contexts/AppContext";

export function WelcomeSection() {
  const { user } = useAuth();
  const { exams, subjects } = useApp();
  
  const upcomingExams = exams.filter(exam => new Date(exam.date) >= new Date()).length;
  const averageProgress = Math.round(subjects.reduce((sum, subject) => sum + subject.progress, 0) / subjects.length) || 0;

  return (
    <Card className="bg-gradient-to-r from-primary/10 via-accent/50 to-secondary border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-primary">
              Hello, {user?.name} 👋
            </h2>
            <p className="text-muted-foreground">
              Ready to study today? Let's make some progress on your exam preparation!
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-primary" />
                <span>{upcomingExams} exams this month</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>{averageProgress}% progress</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}