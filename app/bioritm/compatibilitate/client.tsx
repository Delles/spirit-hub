"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Heart,
  RotateCcw,
  Users,
} from "lucide-react";
import { AdSlot } from "@/components/monetization/ad-slot";
import { ShareButton } from "@/components/shared/share-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { adSlots } from "@/config/monetization";
import { getBiorhythmCompatibilityResult } from "@/lib/biorhythm-compatibility";
import {
  formatRomanianCalendarDate,
  getBucharestCalendarDate,
  parseCalendarDate,
} from "@/lib/bucharest-calendar";

interface FormErrors {
  date1?: string;
  date2?: string;
}

function formatRomanianDaysCount(days: number): string {
  if (days === 1) return "1 zi";
  const remainder = days % 100;
  if (days === 0 || (remainder >= 1 && remainder <= 19)) {
    return `${days} zile`;
  }
  return `${days} de zile`;
}

function validateBirthDateInput(value: string, label: string, maxDate: Date): string | undefined {
  if (!value) {
    return `${label} este obligatorie`;
  }

  try {
    const parsed = parseCalendarDate(value);
    if (parsed > maxDate) {
      return `${label} nu poate fi în viitor`;
    }
    return undefined;
  } catch {
    return `${label} este invalidă`;
  }
}

export default function BiorhythmCompatibilityClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const date1Param = searchParams.get("date1");
  const date2Param = searchParams.get("date2");

  const hasAnyParams = date1Param !== null || date2Param !== null;
  const report =
    date1Param && date2Param
      ? getBiorhythmCompatibilityResult(date1Param, date2Param)
      : null;

  useEffect(() => {
    if (hasAnyParams && report === null) {
      router.replace(pathname);
    }
  }, [hasAnyParams, report, router, pathname]);

  const todayMaxDate = useMemo(() => parseCalendarDate(getBucharestCalendarDate()), []);

  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [liveAnnouncement, setLiveAnnouncement] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newErrors: FormErrors = {};
    const err1 = validateBirthDateInput(date1, "Prima dată de naștere", todayMaxDate);
    if (err1) newErrors.date1 = err1;

    const err2 = validateBirthDateInput(date2, "A doua dată de naștere", todayMaxDate);
    if (err2) newErrors.date2 = err2;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLiveAnnouncement([newErrors.date1, newErrors.date2].filter(Boolean).join(". "));
      const firstInvalidId = newErrors.date1 ? "compat-date1" : "compat-date2";
      document.getElementById(firstInvalidId)?.focus();
      return;
    }

    setErrors({});
    setLiveAnnouncement("");
    const params = new URLSearchParams();
    params.set("date1", date1);
    params.set("date2", date2);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setDate1("");
    setDate2("");
    setErrors({});
    setLiveAnnouncement("");
    router.push(pathname);
  };

  const shareUrl =
    date1Param && date2Param
      ? `https://www.spirithub.ro${pathname}?date1=${encodeURIComponent(date1Param)}&date2=${encodeURIComponent(date2Param)}`
      : `https://www.spirithub.ro${pathname}`;

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div aria-live="polite" className="sr-only">
          {liveAnnouncement}
        </div>

        {!report && (
          <>
            <div className="space-y-4 text-center">
              <h1 className="text-3xl font-bold text-white">
                Calculator Compatibilitate Bioritm
              </h1>
              <p className="text-lg text-[#E0E0E0] leading-relaxed">
                Compară două date de naștere pentru a vedea sincronizarea simbolică a ciclurilor
                fizic, emoțional și intelectual. Gratuit, rapid și fără cont.
              </p>
            </div>

            <Card className="mx-auto max-w-2xl p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#9F2BFF]/40 bg-[#9F2BFF]/20">
                      <Calendar className="h-4 w-4 text-[#9F2BFF]" aria-hidden="true" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">Persoana 1</h2>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="compat-date1" className="text-white">
                      Prima dată de naștere *
                    </Label>
                    <DatePicker
                      id="compat-date1"
                      value={date1}
                      onChange={(value) => {
                        setDate1(value || "");
                        if (errors.date1) {
                          setErrors((prev) => ({ ...prev, date1: undefined }));
                        }
                      }}
                      placeholder="Selectează prima dată de naștere"
                      error={!!errors.date1}
                      maxDate={todayMaxDate}
                      aria-invalid={!!errors.date1}
                      aria-describedby={errors.date1 ? "compat-date1-error" : undefined}
                    />
                    {errors.date1 && (
                      <div
                        id="compat-date1-error"
                        className="flex items-center gap-2 text-sm text-destructive"
                        role="alert"
                      >
                        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{errors.date1}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#4D5FFF]/40 bg-[#4D5FFF]/20">
                      <Users className="h-4 w-4 text-[#4D5FFF]" aria-hidden="true" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">Persoana 2</h2>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="compat-date2" className="text-white">
                      A doua dată de naștere *
                    </Label>
                    <DatePicker
                      id="compat-date2"
                      value={date2}
                      onChange={(value) => {
                        setDate2(value || "");
                        if (errors.date2) {
                          setErrors((prev) => ({ ...prev, date2: undefined }));
                        }
                      }}
                      placeholder="Selectează a doua dată de naștere"
                      error={!!errors.date2}
                      maxDate={todayMaxDate}
                      aria-invalid={!!errors.date2}
                      aria-describedby={errors.date2 ? "compat-date2-error" : undefined}
                    />
                    {errors.date2 && (
                      <div
                        id="compat-date2-error"
                        className="flex items-center gap-2 text-sm text-destructive"
                        role="alert"
                      >
                        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{errors.date2}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" className="h-11 min-h-[44px] w-full text-base font-medium">
                  Calculează Compatibilitatea Bioritmului
                </Button>
              </form>
            </Card>
          </>
        )}

        {report && date1Param && date2Param && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <Link href="/bioritm" className="inline-block">
              <Button
                variant="ghost"
                className="gap-2 pl-0 text-white/70 transition-all hover:pl-2 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Înapoi la Bioritm
              </Button>
            </Link>

            <Card className="space-y-6 bg-black/40 p-6 backdrop-blur-xl sm:p-8">
              <div className="flex flex-col items-center space-y-4 text-center">
                <Badge className="px-3 py-1 text-xs">{report.title}</Badge>
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-4 border-[#9F2BFF]/40 bg-[#9F2BFF]/10 shadow-inner">
                  <span className="text-4xl font-bold text-white">{report.overallScore}%</span>
                  <span className="mt-1 text-[10px] uppercase tracking-widest text-white/60">
                    Sincronizare
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-white">
                  Compatibilitate Bioritm: {report.overallScore}%
                </h1>
                <p className="text-sm text-[#A5B4FC]">
                  {formatRomanianCalendarDate(date1Param)} și{" "}
                  {formatRomanianCalendarDate(date2Param)} (diferență de{" "}
                  {formatRomanianDaysCount(report.daysApart)})
                </p>
                <p className="max-w-2xl text-base leading-relaxed text-[#E0E0E0]">
                  {report.summary}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {report.cycles.map((item) => (
                  <div
                    key={item.cycle}
                    className="space-y-3 rounded-xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h2 className="text-base font-semibold text-white">{item.label}</h2>
                        <p className="text-xs text-white/60">
                          Ciclu de {formatRomanianDaysCount(item.cycleDays)}
                        </p>
                      </div>
                      <span className="text-xl font-bold text-white">{item.score}%</span>
                    </div>

                    <progress
                      className="compat-progress h-2.5 w-full"
                      value={item.score}
                      max={100}
                      style={{ "--progress-bar-fill": item.color } as React.CSSProperties}
                      aria-label={`Sincronizare ${item.label.toLowerCase()}: ${item.score}%`}
                    />

                    <p className="text-sm leading-relaxed text-[#E0E0E0]/85">{item.summary}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-white">
                  <CheckCircle2 className="h-4 w-4 text-[#9F2BFF]" aria-hidden="true" />
                  Cum să folosiți acest rezultat
                </h2>
                <ul className="space-y-2 text-sm leading-relaxed text-[#E0E0E0]/85">
                  {report.guidance.map((tip) => (
                    <li key={tip} className="flex items-start gap-2.5">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9F2BFF]"
                        aria-hidden="true"
                      />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            <AdSlot slotId={adSlots.resultInline} />

            <Card className="space-y-6 bg-black/40 p-6 backdrop-blur-xl">
              <div className="flex flex-col items-center justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row">
                <div className="text-center sm:text-left">
                  <h2 className="text-lg font-semibold text-white">
                    Distribuie sau compară alte date
                  </h2>
                  <p className="text-sm text-[#E0E0E0]/80">
                    Trimite linkul cu rezultatul sau pornește un calcul nou.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <ShareButton
                    url={shareUrl}
                    title={`Compatibilitate Bioritm: ${report.overallScore}% - SpiritHub.ro`}
                    text={`Sincronizarea bioritmului este ${report.overallScore}% (${report.title}) pe SpiritHub.ro`}
                  />
                  <Button variant="secondary" onClick={handleReset} className="min-h-[44px] gap-2">
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    Calculează pentru alte date
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Link href="/numerologie/compatibilitate" className="group">
                  <Card className="h-full border-white/10 bg-black/20 p-4 transition-all duration-300 hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#9F2BFF]/40 bg-[#9F2BFF]/10">
                        <Heart className="h-5 w-5 text-[#9F2BFF]" aria-hidden="true" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-white">
                          Compatibilitate Numerologică
                        </h3>
                        <p className="text-xs text-[#E0E0E0]/75">
                          Compară și Calea Vieții și Numărul Destinului din nume și data nașterii.
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>

                <Link href="/bioritm" className="group">
                  <Card className="h-full border-white/10 bg-black/20 p-4 transition-all duration-300 hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#4D5FFF]/40 bg-[#4D5FFF]/10">
                        <Activity className="h-5 w-5 text-[#4D5FFF]" aria-hidden="true" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-white">
                          Calculator Bioritm Personal
                        </h3>
                        <p className="text-xs text-[#E0E0E0]/75">
                          Vezi graficul zilnic și prognoza pe 7 zile pentru fiecare persoană.
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
