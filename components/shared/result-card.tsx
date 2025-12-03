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
    <Card className="w-full p-6 md:p-8">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl text-white">{title}</CardTitle>
            {description && (
              <CardDescription className="text-[#E0E0E0]/60">{description}</CardDescription>
            )}
          </div>
          {badge && <Badge className="ml-2">{badge}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        {number !== undefined && (
          <div className="flex items-center justify-center py-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[#9F2BFF]/20 blur-3xl rounded-full" />
              <span
                className="relative text-7xl font-bold text-white"
                style={{ textShadow: "0 0 20px rgba(159, 43, 255, 0.4)" }}
              >
                {number}
              </span>
            </div>
          </div>
        )}

        <div className="max-w-none">
          <p className="text-[#E0E0E0] leading-relaxed whitespace-pre-line">{interpretation}</p>
        </div>

        {shareUrl && shareTitle && (
          <div className="pt-4 border-t border-white/10">
            <ShareButton url={shareUrl} title={shareTitle} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
