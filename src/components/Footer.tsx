import { Card, CardContent } from "./ui/card";
import { Lightbulb, Heart } from "lucide-react";

const motivationalQuotes = [
  "Success is the sum of small efforts repeated daily. Keep going! 💪",
  "The expert in anything was once a beginner. You're on the right path! 🌟",
  "Every master was once a disaster. Progress, not perfection! 🚀",
  "Study hard now, celebrate later. Your future self will thank you! 🎉",
  "Knowledge is power, but enthusiasm pulls the switch! ⚡"
];

export function Footer() {
  const todaysQuote = motivationalQuotes[new Date().getDay() % motivationalQuotes.length];

  return (
    <footer className="mt-8">
      <Card className="bg-gradient-to-r from-accent/30 to-secondary/30 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3 text-center">
            <Lightbulb className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-muted-foreground italic">
              <span className="font-medium text-primary">Tip of the day:</span> {todaysQuote}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-400 fill-current" />
            <span>for students worldwide</span>
          </div>
        </CardContent>
      </Card>
    </footer>
  );
}