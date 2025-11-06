import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardPage } from '../components/pages/DashboardPage';
import { PlannerPage } from '../components/pages/PlannerPage';
import { NotesPage } from '../components/pages/NotesPage';
import { ProgressPage } from '../components/pages/ProgressPage';
import { SettingsPage } from '../components/pages/SettingsPage';
import { FlashcardPage } from '../components/pages/FlashcardPage';
import { TestsPage } from '../components/pages/TestsPage';
import QuickRevisionPage from '../components/pages/QuickRevisionPage';
import { Layout } from '../components/Layout.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'planner',
        element: <PlannerPage />,
      },
      {
        path: 'tests',
        element: <TestsPage />,
      },
      {
        path: 'notes',
        element: <NotesPage />,
      },
      {
        path: 'progress',
        element: <ProgressPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'flashcard',
        element: <FlashcardPage />,
      },
      {
        path: 'quick-revision',
        element: <QuickRevisionPage />,
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);
