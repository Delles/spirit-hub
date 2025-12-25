// Metadata import removed
import CaleaVietiiClient from "./client";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

import { redirect } from "next/navigation";
import { parseISO, isValid } from "date-fns";

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

/**
 * Validation helper
 */
function isDateValid(dateStr?: string): boolean {
  if (!dateStr) return true; // Optional param
  try {
    const date = parseISO(dateStr);
    return isValid(date);
  } catch {
    return false;
  }
}

export default async function CaleaVietiiPage({ searchParams }: PageProps) {
  const { date } = await searchParams;

  // Validate date param on server
  if (date && !isDateValid(date)) {
    redirect("/numerologie/calea-vietii");
  }

  return (
    <Suspense fallback={<LoadingSpinner text="Se încarcă..." />}>
      <CaleaVietiiClient />
    </Suspense>
  );
}
