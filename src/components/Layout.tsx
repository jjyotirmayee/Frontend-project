import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getCurrentPage = () => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    return path;
  };

  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentPage={getCurrentPage()} onNavigate={handleNavigate} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentPage={getCurrentPage()} onNavigate={handleNavigate} />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
