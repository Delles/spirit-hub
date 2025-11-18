import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ErrorMessageProps {
  title?: string;
  message: string;
  className?: string;
}

export function ErrorMessage({
  title = "A apărut o eroare",
  message,
  className,
}: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center",
        className,
      )}
    >
      <AlertCircle className="h-8 w-8 text-destructive" />
      <div className="space-y-1">
        <h3 className="font-semibold text-destructive">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
