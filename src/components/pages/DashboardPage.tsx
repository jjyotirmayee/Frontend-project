import { useNavigate } from 'react-router-dom';
import { WelcomeSection } from "../WelcomeSection";
import { UpcomingExams } from "../UpcomingExams";
import { StudyProgress } from "../StudyProgress";
import { QuickActions } from "../QuickActions";
import { RecentActivity } from "../RecentActivity";
import { Footer } from "../Footer";

export function DashboardPage() {
  const navigate = useNavigate();
  
  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <WelcomeSection />
      
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pass onNavigate to UpcomingExams */}
          <UpcomingExams onNavigate={handleNavigate} />
          <QuickActions onNavigate={handleNavigate} />
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
