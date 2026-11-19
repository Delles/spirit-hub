"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Calculator,
  CalendarDays,
  CheckCircle2,
  Flame,
  Gem,
  Globe,
  Heart,
  HeartHandshake,
  HelpCircle,
  Quote,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { AdSlot } from "@/components/monetization/ad-slot";
import { Markdown, MARKDOWN_COMPONENTS } from "@/components/shared/markdown";
import { ShareButton } from "@/components/shared/share-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adSlots } from "@/config/monetization";
import {
  formatRomanianCalendarDate,
  getBucharestCalendarDate,
  parseCalendarDate,
} from "@/lib/bucharest-calendar";
import {
  getPersonalYearReport,
  getQuickTargetYears,
  getRecommendedTargetYear,
  MAX_PERSONAL_YEAR,
  MIN_PERSONAL_YEAR,
} from "@/lib/personal-year";
import { cn } from "@/lib/utils";

interface FormErrors {
  birthDate?: string;
  targetYear?: string;
}

const iconMap: Record<string, LucideIcon> = {
  Flame,
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  Wind,
  Heart,
  Search,
  Gem,
  Globe,
};

function parseYearQueryParam(value: string | null): number | null {
  if (value === null || !/^\d+$/.test(value)) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < MIN_PERSONAL_YEAR || parsed > MAX_PERSONAL_YEAR) {
    return null;
  }

  return parsed;
}

function validateBirthDateInput(value: string, maxDate: Date): string | undefined {
  if (!value) {
    return "Data nașterii este obligatorie";
  }

  try {
    const parsed = parseCalendarDate(value);
    if (parsed > maxDate) {
      return "Data nașterii nu poate fi în viitor";
    }
    return undefined;
  } catch {
    return "Data nașterii este invalidă";
  }
}

