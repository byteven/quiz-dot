import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/use-auth";
import { useQuiz } from "./contexts/quiz-context";
import { fetchCategories, fetchQuestions } from "./services/opentdb.service";
import type { OpenTDBCategory, Difficulty, QuizConfig } from "./types/quiz";
import { QuizLayout } from "./components/quiz-layout";
import { ResumeQuizBanner } from "./components/resume-quiz-banner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select";
import { Label } from "@/common/components/ui/label";
import { Spinner } from "@/common/components/ui/spinner";
import { toast } from "sonner";
import {
  Layers,
  Hash,
  Clock,
  Play,
  Gauge,
} from "lucide-react";

export default function QuizSetupPage() {
  const { user, logout } = useAuth();
  const username = user?.username;
  const { startQuiz } = useQuiz();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<OpenTDBCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  const [category, setCategory] = useState<string>("0");
  const [difficulty, setDifficulty] = useState<string>("any");
  const [amount, setAmount] = useState<string>("10");
  const [timePerQuestion, setTimePerQuestion] = useState<string>("30");

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Failed to start quiz. Please try again.";
        toast.error(message);
      })
      .finally(() => setLoadingCategories(false));
  }, []);

  const handleStart = useCallback(async () => {
    setLoadingQuiz(true);
    try {
      const catId = parseInt(category);
      const catName =
        catId === 0
          ? "Any Category"
          : categories.find((c) => c.id === catId)?.name ?? "Unknown";

      const config: QuizConfig = {
        category: catId,
        categoryName: catName,
        difficulty: difficulty === "any" ? "" : (difficulty as Difficulty),
        amount: parseInt(amount),
        timePerQuestion: parseInt(timePerQuestion),
      };

      const questions = await fetchQuestions(config.amount, config.category, config.difficulty);
      startQuiz(config, questions);
      navigate("/quiz-session");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start quiz. Please try again.";
      toast.error(message);
    } finally {
      setLoadingQuiz(false);
    }
  }, [category, difficulty, amount, timePerQuestion, categories, startQuiz, navigate]);

  return (
    <QuizLayout 
      rightAction="logout" 
      onRightAction={logout}
      titleNode={
        <div className="mb-6 text-center flex flex-col items-center">
          <div className="flex items-center justify-center gap-3">
            <img
              src="/images/qd.png"
              alt="QuizDot Logo"
              className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-xl"
            />
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              Quiz<span className="italic">Dot</span>
            </h1>
          </div>
          <p className="text-white mt-2 text-lg font-medium">Let’s set up your quiz, {username}!</p>
        </div>
      }
    >
      <ResumeQuizBanner />

      <div id="setup-card" className="flex-1 flex flex-col pt-2 md:pt-8">
        <div className="pb-8 md:pb-12 px-0 w-full max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Quiz Setup</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center w-full">
          <div className="w-full md:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-3 md:space-y-4">
              <Label htmlFor="category" className="flex items-center gap-2 font-semibold text-base md:text-lg">
                <Layers className="w-5 h-5 text-primary" />
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="h-14 md:h-16 text-base md:text-lg">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any Category</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 md:space-y-4">
              <Label htmlFor="difficulty" className="flex items-center gap-2 font-semibold text-base md:text-lg">
                <Gauge className="w-5 h-5 text-primary" />
                Difficulty
              </Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty" className="h-14 md:h-16 text-base md:text-lg">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Difficulty</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 md:space-y-4">
              <Label htmlFor="amount" className="flex items-center gap-2 font-semibold text-base md:text-lg">
                <Hash className="w-5 h-5 text-primary" />
                Number of Questions
              </Label>
              <Select value={amount} onValueChange={setAmount}>
                <SelectTrigger id="amount" className="h-14 md:h-16 text-base md:text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20, 25, 30, 50].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} Questions
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 md:space-y-4">
              <Label htmlFor="time" className="flex items-center gap-2 font-semibold text-base md:text-lg">
                <Clock className="w-5 h-5 text-primary" />
                Time per Question
              </Label>
              <Select value={timePerQuestion} onValueChange={setTimePerQuestion}>
                <SelectTrigger id="time" className="h-14 md:h-16 text-base md:text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 seconds</SelectItem>
                  <SelectItem value="20">20 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="45">45 seconds</SelectItem>
                  <SelectItem value="60">60 seconds</SelectItem>
                  <SelectItem value="90">90 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>


          <div className="w-full md:w-2/5 flex items-center justify-center">
            <button
              onClick={handleStart}
              disabled={loadingQuiz || loadingCategories}
              className={`
                w-56 h-56 md:w-72 md:h-72 rounded-full border-[3px] border-dashed
                bg-transparent text-primary hover:text-primary hover:border-primary
                transition-colors duration-300 flex flex-col items-center justify-center gap-4 
                font-bold text-2xl md:text-3xl cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20
              `}
              id="start-quiz-button"
            >
              {loadingQuiz ? (
                <>
                  <Spinner className="w-10 h-10 md:w-12 md:h-12" />
                  <span>Hold on...</span>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center text-white mb-2">
                    <Play className="w-8 h-8 md:w-10 md:h-10 ml-2" fill="currentColor" />
                  </div>
                  <span>Start Quiz!</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </QuizLayout>
  );
}
