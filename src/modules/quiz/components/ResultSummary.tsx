import { useMemo } from "react";
import type { QuizSession } from "../types/quiz";
import { CheckCircle2, XCircle, MinusCircle, Trophy, Target, Zap } from "lucide-react";

interface ResultSummaryProps {
  session: QuizSession;
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

  const getGrade = (pct: number) => {
    if (pct >= 90) return { label: "Outstanding!", color: "text-amber-500" };
    if (pct >= 70) return { label: "Great Job!", color: "text-emerald-500" };
    if (pct >= 50) return { label: "Good Effort!", color: "text-blue-500" };
    if (pct >= 30) return { label: "Keep Trying!", color: "text-orange-500" };
    return { label: "Don't Give Up!", color: "text-red-500" };
  };

  const grade = getGrade(stats.percentage);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

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
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-foreground">{stats.percentage}%</span>
            <span className="text-xs text-muted-foreground font-medium">SCORE</span>
          </div>
        </div>

        <p className="text-muted-foreground">
          {session.config.categoryName || "Mixed Categories"} · {session.config.difficulty || "Any"} difficulty
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Correct"
          value={stats.correct}
          color="bg-emerald-50 border-emerald-200"
        />
        <StatCard
          label="Wrong"
          value={stats.wrong}
          color="bg-red-50 border-red-200"
        />
        <StatCard
          label="Unanswered"
          value={stats.unanswered}
          color="bg-gray-50 border-gray-200"
        />
        <StatCard
          label="Avg Time"
          value={formatTime(stats.avgTime)}
          color="bg-blue-50 border-blue-200"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/60">
          <Trophy className="w-5 h-5 text-amber-500" />
          <div>
            <p className="text-sm text-muted-foreground">Total Questions</p>
            <p className="text-lg font-bold">{stats.total}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/60">
          <Target className="w-5 h-5 text-violet-500" />
          <div>
            <p className="text-sm text-muted-foreground">Accuracy</p>
            <p className="text-lg font-bold">{stats.percentage}%</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/60">
          <Zap className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="text-sm text-muted-foreground">Total Time</p>
            <p className="text-lg font-bold">{formatTime(stats.totalTime)}</p>
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
                  p-4 rounded-xl border-2 transition-all duration-200
                  ${
                    isCorrect
                      ? "border-emerald-200 bg-emerald-50/50"
                      : isUnanswered
                      ? "border-gray-200 bg-gray-50/50"
                      : "border-red-200 bg-red-50/50"
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-0.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : isUnanswered ? (
                      <MinusCircle className="w-5 h-5 text-gray-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">
                      {i + 1}. {q.question}
                    </p>
                    <div className="mt-1 space-y-0.5 text-sm">
                      {!isCorrect && answer?.selectedAnswer && (
                        <p className="text-red-600">
                          Your answer: <span className="font-medium">{answer.selectedAnswer}</span>
                        </p>
                      )}
                      <p className="text-emerald-600">
                        Correct: <span className="font-medium">{q.correctAnswer}</span>
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

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${color}`}>
      <span className="text-2xl font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
    </div>
  );
}