export default function PersonalYearClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const todayCalendarDate = getBucharestCalendarDate();
  const todayMaxDate = useMemo(() => parseCalendarDate(todayCalendarDate), [todayCalendarDate]);
  const recommendedYear = useMemo(
    () => getRecommendedTargetYear(todayCalendarDate),
    [todayCalendarDate]
  );
  const quickYears = useMemo(
    () => getQuickTargetYears(todayCalendarDate),
    [todayCalendarDate]
  );

  const dateParam = searchParams.get("date");
  const yearParam = searchParams.get("year");

  const parsedQueryYear = parseYearQueryParam(yearParam);
  const resolvedQueryYear = yearParam === null ? recommendedYear : parsedQueryYear;
  const report =
    dateParam !== null && resolvedQueryYear !== null
      ? getPersonalYearReport(dateParam, resolvedQueryYear)
      : null;

  const hasInvalidDateParam = dateParam !== null && report === null;
  const hasInvalidYearParam = yearParam !== null && parsedQueryYear === null;

  useEffect(() => {
    if (hasInvalidDateParam || hasInvalidYearParam) {
      router.replace(pathname);
    }
  }, [hasInvalidDateParam, hasInvalidYearParam, router, pathname]);

  const [birthDate, setBirthDate] = useState("");
  const [selectedYearOption, setSelectedYearOption] = useState<string>(() =>
    String(recommendedYear)
  );
  const [customYear, setCustomYear] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [liveAnnouncement, setLiveAnnouncement] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newErrors: FormErrors = {};
    const birthDateError = validateBirthDateInput(birthDate, todayMaxDate);
    if (birthDateError) {
      newErrors.birthDate = birthDateError;
    }

    let targetYear: number | null = null;
    if (selectedYearOption === "custom") {
      const trimmed = customYear.trim();
      if (!trimmed) {
        newErrors.targetYear = "Introdu anul țintă dorit";
      } else if (!/^\d{4}$/.test(trimmed)) {
        newErrors.targetYear = `Introdu un an întreg între ${MIN_PERSONAL_YEAR} și ${MAX_PERSONAL_YEAR}`;
      } else {
        const parsed = Number(trimmed);
        if (parsed < MIN_PERSONAL_YEAR || parsed > MAX_PERSONAL_YEAR) {
          newErrors.targetYear = `Anul trebuie să fie între ${MIN_PERSONAL_YEAR} și ${MAX_PERSONAL_YEAR}`;
        } else {
          targetYear = parsed;
        }
      }
    } else {
      targetYear = parseYearQueryParam(selectedYearOption);
      if (targetYear === null) {
        newErrors.targetYear = "Selectează un an țintă valid";
      }
    }

    if (Object.keys(newErrors).length > 0 || targetYear === null) {
      setErrors(newErrors);
      setLiveAnnouncement([newErrors.birthDate, newErrors.targetYear].filter(Boolean).join(". "));
      if (newErrors.birthDate) {
        document.getElementById("personal-year-birth-date")?.focus();
      } else if (newErrors.targetYear) {
        document.getElementById("personal-year-custom-year")?.focus();
      }
      return;
    }

    setErrors({});
    setLiveAnnouncement("");
    const params = new URLSearchParams();
    params.set("date", birthDate);
    params.set("year", String(targetYear));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setBirthDate("");
    setSelectedYearOption(String(recommendedYear));
    setCustomYear("");
    setErrors({});
    setLiveAnnouncement("");
    router.push(pathname);
  };

  const shareUrl = report
    ? `https://www.spirithub.ro${pathname}?date=${encodeURIComponent(report.birthDate)}&year=${report.targetYear}`
    : `https://www.spirithub.ro${pathname}`;

  const IconComponent = report
    ? iconMap[report.interpretation.hero.icon] || Sparkles
    : Sparkles;

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
                Calculator An Personal în Numerologie
              </h1>
              <p className="text-lg text-[#E0E0E0] leading-relaxed">
                Află gratuit în ce etapă din ciclul de 9 ani te afli în {recommendedYear} sau în
                orice alt an, cu formula completă pas cu pas și interpretare în română.
              </p>
            </div>

            <Card className="mx-auto max-w-2xl p-6 md:p-8">
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
                noValidate
                aria-labelledby="an-personal-form-heading"
              >
                <div className="space-y-1">
                  <h2 id="an-personal-form-heading" className="text-xl font-semibold text-white">
                    Calculează Anul tău Personal
                  </h2>
                  <p className="text-sm text-[#E0E0E0]/75">
                    Introdu data nașterii și alege anul pe care vrei să îl analizezi.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personal-year-birth-date" className="text-white">
                    Data nașterii *
                  </Label>
                  <DatePicker
                    id="personal-year-birth-date"
                    value={birthDate}
                    onChange={(value) => {
                      setBirthDate(value || "");
                      if (errors.birthDate) {
                        setErrors((prev) => ({ ...prev, birthDate: undefined }));
                      }
                    }}
                    placeholder="Selectează data nașterii"
                    error={Boolean(errors.birthDate)}
                    maxDate={todayMaxDate}
                    aria-invalid={Boolean(errors.birthDate)}
                    aria-describedby={
                      errors.birthDate ? "personal-year-birth-date-error" : undefined
                    }
                  />
                  {errors.birthDate && (
                    <div
                      id="personal-year-birth-date-error"
                      className="flex items-center gap-2 text-sm text-destructive"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{errors.birthDate}</span>
                    </div>
                  )}
                </div>

                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium text-white">Anul țintă *</legend>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {quickYears.map((year) => {
                      const value = String(year);
                      const isChecked = selectedYearOption === value;
                      const isRecommended = year === recommendedYear;
                      return (
                        <div key={value}>
                          <input
                            type="radio"
                            id={`target-year-${value}`}
                            name="targetYearOption"
                            value={value}
                            checked={isChecked}
                            onChange={() => {
                              setSelectedYearOption(value);
                              if (errors.targetYear) {
                                setErrors((prev) => ({ ...prev, targetYear: undefined }));
                              }
                            }}
                            className="sr-only peer"
                          />
                          <label
                            htmlFor={`target-year-${value}`}
                            className={cn(
                              "flex min-h-[48px] cursor-pointer items-center justify-between gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-colors",
                              "border-white/15 bg-white/5 text-white/85 hover:border-[#9F2BFF]/50 hover:bg-white/10",
                              "peer-focus-visible:ring-2 peer-focus-visible:ring-[#9F2BFF] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#0C0B10]",
                              "peer-checked:border-[#9F2BFF] peer-checked:bg-[#9F2BFF]/20 peer-checked:text-white"
                            )}
                          >
                            <span className="flex flex-col leading-tight">
                              <span>{value}</span>
                              {isRecommended && (
                                <span className="text-[11px] font-normal text-[#A5B4FC]">
                                  Recomandat
                                </span>
                              )}
                            </span>
                            {isChecked ? (
                              <CheckCircle2
                                className="h-4 w-4 shrink-0 text-[#9F2BFF]"
                                aria-hidden="true"
                              />
                            ) : (
                              <span
                                className="h-4 w-4 shrink-0 rounded-full border border-white/30"
                                aria-hidden="true"
                              />
                            )}
                          </label>
                        </div>
                      );
                    })}

                    <div>
                      <input
                        type="radio"
                        id="target-year-custom"
                        name="targetYearOption"
                        value="custom"
                        checked={selectedYearOption === "custom"}
                        onChange={() => {
                          setSelectedYearOption("custom");
                          if (errors.targetYear) {
                            setErrors((prev) => ({ ...prev, targetYear: undefined }));
                          }
                        }}
                        className="sr-only peer"
                      />
                      <label
                        htmlFor="target-year-custom"
                        className={cn(
                          "flex min-h-[48px] cursor-pointer items-center justify-between gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-colors",
                          "border-white/15 bg-white/5 text-white/85 hover:border-[#9F2BFF]/50 hover:bg-white/10",
                          "peer-focus-visible:ring-2 peer-focus-visible:ring-[#9F2BFF] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#0C0B10]",
                          "peer-checked:border-[#9F2BFF] peer-checked:bg-[#9F2BFF]/20 peer-checked:text-white"
                        )}
                      >
                        <span>Alt an</span>
                        {selectedYearOption === "custom" ? (
                          <CheckCircle2
                            className="h-4 w-4 shrink-0 text-[#9F2BFF]"
                            aria-hidden="true"
                          />
                        ) : (
                          <span
                            className="h-4 w-4 shrink-0 rounded-full border border-white/30"
                            aria-hidden="true"
                          />
                        )}
                      </label>
                    </div>
                  </div>

                  {selectedYearOption === "custom" && (
                    <div className="space-y-2 pt-1">
                      <Label htmlFor="personal-year-custom-year" className="text-white">
                        Introdu anul dorit (între {MIN_PERSONAL_YEAR} și {MAX_PERSONAL_YEAR}) *
                      </Label>
                      <Input
                        id="personal-year-custom-year"
                        name="customYear"
                        type="text"
                        inputMode="numeric"
                        pattern="\d{4}"
                        maxLength={4}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        value={customYear}
                        onChange={(e) => {
                          setCustomYear(e.target.value);
                          if (errors.targetYear) {
                            setErrors((prev) => ({ ...prev, targetYear: undefined }));
                          }
                        }}
                        placeholder="Ex: 2028"
                        className="h-12 min-h-[48px] text-base"
                        aria-invalid={Boolean(errors.targetYear)}
                        aria-describedby={
                          errors.targetYear ? "personal-year-target-year-error" : undefined
                        }
                      />
                      {errors.targetYear && (
                        <div
                          id="personal-year-target-year-error"
                          className="flex items-center gap-2 text-sm text-destructive"
                        >
                          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span>{errors.targetYear}</span>
                        </div>
                      )}
                    </div>
                  )}
                </fieldset>

                <Button type="submit" className="h-12 min-h-[48px] w-full text-base font-medium">
                  Calculează Anul Personal
                </Button>
              </form>
            </Card>
          </>
        )}

        {report && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <Button
              variant="ghost"
              asChild
              className="gap-2 pl-0 text-white/70 transition-all hover:pl-2 hover:text-white"
            >
              <Link href="/numerologie">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Înapoi la Numerologie
              </Link>
            </Button>

            <Card className="w-full overflow-hidden border-white/10 bg-black/40 shadow-2xl ring-1 ring-white/5 backdrop-blur-xl">
              <div className="relative overflow-hidden p-8 pt-10 text-white">
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-20",
                    report.interpretation.theme.primary
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
                    <Badge className="px-3 py-1 text-xs">
                      Anul Personal {report.calculation.personalYear} în {report.targetYear}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="border-white/15 bg-white/10 px-3 py-1 text-xs text-white/90"
                    >
                      An Universal {report.targetYear}: {report.calculation.universalYear}
                    </Badge>
                  </div>

                  <div className="mb-4 flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-4xl font-bold text-white shadow-lg ring-1 ring-white/25",
                        report.interpretation.theme.primary
                      )}
                    >
                      {report.calculation.personalYear}
                    </div>
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 backdrop-blur-md"
                      style={{ backgroundColor: report.interpretation.theme.bg_soft }}
                    >
                      <IconComponent
                        size={28}
                        style={{ color: report.interpretation.theme.accent }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-white/70">
                    Data nașterii: {formatRomanianCalendarDate(report.birthDate)}
                  </p>

                  <h1 className="mb-3 bg-gradient-to-b from-white to-white/80 bg-clip-text font-heading text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
                    {report.interpretation.hero.title}
                  </h1>

                  <p className="mx-auto max-w-xl text-base italic leading-relaxed text-white/85">
                    &ldquo;{report.interpretation.hero.headline}&rdquo;
                  </p>
                </div>
              </div>

              <div className="relative z-20 space-y-8 px-6 pb-8">
                <div className="flex flex-wrap justify-center gap-2">
                  {report.interpretation.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur-sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
                    <Calculator className="h-4 w-4 text-[#9F2BFF]" aria-hidden="true" />
                    Calcul pas cu pas pentru {report.targetYear}
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border border-white/10 bg-black/25 p-3">
                      <p className="text-xs text-white/60">Ziua nașterii ({report.calculation.birthDay})</p>
                      <p className="mt-1 font-mono text-sm font-semibold text-white">
                        {report.calculation.steps.dayExpression}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/25 p-3">
                      <p className="text-xs text-white/60">Luna nașterii ({report.calculation.birthMonth})</p>
                      <p className="mt-1 font-mono text-sm font-semibold text-white">
                        {report.calculation.steps.monthExpression}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/25 p-3">
                      <p className="text-xs text-white/60">Anul țintă ({report.targetYear})</p>
                      <p className="mt-1 font-mono text-sm font-semibold text-white">
                        {report.calculation.steps.yearExpression}
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#9F2BFF]/35 bg-[#9F2BFF]/10 p-3">
                      <p className="text-xs text-[#A5B4FC]">Total An Personal</p>
                      <p className="mt-1 font-mono text-sm font-semibold text-white">
                        {report.calculation.steps.totalExpression}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none text-center sm:text-left prose-p:leading-relaxed prose-p:text-slate-300 prose-strong:font-semibold prose-strong:text-white">
                  <Markdown components={MARKDOWN_COMPONENTS}>
                    {report.interpretation.content.main_text}
                  </Markdown>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-5">
                    <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      Pe ce merită să pui accent
                    </h2>
                    <ul className="space-y-3">
                      {report.interpretation.content.dos.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/70"
                            aria-hidden="true"
                          />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-5">
                    <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-amber-400">
                      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                      Capcane de evitat
                    </h2>
                    <ul className="space-y-3">
                      {report.interpretation.content.donts.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/70"
                            aria-hidden="true"
                          />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
                  <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-indigo-300">
                    <HelpCircle className="h-4 w-4" aria-hidden="true" />
                    Întrebări de reflecție
                  </h2>
                  <ul className="space-y-2.5">
                    {report.interpretation.content.reflection_questions.map((question) => (
                      <li key={question} className="flex items-start gap-3 text-sm text-slate-200">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400/80"
                          aria-hidden="true"
                        />
                        <span className="leading-relaxed">{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center">
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 ring-1 ring-white/5">
                    <Quote className="mx-auto mb-3 h-6 w-6 text-white/25" aria-hidden="true" />
                    <p className="font-serif text-lg italic leading-relaxed text-white/90">
                      &ldquo;{report.interpretation.mantra}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-white/10 pt-6">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="flex items-center gap-2 text-base font-semibold text-white">
                      <CalendarDays className="h-4 w-4 text-[#9F2BFF]" aria-hidden="true" />
                      Ciclul tău de 9 ani
                    </h2>
                    <p className="text-xs text-[#E0E0E0]/70">
                      Alege orice an din serie pentru a vedea tema lui completă.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-9">
                    {report.cycleTimeline.map((item) => (
                      <button
                        key={item.year}
                        type="button"
                        aria-pressed={item.isSelected}
                        onClick={() => {
                          router.push(
                            `${pathname}?date=${encodeURIComponent(report.birthDate)}&year=${item.year}`
                          );
                        }}
                        className={cn(
                          "flex min-h-[48px] flex-col items-center justify-center rounded-xl border px-2 py-2.5 text-center transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9F2BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C0B10]",
                          item.isSelected
                            ? "border-[#9F2BFF] bg-[#9F2BFF]/20 text-white"
                            : "border-white/10 bg-white/[0.04] text-white/80 hover:border-[#9F2BFF]/50 hover:bg-white/10"
                        )}
                      >
                        <span className="text-xs font-medium text-white/70">{item.year}</span>
                        <span className="mt-0.5 text-lg font-bold text-white">
                          {item.personalYear}
                        </span>
                        <span className="mt-0.5 line-clamp-2 text-[10px] leading-tight text-[#A5B4FC]">
                          {item.isSelected ? "Selectat" : item.title.replace(/^Anul\s+/i, "")}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <AdSlot slotId={adSlots.resultInline} />

            <Card className="space-y-6 bg-black/40 p-6 backdrop-blur-xl">
              <div className="flex flex-col items-center justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row">
                <div className="text-center sm:text-left">
                  <h2 className="text-lg font-semibold text-white">
                    Distribuie sau verifică alt an
                  </h2>
                  <p className="text-sm text-[#E0E0E0]/80">
                    Trimite linkul cu rezultatul sau pornește un calcul nou.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <ShareButton
                    url={shareUrl}
                    title={`Anul Personal ${report.calculation.personalYear} în ${report.targetYear} - SpiritHub.ro`}
                    text={`Anul meu Personal în ${report.targetYear} este ${report.calculation.personalYear} (${report.interpretation.hero.title}) pe SpiritHub.ro`}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleReset}
                    className="min-h-[44px] gap-2"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    Calculează pentru altă dată
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href={`/numerologie/calea-vietii?date=${encodeURIComponent(report.birthDate)}`}
                  className="group"
                >
                  <Card className="h-full border-white/10 bg-black/20 p-4 transition-all duration-300 hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#9F2BFF]/40 bg-[#9F2BFF]/10">
                        <Calculator className="h-5 w-5 text-[#9F2BFF]" aria-hidden="true" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-white">Calea Vieții</h3>
                        <p className="text-xs text-[#E0E0E0]/75">
                          Vezi numărul Căii Vieții calculat pentru aceeași dată de naștere.
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>

                <Link
                  href={`/bioritm?date=${encodeURIComponent(report.birthDate)}`}
                  className="group"
                >
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
                          Verifică ciclurile fizic, emoțional și intelectual pentru data ta.
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
