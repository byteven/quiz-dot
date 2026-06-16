import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "./contexts/quiz-context";
import { useQuizTimer } from "./hooks/useQuizTimer";
import { QuestionCard } from "./components/QuestionCard";
import { Timer } from "./components/Timer";
import { ProgressBar } from "./components/ProgressBar";
import { QuizLayout } from "./components/QuizLayout";

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
    <QuizLayout 
      rightAction="end" 
      onRightAction={finishQuiz}
      titleNode={
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Questions
          </h1>
        </div>
      }
    >
      <div id="quiz-page">
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
    </QuizLayout>
  );
}
