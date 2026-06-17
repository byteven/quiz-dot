import { useMemo, type ElementType } from "react";
import type { QuizSession } from "../types/quiz";
import { CheckCircle2, XCircle, MinusCircle, Trophy, Target, Zap, Clock } from "lucide-react";
import { ScoreDisplay } from "./score-display";

interface ResultSummaryProps {
  session: QuizSession;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function ResultSummary({ session }: ResultSummaryProps) {
  const stats = useMemo(() => {
    const correct = session.answers.filter((a) => a.isCorrect).length;
    const wrong = session.answers.filter(
      (a) => !a.isCorrect && a.selectedAnswer !== null
    ).length;
    const unanswered = session.answers.filter(
      (a) => a.selectedAnswer === null
    ).length;
    const total = session.questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const totalTime = session.answers.reduce((sum, a) => sum + a.timeTaken, 0);
    const avgTime = session.answers.length > 0 ? totalTime / session.answers.length : 0;

    return { correct, wrong, unanswered, total, percentage, totalTime, avgTime };
  }, [session]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8" id="result-summary">
      <ScoreDisplay
        percentage={stats.percentage}
        categoryName={session.config.categoryName}
        difficulty={session.config.difficulty}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Correct"
          value={stats.correct}
          className="bg-primary text-primary-foreground"
          icon={CheckCircle2}
        />
        <StatCard
          label="Wrong"
          value={stats.wrong}
          className="bg-destructive text-destructive-foreground"
          icon={XCircle}
        />
        <StatCard
          label="Unanswered"
          value={stats.unanswered}
          className="bg-secondary text-secondary-foreground"
          icon={MinusCircle}
        />
        <StatCard
          label="Avg Time"
          value={formatTime(stats.avgTime)}
          className="bg-foreground text-background"
          icon={Clock}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-muted/40">
          <Trophy className="w-6 h-6 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
            <p className="text-xl font-bold text-foreground">{stats.total}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-muted/40">
          <Target className="w-6 h-6 text-secondary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
            <p className="text-xl font-bold text-foreground">{stats.percentage}%</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-muted/40">
          <Zap className="w-6 h-6 text-destructive" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Time</p>
            <p className="text-xl font-bold text-foreground">{formatTime(stats.totalTime)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Question Review</h3>
        <div className="space-y-2">
          {session.questions.map((q, i) => {
            const answer = session.answers[i];
            const isCorrect = answer?.isCorrect;
            const isUnanswered = answer?.selectedAnswer === null;

            return (
              <div
                key={q.id}
                id={`review-question-${i}`}
                className={`
                  p-5 rounded-2xl transition-all duration-200
                  ${isCorrect
                    ? "bg-primary/10"
                    : isUnanswered
                      ? "bg-secondary/10"
                      : "bg-destructive/3"
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <span className="shrink-0 mt-0.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    ) : isUnanswered ? (
                      <MinusCircle className="w-6 h-6 text-secondary" />
                    ) : (
                      <XCircle className="w-6 h-6 text-destructive" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base text-foreground leading-relaxed">
                      {i + 1}. {q.question}
                    </p>
                    <div className="mt-2 space-y-1 text-sm">
                      {!isCorrect && answer?.selectedAnswer && (
                        <p className="text-destructive/80">
                          <span className="font-medium text-destructive italic">{answer.selectedAnswer}</span>
                        </p>
                      )}
                      <p className="text-primary/90">
                        <span className="font-medium text-primary">{q.correctAnswer}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  className: string;
  icon?: ElementType;
}

function StatCard({ label, value, className, icon: Icon }: StatCardProps) {
  return (
    <div className={`relative overflow-hidden flex flex-col items-center justify-center gap-1.5 p-6 rounded-2xl ${className}`}>
      {Icon && <Icon className="absolute right-[-10%] bottom-[-15%] w-24 h-24 opacity-20 pointer-events-none z-0" />}
      <span className="relative z-10 text-4xl font-bold leading-none">{value}</span>
      <span className="relative z-10 text-sm font-medium opacity-90 mt-1">{label}</span>
    </div>
  );
}
