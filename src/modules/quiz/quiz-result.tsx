import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "./contexts/quiz-context";
import { ResultSummary } from "./components/ResultSummary";
import { Button } from "@/common/components/ui/button";
import { RotateCcw, Home } from "lucide-react";
import { QuizLayout } from "./components/QuizLayout";

export default function ResultPage() {
  const { session, phase, resetQuiz } = useQuiz();
  const navigate = useNavigate();

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
    <QuizLayout rightAction="none">
      <div id="result-page">

        <ResultSummary session={session} />

        <div className="flex flex-col sm:flex-row gap-3 mt-10 max-w-md mx-auto">
          <Button
            onClick={handlePlayAgain} 
            variant="default"
            id="play-again-button"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/setup")}
            id="back-setup-button"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Setup
          </Button>
        </div>
      </div>
    </QuizLayout>
  );
}
