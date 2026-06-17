interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full" id="quiz-progress">
      <div className="flex items-center justify-between mb-2">
        <span className="text-md font-medium text-muted-foreground">
          Question <span className="text-foreground font-semibold">{current}</span> of{" "}
          <span className="text-foreground font-semibold">{total}</span>
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted/50 overflow-hidden">
        <div
          className="h-full rounded-full duration-500 ease-out bg-primary"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}
