import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "./contexts/quiz-context";
import { useQuizTimer } from "./hooks/useQuizTimer";
import { QuestionCard } from "./components/QuestionCard";
import { Timer } from "./components/Timer";
import { ProgressBar } from "./components/ProgressBar";
import { Button } from "@/common/components/ui/button";
import { X } from "lucide-react";

export default function QuizSessionModule() {
  const { session, answerQuestion, skipQuestion, finishQuiz, phase } = useQuiz();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session || phase !== "playing") {
      navigate("/setup", { replace: true });
    }
  }, [session, phase, navigate]);

  const currentQuestion = session?.questions[session.currentIndex];
  const timePerQuestion = session?.config.timePerQuestion ?? 30;

  const handleTimeUp = useCallback(() => {
    if (!session) return;
    skipQuestion(timePerQuestion);
  }, [session, skipQuestion, timePerQuestion]);

  const { timeLeft, progress, reset } = useQuizTimer({
    duration: timePerQuestion,
    onTimeUp: handleTimeUp,
    isPaused: !session || phase !== "playing",
  });

  const handleAnswer = useCallback(
    (answer: string) => {
      if (!session) return;
      const timeTaken = timePerQuestion - timeLeft;
      answerQuestion(answer, timeTaken);
      reset();
    },
    [session, timePerQuestion, timeLeft, answerQuestion, reset]
  );
  useEffect(() => {
    reset();
  }, [session?.currentIndex, reset]);

  useEffect(() => {
    if (phase === "result") {
      navigate("/result", { replace: true });
    }
  }, [phase, navigate]);

  if (!session || !currentQuestion) return null;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden" id="quiz-page">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary to-indigo-600 flex items-center justify-center">
            </div>
            <span className="font-bold text-foreground">QuizDot</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={finishQuiz}
            className="text-muted-foreground hover:text-destructive"
            id="quit-quiz-button"
          >
            <X className="w-4 h-4 mr-1" />
            End Quiz
          </Button>
        </div>

        <div className="flex items-center gap-6 mb-8">
          <div className="flex-1">
            <ProgressBar
              current={session.currentIndex + 1}
              total={session.questions.length}
            />
          </div>
          <Timer
            timeLeft={timeLeft}
            totalTime={timePerQuestion}
            progress={progress}
          />
        </div>

        <div className="min-h-[400px]">
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            questionNumber={session.currentIndex + 1}
            totalQuestions={session.questions.length}
            onAnswer={handleAnswer}
          />
        </div>
      </div>
    </div>
  );
}
