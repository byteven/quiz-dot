import { useEffect, useMemo } from "react";

interface TimerProps {
  timeLeft: number;
  totalTime: number;
  progress: number;
}

export function Timer({ timeLeft, progress }: TimerProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const urgency = useMemo(() => {
    if (progress <= 0.2) return "critical";
    if (progress <= 0.4) return "warning";
    return "normal";
  }, [progress]);

  const colors = {
    normal: {
      stroke: "#22c55e",
      bg: "rgba(34, 197, 94, 0.1)",
      text: "text-emerald-600",
    },
    warning: {
      stroke: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.1)",
      text: "text-amber-500",
    },
    critical: {
      stroke: "#ef4444",
      bg: "rgba(239, 68, 68, 0.1)",
      text: "text-red-500",
    },
  };

  const c = colors[urgency];

  const size = 80;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  useEffect(() => {
    if (urgency === "critical" && timeLeft > 0) {
      document.getElementById("timer-ring")?.classList.add("animate-pulse");
    } else {
      document.getElementById("timer-ring")?.classList.remove("animate-pulse");
    }
  }, [urgency, timeLeft]);

  return (
    <div className="relative inline-flex items-center justify-center" id="quiz-timer">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        id="timer-ring"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-muted/40"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={c.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: "stroke-dashoffset 1s linear, stroke 0.3s ease",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-mono text-lg font-bold tabular-nums ${c.text}`}
          style={{ transition: "color 0.3s ease" }}
        >
          {minutes > 0
            ? `${minutes}:${seconds.toString().padStart(2, "0")}`
            : seconds}
        </span>
      </div>
    </div>
  );
}
