import { type ReactNode } from "react";
import { LogOut, X } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { useAuth } from "@/modules/auth/hooks/use-auth";

interface QuizLayoutProps {
  children: ReactNode;
  titleNode?: ReactNode;
  rightAction?: "logout" | "end" | "none";
  onRightAction?: () => void;
}

export function QuizLayout({ children, titleNode, rightAction = "none", onRightAction }: QuizLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-primary flex flex-col text-primary-foreground relative overflow-hidden" id="quiz-layout">
      <div 
        className="absolute top-0 left-0 right-0 h-[50vh] opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 25 20 50 10 T 100 10' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E\")",
          backgroundSize: "100px 20px"
        }}
      />
      
      <div className="absolute top-0 left-0 w-full h-[50vh] opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-20 flex flex-col shrink-0">
        <div className="w-full px-6 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/images/qd.png" 
              alt="QuizDot Logo" 
              className="w-16 h-16 object-contain rounded-xl p-1" 
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/10 border-2 border-white/10 flex items-center gap-3 px-4 rounded-full">
              <p className="font-medium text-sm md:text-lg pl-2">{user?.username}</p>
              <img 
                src="/images/fight.png" 
                alt="Avatar" 
                className="w-20 h-20 rounded-full -scale-x-100"
              />
            </div>

            {rightAction !== "none" && (
              <div>
                {rightAction === "logout" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRightAction}
                    className="text-primary-foreground hover:bg-white/20 hover:text-white rounded-full h-10 w-10"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                )}
                {rightAction === "end" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRightAction}
                    className="text-primary-foreground hover:bg-white/20 hover:text-white rounded-full h-10 w-10"
                    title="End Quiz"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {titleNode && (
          <div className="w-full px-6 md:px-12 pt-2 pb-8 flex justify-center">
            {titleNode}
          </div>
        )}
      </div>

      <div className="relative z-10 flex-1 bg-white md:rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col text-foreground p-6 md:p-10">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
