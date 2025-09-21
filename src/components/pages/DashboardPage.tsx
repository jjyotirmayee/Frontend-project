import { WelcomeSection } from "../WelcomeSection";
import { UpcomingExams } from "../UpcomingExams";
import { StudyProgress } from "../StudyProgress";
import { QuickActions } from "../QuickActions";
import { RecentActivity } from "../RecentActivity";
import { Footer } from "../Footer";

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <WelcomeSection />
      
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <UpcomingExams />
          <QuickActions onNavigate={onNavigate} />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <StudyProgress />
          <RecentActivity />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}