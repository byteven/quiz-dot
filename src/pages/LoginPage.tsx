import { useState, useCallback, type FormEvent } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";  
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!username.trim()) return;

      setIsAnimating(true);
      setTimeout(() => {
        login(username.trim());
        navigate("/setup");
      }, 300);
    },
    [username, login, navigate]
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background" id="login-page">
      <div className="md:w-1/2 bg-[#47d394] p-8 md:p-12 flex flex-col text-white relative overflow-hidden min-h-[40vh]">
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none" 
          style={{ 
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 25 20 50 10 T 100 10' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E\")",
            backgroundSize: "100px 20px"
          }}
        />
        
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full w-full">
          <div className="flex items-center gap-3">
            <img 
              src="/images/qd.png" 
              alt="QuizDot Logo" 
              className="w-12 h-12 md:w-14 md:h-14 object-contain rounded-xl" 
            />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              QuizDot
            </h1>
          </div>

          <div className="flex-1"></div>

          <div className="mt-24 mb-4">
            <p className="text-sm md:text-base font-medium opacity-90 leading-snug">
              Welcome to <br />
              <span className="font-bold text-lg md:text-xl">QuizzDot Community.</span>
            </p>
          </div>
        </div>
      </div>

      <div className="md:w-1/2 flex items-center justify-center p-8 bg-white relative">
        <div
          className={`w-full max-w-md transition-all duration-300 ${
            isAnimating ? "scale-95 opacity-0" : "animate-in fade-in slide-in-from-bottom-6 duration-500"
          }`}
        >
          <div className="bg-white" id="login-card">
            <div className="text-center pb-2 mt-2">
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Please Login to Begin the Next Quest!
              </p>
            </div>

            <div className="mt-4">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 text-base border-gray-200 focus:border-[#47d394] focus:ring-[#47d394]/20 transition-all"
                    autoFocus
                    autoComplete="off"
                    maxLength={30}
                  />
                </div>

                 <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    className="h-12 text-base border-gray-200 focus:border-[#47d394] focus:ring-[#47d394]/20 transition-all"
                    autoComplete="off"
                    maxLength={30}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!username.trim()}
                  className="w-full h-12 text-base font-bold bg-[#47d394] hover:bg-[#3bb57d] text-white shadow-lg shadow-[#47d394]/25 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
                  id="login-button"
                >
                  Start Playing
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
              <p className="text-center text-xs text-muted-foreground mt-8">
                Powered by{" "}
                <a
                  href="https://opentdb.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#47d394] hover:text-[#3bb57d] font-semibold transition-colors"
                >
                  Open Trivia Database
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
