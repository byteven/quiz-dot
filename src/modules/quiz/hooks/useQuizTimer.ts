import { useState, useEffect, useCallback, useRef } from "react";

interface UseQuizTimerOptions {
  duration: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

interface UseQuizTimerReturn {
  timeLeft: number;
  elapsed: number;
  progress: number;
  reset: () => void;
}

export function useQuizTimer({
  duration,
  onTimeUp,
  isPaused = false,
}: UseQuizTimerOptions): UseQuizTimerReturn {
  const [timeLeft, setTimeLeft] = useState(duration);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  const reset = useCallback(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(interval);
          setTimeout(() => onTimeUpRef.current(), 0);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeLeft]);

  return {
    timeLeft,
    elapsed: duration - timeLeft,
    progress: duration > 0 ? timeLeft / duration : 0,
    reset,
  };
}
