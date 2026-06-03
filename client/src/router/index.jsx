import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ProblemsPage from '../pages/ProblemsPage';
import ProblemDetailPage from '../pages/ProblemDetailPage';

function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><div className="p-8 text-center">Dashboard</div></ProtectedRoute>,
  },
  {
    path: '/problems',
    element: <ProtectedRoute><ProblemsPage /></ProtectedRoute>,
  },
  {
    path: '/problems/:slug',
    element: <ProtectedRoute><ProblemDetailPage /></ProtectedRoute>,
  },
  {
    path: '/assistant',
    element: <ProtectedRoute><div className="p-8 text-center">AI Assistant</div></ProtectedRoute>,
  },
  {
    path: '/resume',
    element: <ProtectedRoute><div className="p-8 text-center">Resume Analyzer</div></ProtectedRoute>,
  },
  {
    path: '/roadmap',
    element: <ProtectedRoute><div className="p-8 text-center">Learning Roadmap</div></ProtectedRoute>,
  },
  {
    path: '/analytics',
    element: <ProtectedRoute><div className="p-8 text-center">Analytics</div></ProtectedRoute>,
  },
  {
    path: '/',
    element: <div className="p-8 text-center">CodePrep AI</div>,
  },
]);

export default router;
