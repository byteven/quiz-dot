import { useNavigate } from "react-router-dom";
import { Button } from "@/common/components/ui/button";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background" id="not-found-page">
      <div className="text-center max-w-md px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-lg shadow-violet-500/25 mb-6">
           <img src="/images/qd.png" alt="Logo" />
        </div>
        <h1 className="text-8xl font-bold bg-primary bg-clip-text text-transparent mb-4">
          404
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Oops! This page doesn't exist.
        </p>
        <Button
          onClick={() => navigate("/")}
          id="go-home-button"
        >
          <Home className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
}
