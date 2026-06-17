import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "./contexts/quiz-context";
import { ResultSummary } from "./components/result-summary";
import { Button } from "@/common/components/ui/button";
import { RotateCcw } from "lucide-react";
import { QuizLayout } from "./components/quiz-layout";
import { useAuth } from "../auth/hooks/use-auth";

export default function ResultPage() {
  const { session, phase, resetQuiz } = useQuiz();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    if (!session || phase !== "result") {
      navigate("/setup", { replace: true });
    }
  }, [session, phase, navigate]);

  const handlePlayAgain = () => {
    resetQuiz();
    navigate("/setup");
  };

  if (!session) return null;

  return (
    <QuizLayout rightAction="logout" onRightAction={logout}>
      <div id="result-page">

        <ResultSummary session={session} />

        <div className="flex justify-center mt-12">
          <Button
            onClick={handlePlayAgain} 
            className="w-full sm:w-auto px-8 py-6 rounded-xl font-bold text-lg"
            id="play-again-button"
          >
            <RotateCcw className="w-5 h-5 mr-3" />
            Try Again
          </Button>
        </div>
      </div>
    </QuizLayout>
  );
}
