import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type {
  QuizConfig,
  QuizSession,
  Question,
  UserAnswer,
  QuizPhase,
} from "../types/quiz";
import { saveQuizSession, loadQuizSession, clearQuizSession } from "../utils/storage";
import { useAuth } from "@/modules/auth/hooks/use-auth";

interface QuizContextType {
  phase: QuizPhase;
  session: QuizSession | null;
  isLoading: boolean;

  startQuiz: (config: QuizConfig, questions: Question[]) => void;
  answerQuestion: (selectedAnswer: string, timeTaken: number) => void;
  skipQuestion: (timeTaken: number) => void;
  finishQuiz: () => void;
  resetQuiz: () => void;
  resumeAvailable: boolean;
  resumeQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const username = user?.username;
  const [session, setSession] = useState<QuizSession | null>(null);
  const [phase, setPhase] = useState<QuizPhase>("setup");
  const [isLoading] = useState(false);

  const saved = loadQuizSession();
  const resumeAvailable = !!saved && !saved.isFinished && saved.username === username;

  const persistSession = useCallback((s: QuizSession) => {
    setSession(s);
    saveQuizSession(s);
  }, []);

  const startQuiz = useCallback(
    (config: QuizConfig, questions: Question[]) => {
      const newSession: QuizSession = {
        config,
        questions,
        answers: [],
        currentIndex: 0,
        startedAt: new Date().toISOString(),
        finishedAt: null,
        isFinished: false,
        username: username ?? "",
      };
      persistSession(newSession);
      setPhase("playing");
    },
    [username, persistSession]
  );

  const answerQuestion = useCallback(
    (selectedAnswer: string, timeTaken: number) => {
      setSession((prev) => {
        if (!prev) return prev;
        const currentQ = prev.questions[prev.currentIndex];
        const answer: UserAnswer = {
          questionId: currentQ.id,
          selectedAnswer,
          isCorrect: selectedAnswer === currentQ.correctAnswer,
          timeTaken,
        };

        const newAnswers = [...prev.answers, answer];
        const nextIndex = prev.currentIndex + 1;
        const isFinished = nextIndex >= prev.questions.length;

        const updated: QuizSession = {
          ...prev,
          answers: newAnswers,
          currentIndex: isFinished ? prev.currentIndex : nextIndex,
          isFinished,
          finishedAt: isFinished ? new Date().toISOString() : null,
        };

        saveQuizSession(updated);

        if (isFinished) {
          setPhase("result");
        }

        return updated;
      });
    },
    []
  );

  const skipQuestion = useCallback(
    (timeTaken: number) => {
      setSession((prev) => {
        if (!prev) return prev;
        const currentQ = prev.questions[prev.currentIndex];
        const answer: UserAnswer = {
          questionId: currentQ.id,
          selectedAnswer: null,
          isCorrect: false,
          timeTaken,
        };

        const newAnswers = [...prev.answers, answer];
        const nextIndex = prev.currentIndex + 1;
        const isFinished = nextIndex >= prev.questions.length;

        const updated: QuizSession = {
          ...prev,
          answers: newAnswers,
          currentIndex: isFinished ? prev.currentIndex : nextIndex,
          isFinished,
          finishedAt: isFinished ? new Date().toISOString() : null,
        };

        saveQuizSession(updated);

        if (isFinished) {
          setPhase("result");
        }

        return updated;
      });
    },
    []
  );

  const finishQuiz = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;

      const remaining = prev.questions.slice(prev.answers.length);
      const unanswered: UserAnswer[] = remaining.map((q) => ({
        questionId: q.id,
        selectedAnswer: null,
        isCorrect: false,
        timeTaken: 0,
      }));

      const updated: QuizSession = {
        ...prev,
        answers: [...prev.answers, ...unanswered],
        isFinished: true,
        finishedAt: new Date().toISOString(),
      };

      saveQuizSession(updated);
      return updated;
    });
    setPhase("result");
  }, []);

  const resetQuiz = useCallback(() => {
    clearQuizSession();
    setSession(null);
    setPhase("setup");
  }, []);

  const resumeQuiz = useCallback(() => {
    const saved = loadQuizSession();
    if (saved && !saved.isFinished) {
      setSession(saved);
      setPhase("playing");
    }
  }, []);

  useEffect(() => {
    const saved = loadQuizSession();
    if (saved && saved.username === username) {
      if (saved.isFinished) {
        setSession(saved);
        setPhase("result");
      }
    }
  }, [username]);

  return (
    <QuizContext.Provider
      value={{
        phase,
        session,
        isLoading,
        startQuiz,
        answerQuestion,
        skipQuestion,
        finishQuiz,
        resetQuiz,
        resumeAvailable,
        resumeQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz(): QuizContextType {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used inside <QuizProvider>");
  return ctx;
}
