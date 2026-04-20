import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { FaqPage } from './pages/FaqPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ROLES } from './utils/constants';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { InvestorDashboardPage } from './pages/InvestorDashboardPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { CustomerProjectDetailPage } from './pages/CustomerProjectDetailPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminProjectsPage } from './pages/AdminProjectsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminReportsPage } from './pages/AdminReportsPage';
import { CreatorKycPage } from './pages/CreatorKycPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { RouteErrorPage } from './pages/RouteErrorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'testimonials', element: <TestimonialsPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:projectId', element: <ProjectDetailPage /> },
      {
        element: <ProtectedRoute allowedRoles={[ROLES.INVESTOR]} />,
        children: [{ path: 'investor/dashboard', element: <InvestorDashboardPage /> }]
      },
      {
        element: <ProtectedRoute allowedRoles={[ROLES.CREATOR]} />,
        children: [
          { path: 'creator/dashboard', element: <CustomerDashboardPage /> },
          { path: 'creator/projects/create', element: <CreateProjectPage /> },
          { path: 'creator/projects/:projectId', element: <CustomerProjectDetailPage /> },
          { path: 'creator/verification', element: <CreatorKycPage /> }
        ]
      },
      {
        element: <ProtectedRoute allowedRoles={[ROLES.ADMIN]} />,
        children: [
          { path: 'admin/dashboard', element: <AdminDashboardPage /> },
          { path: 'admin/projects', element: <AdminProjectsPage /> },
          { path: 'admin/users', element: <AdminUsersPage /> },
          { path: 'admin/reports', element: <AdminReportsPage /> }
        ]
      }
    ]
  },
  {
    path: '/',
    element: <AuthLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />,
    errorElement: <RouteErrorPage />
  }
]);
