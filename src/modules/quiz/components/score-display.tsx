import { Layers, Gauge } from "lucide-react";

interface ScoreDisplayProps {
  percentage: number;
  categoryName?: string;
  difficulty?: string;
}

export function ScoreDisplay({ percentage, categoryName, difficulty }: ScoreDisplayProps) {
  return (
    <div className="text-center space-y-4">
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
            strokeDashoffset={2 * Math.PI * 70 * (1 - percentage / 100)}
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
          <span className="text-4xl font-bold text-foreground">{percentage}%</span>
          <span className="text-xs text-muted-foreground font-medium">SCORE</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-muted-foreground mt-2">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-foreground/30" />
          <span className="font-medium text-foreground">{categoryName || "Mixed Categories"}</span>
        </div>
        <span className="text-muted-foreground/30">•</span>
        <div className="flex items-center gap-2 capitalize">
          <Gauge className="w-5 h-5 text-foreground/30" />
          <span className="font-medium text-foreground">{difficulty || "Any difficulty"}</span>
        </div>
      </div>
    </div>
  );
}
