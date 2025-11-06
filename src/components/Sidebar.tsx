import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  StickyNote, 
  TrendingUp, 
  Settings,
  BookOpen
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", page: "dashboard" },
  { icon: Calendar, label: "Planner", page: "planner" },
  { icon: FileText, label: "Tests", page: "tests" },
  { icon: StickyNote, label: "Notes", page: "notes" },
  { icon: TrendingUp, label: "Progress", page: "progress" },
  { icon: Settings, label: "Settings", page: "settings" },
];

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold">Study Hub</span>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant={currentPage === item.page ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => onNavigate(item.page)}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  );
}