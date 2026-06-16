import { useEffect } from "react";
import QuizResultModule from "@/modules/quiz/quiz-result";

export default function ResultPage() {
  useEffect(() => {
    document.title = "Quiz Result | QuizDot";
  }, []);
  
  return <QuizResultModule />;
}
