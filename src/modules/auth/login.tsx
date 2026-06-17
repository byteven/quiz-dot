import { useState } from "react";
import { useAuth } from "@/modules/auth/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Loader2 } from "lucide-react";
import { FloatingGraphics } from "@/common/components/floating-graphics";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/modules/auth/schemas/login.schema";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data.username.trim(), data.password);
      navigate("/setup");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to login";
      toast.error(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background" id="login-page">
      <div className="md:w-1/2 bg-primary p-8 md:p-12 flex flex-col text-primary-foreground relative overflow-hidden min-h-[40vh]">
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

        <FloatingGraphics />

        <div className="relative z-10 flex flex-col h-full w-full">
          <div className="flex items-center gap-3">
            <img
              src="/images/qd.png"
              alt="QuizDot Logo"
              className="w-12 h-12 md:w-14 md:h-14 object-contain rounded-xl"
            />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Quiz<span className="italic">Dot</span>
            </h1>
          </div>

          <div className="flex-1"></div>

          <div className="mt-24 mb-4">
            <p className="text-sm md:text-base font-medium opacity-90 leading-snug">
              Welcome to <br />
              <span className="font-bold text-lg md:text-xl">QuizDot Community.</span>
            </p>
          </div>
        </div>
      </div>

      <div className="md:w-1/2 flex items-center justify-center p-8 bg-white relative">
        <div
          className="w-full max-w-md transition-all duration-300"
        >
          <div className="bg-white" id="login-card">
            <div className="text-center pb-2 mt-2">
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-foreground">Welcome Back!</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Please Login to Begin the Next Quest!
              </p>
            </div>

            <div className="mt-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Input
                    id="username"
                    type="text"
                    label="Username"
                    withAsterisk
                    placeholder="Enter Username"
                    {...register("username")}
                    aria-invalid={!!errors.username}
                    autoFocus
                    autoComplete="off"
                    maxLength={30}
                  />
                  {errors.username && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    id="password"
                    type="password"
                    label="Password"
                    withAsterisk
                    placeholder="Enter password"
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    autoComplete="off"
                    maxLength={30}
                  />
                  {errors.password && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                  id="login-button"
                >
                  {isLoading ? (
                    <>
                      Login
                      <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                    </>
                  ) : (
                    <>
                      Login
                    </>
                  )}
                </Button>
              </form>
              <p className="text-center text-xs text-muted-foreground mt-8">
                Powered by{" "}
                <a
                  href="https://opentdb.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-hover font-semibold transition-colors"
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
