import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg md:group-[.toaster]:min-w-[420px] md:group-[.toaster]:w-fit md:group-[.toaster]:max-w-[700px] animate-toast-slide-in-top",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "!bg-primary !text-white !border-primary shadow-lg",
          error:
            "!bg-destructive !text-white !border-destructive shadow-lg",
          warning: "!bg-yellow-500 !text-white !border-yellow-600 shadow-lg",
          info: "!bg-blue-500 !text-white !border-blue-600 shadow-lg",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-5 text-white" />,
        info: <InfoIcon className="size-5 text-white" />,
        warning: <TriangleAlertIcon className="size-5 text-white" />,
        error: <OctagonXIcon className="size-5 text-white" />,
        loading: <Loader2Icon className="size-5 animate-spin text-primary" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
