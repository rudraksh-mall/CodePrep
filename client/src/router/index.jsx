import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorBoundary from "../components/ui/ErrorBoundary";
import Spinner from "../components/ui/Spinner";
import AppLayout from "../components/layout/AppLayout";

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const ProblemsPage = lazy(() => import("../pages/ProblemsPage"));
const ProblemDetailPage = lazy(() => import("../pages/ProblemDetailPage"));
const AssistantPage = lazy(() => import("../pages/AssistantPage"));
const ResumeAnalyzerPage = lazy(() => import("../pages/ResumeAnalyzerPage"));
const RoadmapPage = lazy(() => import("../pages/RoadmapPage"));
const AnalyticsPage = lazy(() => import("../pages/AnalyticsPage"));

function SuspenseWrapper({ children }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

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
    element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
  },
  {
    path: "/register",
    element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper>,
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
      { path: "/dashboard", element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
      { path: "/problems", element: <SuspenseWrapper><ProblemsPage /></SuspenseWrapper> },
      { path: "/problems/:slug", element: <SuspenseWrapper><ProblemDetailPage /></SuspenseWrapper> },
      { path: "/assistant", element: <SuspenseWrapper><AssistantPage /></SuspenseWrapper> },
      { path: "/resume", element: <SuspenseWrapper><ResumeAnalyzerPage /></SuspenseWrapper> },
      { path: "/roadmap", element: <SuspenseWrapper><RoadmapPage /></SuspenseWrapper> },
      { path: "/analytics", element: <SuspenseWrapper><AnalyticsPage /></SuspenseWrapper> },
    ],
  },
]);

export default router;
