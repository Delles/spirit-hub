import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "./share-button";

export interface ResultCardProps {
  title: string;
  number?: number | string;
  description?: string;
  interpretation: string;
  badge?: string;
  shareUrl?: string;
  shareTitle?: string;
}

export function ResultCard({
  title,
  number,
  description,
  interpretation,
  badge,
  shareUrl,
  shareTitle,
}: ResultCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {badge && (
            <Badge variant="secondary" className="ml-2">
              {badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {number !== undefined && (
          <div className="flex items-center justify-center py-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <div className="relative text-7xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                {number}
              </div>
            </div>
          </div>
        )}

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {interpretation}
          </p>
        </div>

        {shareUrl && shareTitle && (
          <div className="pt-4 border-t">
            <ShareButton url={shareUrl} title={shareTitle} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
