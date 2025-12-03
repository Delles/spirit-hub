"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { ArrowRight } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { BiorhythmForm } from "@/components/bioritm/biorhythm-form";
import { BiorhythmChart } from "@/components/bioritm/biorhythm-chart";
import { BiorhythmSummary } from "@/components/bioritm/biorhythm-summary";
import { ShareButton } from "@/components/shared/share-button";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";
import { Card } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { ro } from "date-fns/locale";

interface Props {
  initialBirthDate?: string;
  initialTargetDate?: string;
}

export default function BioritmClient({ initialBirthDate, initialTargetDate }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const dateParam = searchParams.get("date");
  const targetParam = searchParams.get("target");

  // Initialize state with props if available, otherwise fall back to URL params or defaults
  const [birthDate, setBirthDate] = useState<string>(initialBirthDate || dateParam || "");
  const [targetDate, setTargetDate] = useState<string>(
    initialTargetDate || targetParam || new Date().toISOString().split("T")[0],
  );
  const [hasSubmitted, setHasSubmitted] = useState(!!(initialBirthDate || dateParam));

  // Sync state with URL params
  useEffect(() => {
    // Only update if params exist and are different from current state
    if (dateParam && dateParam !== birthDate) {
      setBirthDate(dateParam);
      setHasSubmitted(true);
    }
    if (targetParam && targetParam !== targetDate) {
      setTargetDate(targetParam);
    }
  }, [dateParam, targetParam, birthDate, targetDate]);

  const biorhythm = useQuery(
    api.biorhythm.getBiorhythm,
    hasSubmitted && birthDate ? { birthDate, targetDate } : "skip",
  );

  const handleSubmit = (birth: string, target: string) => {
    setBirthDate(birth);
    setTargetDate(target);
    setHasSubmitted(true);

    // Update URL
    const params = new URLSearchParams(searchParams);
    params.set("date", birth);
    params.set("target", target);
    router.push(`${pathname}?${params.toString()}`);
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Info Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-6 space-y-2">
            <h3 className="font-semibold text-lg text-white">Ciclu Fizic</h3>
            <p className="text-sm text-[#E0E0E0]">23 de zile</p>
            <p className="text-xs text-[#E0E0E0]/60">Energie, rezistență și vitalitate fizică</p>
          </Card>
          <Card className="p-6 space-y-2">
            <h3 className="font-semibold text-lg text-white">Ciclu Emoțional</h3>
            <p className="text-sm text-[#E0E0E0]">28 de zile</p>
            <p className="text-xs text-[#E0E0E0]/60">
              Stare de spirit, creativitate și sensibilitate
            </p>
          </Card>
          <Card className="p-6 space-y-2">
            <h3 className="font-semibold text-lg text-white">Ciclu Intelectual</h3>
            <p className="text-sm text-[#E0E0E0]">33 de zile</p>
            <p className="text-xs text-[#E0E0E0]/60">Claritate mentală, concentrare și memorie</p>
          </Card>
        </div>

        {/* Form Section */}
        <Card className="p-6 lg:p-8">
          <BiorhythmForm
            onSubmit={handleSubmit}
            isLoading={biorhythm === undefined && hasSubmitted}
          />
        </Card>

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
            <Card className="p-6 lg:p-8">
              <h2 className="text-2xl font-semibold mb-6 text-white">Graficul Bioritmului Tău</h2>
              <BiorhythmChart
                physical={biorhythm.physical}
                emotional={biorhythm.emotional}
                intellectual={biorhythm.intellectual}
                birthDate={biorhythm.birthDate}
                targetDate={biorhythm.targetDate}
              />
            </Card>

            {/* Summary */}
            <Card className="p-6 lg:p-8">
              <BiorhythmSummary
                summary={biorhythm.summary}
                physical={biorhythm.physical}
                emotional={biorhythm.emotional}
                intellectual={biorhythm.intellectual}
              />
            </Card>

            {/* Actions */}
            <Card className="flex flex-col sm:flex-row gap-4 items-center justify-between p-6">
              <div className="text-center sm:text-left">
                <h3 className="font-semibold mb-1 text-white">Distribuie rezultatul tău</h3>
                <p className="text-sm text-[#E0E0E0]">Împărtășește bioritmul tău cu prietenii</p>
              </div>
              <ShareButton
                url={shareUrl}
                title="Bioritmul meu - SpiritHub.ro"
                text={`Bioritmul meu pentru ${format(parseISO(targetDate), "d MMMM yyyy", { locale: ro })}`}
              />
            </Card>

            {/* Link to Critical Days */}
            <Link href="/bioritm/critice" className="block group" aria-label="Vezi zilele critice">
              <Card className="flex items-center justify-between p-6">
                <div>
                  <h3 className="font-semibold mb-1 text-white">Zile Critice</h3>
                  <p className="text-sm text-[#E0E0E0]">
                    Descoperă zilele când ciclurile tale trec prin zero
                  </p>
                </div>
                <ArrowRight
                  className="h-5 w-5 text-[#E0E0E0] group-hover:text-[#9F2BFF] transition-colors"
                  aria-hidden="true"
                />
              </Card>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
