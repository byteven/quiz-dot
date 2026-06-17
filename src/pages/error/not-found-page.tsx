import { useEffect } from "react";
import NotFoundModule from "@/common/components/not-found";

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "Page Not Found | QuizDot";
  }, []);
  
  return <NotFoundModule />;
}
