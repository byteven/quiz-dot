export interface OpenTDBResponse {
  response_code: number;
  results: OpenTDBQuestion[];
}

export interface OpenTDBQuestion {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface OpenTDBCategoryResponse {
  trivia_categories: OpenTDBCategory[];
}

export interface OpenTDBCategory {
  id: number;
  name: string;
}

export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: number;
  category: string;
  difficulty: Difficulty;
  question: string;
  correctAnswer: string;
  answers: string[]; 
  type: string;
}

export interface QuizConfig {
  category: number; 
  categoryName: string;
  difficulty: Difficulty | "";
  amount: number;
  timePerQuestion: number; 
}

export interface UserAnswer {
  questionId: number;
  selectedAnswer: string | null;
  isCorrect: boolean;
  timeTaken: number;
}

export interface QuizSession {
  config: QuizConfig;
  questions: Question[];
  answers: UserAnswer[];
  currentIndex: number;
  startedAt: string;
  finishedAt: string | null;
  isFinished: boolean;
  username: string;
}

export type QuizPhase = "setup" | "playing" | "result";
