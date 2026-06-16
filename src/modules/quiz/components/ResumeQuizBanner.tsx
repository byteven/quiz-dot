import { useNavigate } from "react-router-dom";
import { useQuiz } from "../contexts/quiz-context";
import { Card, CardContent } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { RotateCcw } from "lucide-react";

export function ResumeQuizBanner() {
  const { resumeAvailable, resumeQuiz } = useQuiz();
  const navigate = useNavigate();

  if (!resumeAvailable) return null;

  const handleResume = () => {
    resumeQuiz();
    navigate("/quiz-session");
  };

  return (
    <Card className="bg-secondary mb-6 shadow-none" id="resume-card">
      <CardContent className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <RotateCcw className="w-5 h-5 text-primary-foreground" />
          <div>
            <p className="font-bold text-primary-foreground">Quiz in progress</p>
            <p className="text-sm text-primary-foreground">
              You have an unfinished quiz. Continue where you left off?
            </p>
          </div>
        </div>
        <Button
          onClick={handleResume}
          variant="secondary"
          className="bg-white text-secondary border-none hover:bg-white/90"
          id="resume-button"
        >
          Resume
        </Button>
      </CardContent>
    </Card>
  );
}
