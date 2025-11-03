import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { Toaster } from './components/ui/sonner';
import { LoginPage } from './components/auth/LoginPage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './components/pages/DashboardPage';
import { PlannerPage } from './components/pages/PlannerPage';
import { NotesPage } from './components/pages/NotesPage';
import { ProgressPage } from './components/pages/ProgressPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { FlashcardPage } from './components/pages/FlashcardPage';
import { TestsPage } from './components/pages/TestsPage';
import { QuestionnairePage, Question } from './components/pages/QuestionnairePage';
import { ResultPage } from './components/pages/ResultPage';
import  QuickRevisionPage  from './components/pages/QuickRevisionPage';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // For test flow
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentResult, setCurrentResult] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const handleStartTest = (subject: string, questions: Question[]) => {
    setCurrentSubject(subject);
    setCurrentQuestions(questions);
    setCurrentPage('questionnaire');
  };

  const handleFinishTest = (result: any) => {
    setCurrentResult(result);
    setCurrentPage('result');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'planner':
        return <PlannerPage />;
      case 'tests':
        return <TestsPage onStartTest={handleStartTest} />;
      case 'notes':
        return <NotesPage onNavigate={setCurrentPage}/>;
      case 'progress':
        return <ProgressPage />;
      case 'settings':
        return <SettingsPage />;
      case 'flashcard':
        return <FlashcardPage />;
      case 'questionnaire':
        return (
          <QuestionnairePage
            subject={currentSubject}
            questions={currentQuestions}
            onFinish={handleFinishTest}
          />
        );
      case 'result':
        return (
          <ResultPage
            result={currentResult}
            onBack={() => setCurrentPage('tests')}
          />
        );
      case 'quickrevision':  
        return <QuickRevisionPage />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="flex-1 p-6">{renderPage()}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
        <Toaster />
      </AppProvider>
    </AuthProvider>
  );
}
