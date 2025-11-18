"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { Activity, ArrowRight } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { BiorhythmForm } from "@/components/bioritm/biorhythm-form";
import { BiorhythmChart } from "@/components/bioritm/biorhythm-chart";
import { BiorhythmSummary } from "@/components/bioritm/biorhythm-summary";
import { ShareButton } from "@/components/shared/share-button";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";

export default function BioritmClient() {
  const [birthDate, setBirthDate] = useState<string>("");
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const biorhythm = useQuery(
    api.biorhythm.getBiorhythm,
    hasSubmitted && birthDate ? { birthDate, targetDate } : "skip",
  );

  const handleSubmit = (birth: string, target: string) => {
    setBirthDate(birth);
    setTargetDate(target);
    setHasSubmitted(true);
  };

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/bioritm?date=${birthDate}` : "";

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">

          {/* Info Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 space-y-2">
              <h3 className="font-semibold text-lg">Ciclu Fizic</h3>
              <p className="text-sm text-muted-foreground">23 de zile</p>
              <p className="text-xs text-muted-foreground">
                Energie, rezistență și vitalitate fizică
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 space-y-2">
              <h3 className="font-semibold text-lg">Ciclu Emoțional</h3>
              <p className="text-sm text-muted-foreground">28 de zile</p>
              <p className="text-xs text-muted-foreground">
                Stare de spirit, creativitate și sensibilitate
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 space-y-2">
              <h3 className="font-semibold text-lg">Ciclu Intelectual</h3>
              <p className="text-sm text-muted-foreground">33 de zile</p>
              <p className="text-xs text-muted-foreground">
                Claritate mentală, concentrare și memorie
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="rounded-lg border bg-card p-6 lg:p-8">
            <BiorhythmForm
              onSubmit={handleSubmit}
              isLoading={biorhythm === undefined && hasSubmitted}
            />
          </div>

          {/* Loading State */}
          {biorhythm === undefined && hasSubmitted && (
            <LoadingSpinner text="Se calculează bioritmul..." />
          )}

          {/* Error State */}
          {biorhythm === null && hasSubmitted && (
            <ErrorMessage
              title="Eroare la calculare"
              message="Nu am putut calcula bioritmul. Te rugăm să verifici datele introduse și să încerci din nou."
            />
          )}

          {/* Results Section */}
          {biorhythm && hasSubmitted && (
            <div className="space-y-6">
              {/* Chart */}
              <div className="rounded-lg border bg-card p-6 lg:p-8">
                <h2 className="text-2xl font-semibold mb-6">Graficul Bioritmului Tău</h2>
                <BiorhythmChart
                  physical={biorhythm.physical}
                  emotional={biorhythm.emotional}
                  intellectual={biorhythm.intellectual}
                  birthDate={biorhythm.birthDate}
                  targetDate={biorhythm.targetDate}
                />
              </div>

              {/* Summary */}
              <div className="rounded-lg border bg-card p-6 lg:p-8">
                <BiorhythmSummary
                  summary={biorhythm.summary}
                  physical={biorhythm.physical}
                  emotional={biorhythm.emotional}
                  intellectual={biorhythm.intellectual}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-lg border bg-card p-6">
                <div className="text-center sm:text-left">
                  <h3 className="font-semibold mb-1">Distribuie rezultatul tău</h3>
                  <p className="text-sm text-muted-foreground">
                    Împărtășește bioritmul tău cu prietenii
                  </p>
                </div>
                <ShareButton
                  url={shareUrl}
                  title="Bioritmul meu - SpiritHub.ro"
                  text={`Bioritmul meu pentru ${new Date(targetDate).toLocaleDateString("ro-RO")}`}
                />
              </div>

              {/* Link to Critical Days */}
              <Link
                href="/bioritm/critice"
                className="flex items-center justify-between rounded-lg border bg-card p-6 hover:bg-accent transition-colors group min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Vezi zilele critice"
              >
                <div>
                  <h3 className="font-semibold mb-1">Zile Critice</h3>
                  <p className="text-sm text-muted-foreground">
                    Descoperă zilele când ciclurile tale trec prin zero
                  </p>
                </div>
                <ArrowRight
                  className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors"
                  aria-hidden="true"
                />
              </Link>
            </div>
          )}
      </div>
    </div>
  );
}
