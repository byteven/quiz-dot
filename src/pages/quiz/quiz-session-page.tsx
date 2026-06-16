import { useEffect } from "react";
import QuizSessionModule from "@/modules/quiz/quiz-session";

export default function QuizSessionPage() {
  useEffect(() => {
    document.title = "Playing Quiz | QuizDot";
  }, []);
  
  return <QuizSessionModule />;
}
