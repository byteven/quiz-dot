import { useEffect } from "react";
import LoginModule from "@/modules/auth/login";

export default function LoginPage() {
  useEffect(() => {
    document.title = "Login | QuizDot";
  }, []);
  
  return <LoginModule />;
}
