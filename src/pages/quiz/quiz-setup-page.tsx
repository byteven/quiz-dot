import { useEffect } from "react";
import QuizSetupModule from "@/modules/quiz/quiz-setup";

export default function QuizSetupPage() {
  useEffect(() => {
    document.title = "Quiz Setup | QuizDot";
  }, []);
  
  return <QuizSetupModule />;
}
