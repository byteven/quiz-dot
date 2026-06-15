import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import QuizSetupPage from "@/modules/quiz/pages/QuizSetupPage";
import QuizPage from "@/modules/quiz/pages/QuizPage";
import ResultPage from "@/modules/quiz/pages/ResultPage";
import type { ReactNode } from "react";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/setup" replace />;
  return <>{children}</>;
}

export default function Router() {
  return (
    <Routes>
      {/* Guest routes */}
      <Route
        path="/"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/setup"
        element={
          <ProtectedRoute>
            <QuizSetupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz"
        element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/result"
        element={
          <ProtectedRoute>
            <ResultPage />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
