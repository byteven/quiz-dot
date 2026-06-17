import { useState, useCallback } from "react";
import type { Question } from "../types/quiz";
import { Layers } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

const optionLetterStyles = [
  "bg-amber-300 text-amber-900 group-hover:bg-amber-400",
  "bg-blue-300 text-blue-900 group-hover:bg-blue-400",
  "bg-pink-300 text-pink-900 group-hover:bg-pink-400",
  "bg-indigo-300 text-indigo-900 group-hover:bg-indigo-400",
];

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
    <div className="w-full" id="question-card">
      <div className="flex flex-wrap items-center gap-4 mb-5">
        <div className="flex items-center gap-2 text-foreground font-light text-sm md:text-base">
          <Layers className="w-5 h-5 text-muted-foreground/50" />
          {question.category}
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-semibold leading-relaxed text-foreground mb-8">
        {question.question}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {question.answers.map((answer, index) => {
          const isSelected = selectedAnswer === answer;
          return (
            <button
              key={`${question.id}-${index}`}
              id={`answer-option-${index}`}
              onClick={() => handleSelect(answer)}
              disabled={disabled || !!selectedAnswer}
              className={`
                group relative flex items-center gap-4 md:w-full p-4 rounded-xl text-left
                border-2 border-dashed
                ${isSelected
                  ? "border-primary bg-primary text-white"
                  : "border-border/60 bg-transparent hover:border-primary/40 hover:bg-primary/5"
                }
                ${disabled || selectedAnswer ? "cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              <span
                className={`
                  shrink-0 flex items-center justify-center w-10 h-10 md:w-20 md:h-20 rounded-lg
                  font-bold text-md md:text-xl
                  ${isSelected
                    ? "bg-white text-primary"
                    : optionLetterStyles[index]
                  }
                `}
              >
                {optionLetters[index]}
              </span>

              <span className="flex-1 text-md font-medium">{answer}</span>

              <div
                className={`
                  shrink-0 w-5 h-5 rounded-full border-2
                  ${isSelected
                    ? "border-white bg-white text-primary"
                    : "border-muted-foreground/30 group-hover:border-primary/50"
                  }
                `}
              >
                {isSelected && (
                  <svg viewBox="0 0 20 20" className="w-full h-full p-0.5 text-primary">
                    <path
                      fillRule="evenodd"
                      fill="currentColor"
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
