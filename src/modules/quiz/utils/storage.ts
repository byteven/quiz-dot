import type { QuizSession } from "../types/quiz";

const QUIZ_SESSION_KEY = "quizdot_session";

export function saveQuizSession(session: QuizSession): void {
  localStorage.setItem(QUIZ_SESSION_KEY, JSON.stringify(session));
}

export function loadQuizSession(): QuizSession | null {
  const raw = localStorage.getItem(QUIZ_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuizSession;
  } catch {
    return null;
  }
}

export function clearQuizSession(): void {
  localStorage.removeItem(QUIZ_SESSION_KEY);
}
