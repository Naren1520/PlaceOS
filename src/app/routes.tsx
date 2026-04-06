import { createBrowserRouter, Navigate } from 'react-router';
import { Login } from './pages/Login';
import { SelectRole } from './pages/SelectRole';
import { Layout } from './components/Layout';

// Student pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentJobs } from './pages/student/StudentJobs';
import { StudentApplications } from './pages/student/StudentApplications';
import { StudentProfile } from './pages/student/StudentProfile';

// Company pages
import { CompanyDashboard } from './pages/company/CompanyDashboard';
import { CompanyPostJob } from './pages/company/CompanyPostJob';
import { CompanyJobs } from './pages/company/CompanyJobs';
import { CompanyApplications } from './pages/company/CompanyApplications';

// Coordinator pages
import { CoordinatorDashboard } from './pages/coordinator/CoordinatorDashboard';
import { CoordinatorStudents } from './pages/coordinator/CoordinatorStudents';
import { CoordinatorCompanies } from './pages/coordinator/CoordinatorCompanies';
import { CoordinatorAnalytics } from './pages/coordinator/CoordinatorAnalytics';
import { CoordinatorSettings } from './pages/coordinator/CoordinatorSettings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/select-role',
    element: <SelectRole />,
  },
  {
    path: '/student',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/student/dashboard" replace /> },
      { path: 'dashboard', element: <StudentDashboard /> },
      { path: 'jobs', element: <StudentJobs /> },
      { path: 'applications', element: <StudentApplications /> },
      { path: 'profile', element: <StudentProfile /> },
    ],
  },
  {
    path: '/company',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/company/dashboard" replace /> },
      { path: 'dashboard', element: <CompanyDashboard /> },
      { path: 'post-job', element: <CompanyPostJob /> },
      { path: 'jobs', element: <CompanyJobs /> },
      { path: 'applications', element: <CompanyApplications /> },
    ],
  },
  {
    path: '/coordinator',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/coordinator/dashboard" replace /> },
      { path: 'dashboard', element: <CoordinatorDashboard /> },
      { path: 'students', element: <CoordinatorStudents /> },
      { path: 'companies', element: <CoordinatorCompanies /> },
      { path: 'analytics', element: <CoordinatorAnalytics /> },
      { path: 'settings', element: <CoordinatorSettings /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
