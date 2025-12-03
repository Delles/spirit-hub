"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DreamDetailCard } from "@/components/vise/dream-detail-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DreamSymbolClient({ slug }: { slug: string }) {
  const symbol = useQuery(api.dreams.getDreamSymbolBySlug, { slug });

  if (symbol === undefined) {
    return (
      <div className="py-12 flex justify-center">
        <LoadingSpinner text="Se încarcă interpretarea..." />
      </div>
    );
  }

  if (symbol === null) {
    return (
      <div className="py-12 max-w-2xl mx-auto">
        <ErrorMessage
          title="Simbol negăsit"
          message={`Nu am găsit interpretarea pentru "${slug}". Încearcă să cauți alt simbol.`}
        />
        <div className="mt-6 flex justify-center">
          <Link href="/vise">
            <Button variant="secondary" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Înapoi la dicționar
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/vise" className="inline-block">
          <Button variant="ghost" className="gap-2 pl-0 hover:pl-2 transition-all text-white">
            <ArrowLeft className="h-4 w-4" />
            Înapoi la dicționar
          </Button>
        </Link>

        <DreamDetailCard symbol={symbol} />
      </div>
    </div>
  );
}
