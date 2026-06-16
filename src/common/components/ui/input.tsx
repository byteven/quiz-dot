import * as React from "react";
import { cn } from "@/common/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/common/components/ui/label";

export interface InputProps extends React.ComponentProps<"input"> {
  startIcon?: React.ElementType;
  label?: string;
  withAsterisk?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon: StartIcon, label, withAsterisk, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const currentType = isPassword && showPassword ? "text" : type;

    return (
      <div className="w-full space-y-2">
        {label && (
          <Label htmlFor={id} className="text-sm font-semibold text-foreground">
            {label}
            {withAsterisk && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <div className="relative w-full">
          {StartIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 pointer-events-none">
              <StartIcon className="size-5" />
            </div>
          )}
          <input
            type={currentType}
            id={id}
            data-slot="input"
            ref={ref}
            className={cn(
              "file:text-foreground placeholder:text-muted-foreground placeholder:text-base selection:bg-primary selection:text-primary-foreground flex h-12 w-full min-w-0 rounded-md border-2 border-dashed border-border bg-transparent py-1 transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-base file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              "focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20",
              "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
              StartIcon ? "pl-10" : "pl-4",
              isPassword ? "pr-10" : "pr-4",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
