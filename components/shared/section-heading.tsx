import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

export function SectionHeading({ title, description, icon: Icon, className }: SectionHeadingProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      </div>
      {description && <p className="text-muted-foreground max-w-2xl">{description}</p>}
    </div>
  );
}
