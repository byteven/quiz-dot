import { useMemo, type ElementType } from "react";
import type { QuizSession } from "../types/quiz";
import { CheckCircle2, XCircle, MinusCircle, Trophy, Target, Zap, Clock, Layers, Gauge } from "lucide-react";

interface ResultSummaryProps {
  session: QuizSession;
}

interface Grade {
  label: string;
  color: string;
}

function getGrade(pct: number): Grade {
  if (pct >= 90) return { label: "Excellent", color: "text-primary" };
  if (pct >= 70) return { label: "Very Good", color: "text-primary" };
  if (pct >= 50) return { label: "Good", color: "text-secondary" };
  if (pct >= 30) return { label: "Fair", color: "text-destructive" };
  return { label: "Needs Improvement", color: "text-destructive" };
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

  const grade = getGrade(stats.percentage);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8" id="result-summary">
      <div className="text-center space-y-4">
        <h1 className={`text-3xl md:text-4xl font-bold ${grade.color}`}>
          {grade.label}
        </h1>

        <div className="relative inline-flex items-center justify-center my-6">
          <svg width="160" height="160" className="transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="currentColor"
              className="text-muted/30"
              strokeWidth="8"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 70}
              strokeDashoffset={2 * Math.PI * 70 * (1 - stats.percentage / 100)}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--secondary)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-foreground">{stats.percentage}%</span>
            <span className="text-xs text-muted-foreground font-medium">SCORE</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-muted-foreground mt-2">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-foreground/30" />
            <span className="font-medium text-foreground">{session.config.categoryName || "Mixed Categories"}</span>
          </div>
          <span className="text-muted-foreground/30">•</span>
          <div className="flex items-center gap-2 capitalize">
            <Gauge className="w-5 h-5 text-foreground/30" />
            <span className="font-medium text-foreground">{session.config.difficulty || "Any difficulty"}</span>
          </div>
        </div>
      </div>

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
                  ${
                    isCorrect
                      ? "bg-primary/10"
                      : isUnanswered
                      ? "bg-secondary/10"
                      : "bg-destructive/3"
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 mt-0.5">
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
