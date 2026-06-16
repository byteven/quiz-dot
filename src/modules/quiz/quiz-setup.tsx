import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/use-auth";
import { useQuiz } from "./contexts/quiz-context";
import { fetchCategories, fetchQuestions } from "./services/opentdb.service";
import type { OpenTDBCategory, Difficulty, QuizConfig } from "./types/quiz";
import { Button } from "@/common/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
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
  LogOut,
  RotateCcw,
  Gauge,
} from "lucide-react";

export default function QuizSetupPage() {
  const { user, logout } = useAuth();
  const username = user?.username;
  const { startQuiz, resumeAvailable, resumeQuiz } = useQuiz();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<OpenTDBCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  const [category, setCategory] = useState<string>("0");
  const [difficulty, setDifficulty] = useState<string>("");
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

  const handleResume = useCallback(() => {
    resumeQuiz();
    navigate("/quiz-session");
  }, [resumeQuiz, navigate]);

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
        difficulty: (difficulty as Difficulty) || "",
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
    <div className="min-h-screen bg-background relative overflow-hidden" id="quiz-setup-page">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-violet-500/5 blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-indigo-500/3 blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
               <img src="/images/qd.png" alt="Logo" className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">QuizDot</h1>
              <p className="text-sm text-muted-foreground">
                Welcome, <span className="font-medium text-foreground">{username}</span>
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-muted-foreground hover:text-destructive"
            id="logout-button"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Logout
          </Button>
        </div>

        {resumeAvailable && (
          <Card className="mb-6 border-amber-200 bg-amber-50/50 animate-in fade-in slide-in-from-top-3 duration-300" id="resume-card">
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-900">Quiz in progress</p>
                  <p className="text-sm text-amber-700">
                    You have an unfinished quiz. Continue where you left off?
                  </p>
                </div>
              </div>
              <Button
                onClick={handleResume}
                className="bg-amber-600 hover:bg-amber-700 text-white"
                id="resume-button"
              >
                Resume
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-xl border-border/40 bg-card/80 backdrop-blur-sm" id="setup-card">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">Quiz Setup</CardTitle>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Configure your quiz and challenge yourself!
            </p>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center gap-2 font-medium">
                <Layers className="w-4 h-4 text-muted-foreground" />
                Category
              </Label>
              <Select value={category} onValueChange={setCategory} disabled={loadingCategories}>
                <SelectTrigger id="category" className="h-11">
                  <SelectValue placeholder={loadingCategories ? "Loading..." : "Select category"} />
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

            <div className="space-y-2">
              <Label htmlFor="difficulty" className="flex items-center gap-2 font-medium">
                <Gauge className="w-4 h-4 text-muted-foreground" />
                Difficulty
              </Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty" className="h-11">
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

            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2 font-medium">
                <Hash className="w-4 h-4 text-muted-foreground" />
                Number of Questions
              </Label>
              <Select value={amount} onValueChange={setAmount}>
                <SelectTrigger id="amount" className="h-11">
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

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2 font-medium">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Time per Question
              </Label>
              <Select value={timePerQuestion} onValueChange={setTimePerQuestion}>
                <SelectTrigger id="time" className="h-11">
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

            <Button
              onClick={handleStart}
              disabled={loadingQuiz || loadingCategories}
              variant="default"
              className="w-fill"
              id="start-quiz-button"
            >
              {loadingQuiz ? (
                <>
                  <Spinner className="w-5 h-5 mr-2" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start Quiz
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
