import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProblemsPage from "../pages/ProblemsPage";
import ProblemDetailPage from "../pages/ProblemDetailPage";
import DashboardPage from "../pages/DashboardPage";
import ResumeAnalyzerPage from "../pages/ResumeAnalyzerPage";
import AppLayout from "../components/layout/AppLayout";

function ProtectedRoute({ children }) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <div className="p-8 text-center">CodePrep AI</div>,
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/problems", element: <ProblemsPage /> },
      { path: "/problems/:slug", element: <ProblemDetailPage /> },
      { path: "/assistant", element: <div className="p-8 text-center">AI Assistant</div> },
      { path: "/resume", element: <ResumeAnalyzerPage /> },
      { path: "/roadmap", element: <div className="p-8 text-center">Learning Roadmap</div> },
      { path: "/analytics", element: <div className="p-8 text-center">Analytics</div> },
    ],
  },
]);

export default router;
