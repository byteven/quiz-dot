import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "./contexts/quiz-context";
import { ResultSummary } from "./components/ResultSummary";
import { Button } from "@/common/components/ui/button";
import { RotateCcw, Home } from "lucide-react";

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
    <div className="min-h-screen bg-background relative overflow-hidden" id="result-page">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <img src="/images/qd.png" alt="Logo" className="w-6 h-6" />
            </div>
            <span className="font-bold text-foreground">QuizDot</span>
          </div>
        </div>

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
    </div>
  );
}
