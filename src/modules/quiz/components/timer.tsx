import { useEffect, useMemo, useRef } from "react";

interface TimerProps {
  timeLeft: number;
  progress: number;
}

const URGENCY_COLORS = {
  normal: {
    stroke: "var(--primary)",
    text: "text-emerald-600",
  },
  warning: {
    stroke: "#f59e0b",
    text: "text-amber-500",
  },
  critical: {
    stroke: "#ef4444",
    text: "text-red-500",
  },
} as const;

type Urgency = keyof typeof URGENCY_COLORS;

export function Timer({ timeLeft, progress }: TimerProps) {
  const ringRef = useRef<SVGSVGElement>(null);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const urgency: Urgency = useMemo(() => {
    if (progress <= 0.2) return "critical";
    if (progress <= 0.4) return "warning";
    return "normal";
  }, [progress]);

  const c = URGENCY_COLORS[urgency];

  const size = 80;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  useEffect(() => {
    const el = ringRef.current;
    if (!el) return;

    if (urgency === "critical" && timeLeft > 0) {
      el.classList.add("animate-pulse");
    } else {
      el.classList.remove("animate-pulse");
    }
  }, [urgency, timeLeft]);

  return (
    <div className="relative inline-flex items-center justify-center" id="quiz-timer">
      <svg
        ref={ringRef}
        width={size}
        height={size}
        className="transform -rotate-90"
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
          className={`text-lg font-bold tabular-nums ${c.text}`}
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
