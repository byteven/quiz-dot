import { useState, useCallback } from "react";
import type { Question } from "../types/quiz";
import { Badge } from "@/common/components/ui/badge";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

const difficultyColors: Record<string, string> = {
  easy: "bg-emerald-100 text-emerald-700 border-emerald-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  hard: "bg-red-100 text-red-700 border-red-200",
};

const optionLetters = ["A", "B", "C", "D"];

export function QuestionCard({
  question,
  onAnswer,
  disabled = false,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleSelect = useCallback(
    (answer: string) => {
      if (disabled || selectedAnswer) return;
      setSelectedAnswer(answer);

      setTimeout(() => {
        onAnswer(answer);
        setSelectedAnswer(null);
      }, 400);
    },
    [disabled, selectedAnswer, onAnswer]
  );

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-5 duration-300" id="question-card">
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Badge
          variant="outline"
          className="text-xs px-3 py-1 font-medium bg-primary/5 text-primary border-primary/20"
        >
          {question.category}
        </Badge>
        <Badge
          variant="outline"
          className={`text-xs px-3 py-1 font-medium capitalize ${
            difficultyColors[question.difficulty] ?? ""
          }`}
        >
          {question.difficulty}
        </Badge>
      </div>

      <h2 className="text-xl md:text-2xl font-semibold leading-relaxed text-foreground mb-8">
        {question.question}
      </h2>

      <div className="grid gap-3">
        {question.answers.map((answer, index) => {
          const isSelected = selectedAnswer === answer;
          return (
            <button
              key={`${question.id}-${index}`}
              id={`answer-option-${index}`}
              onClick={() => handleSelect(answer)}
              disabled={disabled || !!selectedAnswer}
              className={`
                group relative flex items-center gap-4 w-full p-4 rounded-xl text-left
                transition-all duration-200 ease-out
                border-2
                ${
                  isSelected
                    ? "border-primary bg-primary/10 scale-[0.98]"
                    : "border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5"
                }
                ${disabled || selectedAnswer ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
              `}
            >
              <span
                className={`
                  flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg
                  font-bold text-sm transition-all duration-200
                  ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                  }
                `}
              >
                {optionLetters[index]}
              </span>

              <span className="flex-1 text-base font-medium">{answer}</span>

              <div
                className={`
                  flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200
                  ${
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30 group-hover:border-primary/50"
                  }
                `}
              >
                {isSelected && (
                  <svg viewBox="0 0 20 20" fill="white" className="w-full h-full p-0.5">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
