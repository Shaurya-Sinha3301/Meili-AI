import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { ROUTES } from '../constants/routes';
import { AppShell } from '../components/layout/AppShell';
import { useTheme } from '../providers/ThemeProvider';
import { useWebSockets } from '../hooks/useWebSockets';

type Page =
  | 'login'
  | 'customer-dashboard'
  | 'agent-dashboard'
  | 'trip-overview'
  | 'timeline'
  | 'feedback'
  | 'optimization-progress'
  | 'diff-viewer'
  | 'explainability'
  | 'settings';

export const AuthenticatedLayout = () => {
  const { token, user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  useWebSockets();

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Derive current page from location path or user role
  let currentPage: Page = 'customer-dashboard';
  if (location.pathname.includes('/timeline')) currentPage = 'timeline';
  else if (location.pathname.includes('/feedback')) currentPage = 'feedback';
  else if (location.pathname.includes('/settings')) currentPage = 'settings';
  else if (location.pathname.includes('/optimization')) currentPage = 'optimization-progress';
  else if (location.pathname.includes('/diff')) currentPage = 'diff-viewer';
  else if (location.pathname.includes('/explainability')) currentPage = 'explainability';
  else if (location.pathname.includes('/trip')) currentPage = 'trip-overview';
  else if (user?.role === 'agent') currentPage = 'agent-dashboard';

  const handleNavigate = (page: Page) => {
    switch (page) {
      case 'settings': navigate(ROUTES.SETTINGS); break;
      case 'timeline': navigate('/timeline'); break; 
      case 'customer-dashboard': navigate(ROUTES.DASHBOARD); break;
      case 'agent-dashboard': navigate(ROUTES.DASHBOARD); break;
      default: navigate(ROUTES.DASHBOARD);
    }
  };

  return (
    <AppShell
      currentPage={currentPage}
      onNavigate={handleNavigate}
      darkMode={theme === 'dark'}
      onToggleDark={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Outlet />
    </AppShell>
  );
};
