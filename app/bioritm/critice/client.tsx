"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowLeft } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { BiorhythmForm } from "@/components/bioritm/biorhythm-form";
import { CriticalDaysList } from "@/components/bioritm/critical-days-list";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";
import { Card } from "@/components/ui/card";

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
      : "skip",
  );

  // Target date is not used for critical days calculation (always uses current date)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = (birth: string, _target: string) => {
    setBirthDate(birth);
    setHasSubmitted(true);
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Info Section */}
        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-semibold text-white">Ce sunt zilele critice?</h2>
          <p className="text-sm text-[#E0E0E0] leading-relaxed">
            Zilele critice apar când unul sau mai multe cicluri bioritmice trec prin punctul zero,
            trecând de la o fază pozitivă la una negativă sau invers. În aceste zile, este recomandat
            să fii mai atent și să eviți deciziile importante sau activitățile riscante în domeniile
            afectate.
          </p>
        </Card>

        {/* Form Section */}
        <Card className="p-6 lg:p-8">
          <BiorhythmForm
            onSubmit={handleSubmit}
            isLoading={criticalDays === undefined && hasSubmitted}
            showTargetDate={false}
          />
        </Card>

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
              className="block group"
              aria-label="Înapoi la Calculator Bioritm"
            >
              <Card className="flex items-center justify-center gap-2 p-4">
                <ArrowLeft
                  className="h-5 w-5 text-[#E0E0E0] group-hover:text-[#9F2BFF] transition-colors"
                  aria-hidden="true"
                />
                <span className="font-medium text-white">Înapoi la Calculator Bioritm</span>
              </Card>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
