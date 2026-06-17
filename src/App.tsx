import { BrowserRouter, HashRouter } from "react-router-dom";
import { AuthProvider } from "@/modules/auth/contexts/auth-context";
import { QuizProvider } from "@/modules/quiz/contexts/quiz-context";
import Router from "./Router";

const AppRouter =
  import.meta.env.VITE_USE_HASH_ROUTE === "true" ? HashRouter : BrowserRouter;

export default function App() {
  return (
    <AppRouter>
      <AuthProvider>
        <QuizProvider>
          <Router />
        </QuizProvider>
      </AuthProvider>
    </AppRouter>
  );
}
