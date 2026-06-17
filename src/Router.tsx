import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/use-auth";
import LoginPage from "@/pages/auth/login-page";
import NotFoundPage from "@/pages/error/not-found-page";
import QuizSetupPage from "@/pages/quiz/quiz-setup-page";
import QuizSessionPage from "@/pages/quiz/quiz-session-page";
import ResultPage from "@/pages/quiz/quiz-result-page";
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
      {/* Guest */}
      <Route
        path="/"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />

      {/* Protected */}
      <Route
        path="/setup"
        
        element={
          <ProtectedRoute>
            <QuizSetupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz-session"
        element={
          <ProtectedRoute>
            <QuizSessionPage />
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
