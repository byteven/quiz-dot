import type {
  OpenTDBCategoryResponse,
  OpenTDBCategory,
  OpenTDBResponse,
  Question,
  Difficulty,
} from "../types/quiz";
import { decodeHTML } from "../utils/decode-html";
import { shuffle } from "../utils/shuffle";

const BASE_URL = "https://opentdb.com";

export async function fetchCategories(): Promise<OpenTDBCategory[]> {
  const res = await fetch(`${BASE_URL}/api_category.php`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data: OpenTDBCategoryResponse = await res.json();
  return data.trivia_categories;
}

export async function fetchQuestions(
  amount: number,
  category: number,
  difficulty: Difficulty | ""
): Promise<Question[]> {
  const params = new URLSearchParams({
    amount: String(amount),
    type: "multiple",
  });

  if (category > 0) params.set("category", String(category));
  if (difficulty) params.set("difficulty", difficulty);

  const res = await fetch(`${BASE_URL}/api.php?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch questions");

  const data: OpenTDBResponse = await res.json();

  if (data.response_code !== 0) {
    const messages: Record<number, string> = {
      1: "Not enough questions available for your selection. Try fewer questions or a different category.",
      2: "Invalid parameter in the request.",
      3: "Session token not found.",
      4: "All questions have been exhausted. Try a different category.",
      5: "Too many requests. Please wait a moment.",
    };
    throw new Error(messages[data.response_code] ?? "Unknown API error.");
  }

  return data.results.map((q, i) => ({
    id: i,
    category: decodeHTML(q.category),
    difficulty: q.difficulty as Difficulty,
    question: decodeHTML(q.question),
    correctAnswer: decodeHTML(q.correct_answer),
    answers: shuffle([
      decodeHTML(q.correct_answer),
      ...q.incorrect_answers.map(decodeHTML),
    ]),
    type: q.type,
  }));
}
