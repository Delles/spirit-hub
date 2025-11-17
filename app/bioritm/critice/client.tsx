"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { BiorhythmForm } from "@/components/bioritm/biorhythm-form";
import { CriticalDaysList } from "@/components/bioritm/critical-days-list";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";

export default function CriticeDaysClient() {
  const [birthDate, setBirthDate] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const criticalDays = useQuery(
    api.biorhythm.getCriticalDays,
    hasSubmitted && birthDate
      ? {
          birthDate,
          startDate: new Date().toISOString().split("T")[0],
          days: 30,
        }
      : "skip"
  );

  const handleSubmit = (birth: string, _target: string) => {
    setBirthDate(birth);
    setHasSubmitted(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Zile Critice
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descoperă zilele când ciclurile tale bioritmice trec prin zero și necesită atenție sporită
            </p>
          </div>

          {/* Info Section */}
          <div className="rounded-lg border bg-card p-6 space-y-3">
            <h2 className="text-xl font-semibold">Ce sunt zilele critice?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Zilele critice apar când unul sau mai multe cicluri bioritmice trec prin punctul zero, 
              trecând de la o fază pozitivă la una negativă sau invers. În aceste zile, 
              este recomandat să fii mai atent și să eviți deciziile importante sau activitățile riscante 
              în domeniile afectate.
            </p>
          </div>

          {/* Form Section */}
          <div className="rounded-lg border bg-card p-6 lg:p-8">
            <BiorhythmForm
              onSubmit={handleSubmit}
              isLoading={criticalDays === undefined && hasSubmitted}
              showTargetDate={false}
            />
          </div>

          {/* Loading State */}
          {criticalDays === undefined && hasSubmitted && (
            <LoadingSpinner text="Se caută zilele critice..." />
          )}

          {/* Error State */}
          {criticalDays === null && hasSubmitted && (
            <ErrorMessage
              title="Eroare la căutare"
              message="Nu am putut identifica zilele critice. Te rugăm să verifici data nașterii și să încerci din nou."
            />
          )}

          {/* Results Section */}
          {criticalDays && hasSubmitted && (
            <div className="space-y-6">
              <CriticalDaysList criticalDays={criticalDays} />

              {/* Back Link */}
              <Link
                href="/bioritm"
                className="flex items-center justify-center gap-2 rounded-lg border bg-card p-4 hover:bg-accent transition-colors group min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Înapoi la Calculator Bioritm"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                <span className="font-medium">Înapoi la Calculator Bioritm</span>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
