import { createBrowserRouter, useNavigate } from 'react-router-dom';
import { GuestLayout } from '../layouts/GuestLayout';
import { AuthenticatedLayout } from '../layouts/AuthenticatedLayout';
import { ROUTES } from '../constants/routes';
import { HealthCheck } from '../pages/HealthCheck';
import { LandingPage } from '../pages/LandingPage';
import { DemoLauncherPage } from '../pages/DemoLauncherPage';
import { LoginPage } from '../pages/LoginPage';

import { ApiPlayground } from '../pages/ApiPlayground';
import { AgentDashboardPage } from '../pages/AgentDashboardPage';
import { CustomerDashboardPage } from '../pages/CustomerDashboardPage';
import { useAuthStore } from '../stores/auth.store';

import { TripOverviewPage } from '../pages/TripOverviewPage';
import { TimelinePage } from '../pages/TimelinePage';
import { OptimizationProgressPage } from '../pages/OptimizationProgressPage';
import { DiffViewerPage } from '../pages/DiffViewerPage';
import { ExplainabilityPage } from '../pages/ExplainabilityPage';
import { FeedbackPage } from '../pages/FeedbackPage';
import { SettingsPage } from '../pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/dev/health',
    element: <HealthCheck />,
  },
  {
    path: '/dev/api',
    element: <ApiPlayground />,
  },
  {
    element: <GuestLayout />,
    children: [
      {
        path: ROUTES.LANDING,
        element: <LandingPage />,
      },
      {
        path: ROUTES.DEMO,
        element: <DemoLauncherPage />,
      },
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <AuthenticatedLayout />,
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardRouter />,
      },
      {
        path: '/trip-overview/:tripId',
        element: <TripOverviewPage />,
      },
      {
        path: '/timeline',
        element: <TimelinePage onNavigate={(p) => window.location.assign(`/${p}`)} />,
      },
      {
        path: '/optimization',
        element: <OptimizationProgressPage onNavigate={(p) => window.location.assign(`/${p}`)} />,
      },
      {
        path: '/diff-viewer',
        element: <DiffViewerPage onNavigate={(p) => window.location.assign(`/${p}`)} />,
      },
      {
        path: '/explainability',
        element: <ExplainabilityPage onNavigate={(p) => window.location.assign(`/${p}`)} />,
      },
      {
        path: '/feedback',
        element: <FeedbackPage onNavigate={(p) => window.location.assign(`/${p}`)} />,
      },
      {
        path: ROUTES.SETTINGS,
        element: <SettingsPage onNavigate={(p) => window.location.assign(`/${p}`)} />,
      },
      {
        path: ROUTES.NOT_FOUND,
        element: <div>404 Not Found</div>,
      },
    ],
  },
]);

function DashboardRouter() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const handleNavigate = (path: string) => navigate(path.startsWith('/') ? path : `/${path}`);
  if (user?.role === 'agent') {
    return <AgentDashboardPage onNavigate={handleNavigate} />;
  }
  return <CustomerDashboardPage onNavigate={handleNavigate} />;
}
