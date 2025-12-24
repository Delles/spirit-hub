"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCw, Home } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error boundary for errors that escape the root layout.
 * NOTE: Unlike `app/error.tsx`, this file MUST render <html>/<body>.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Optional: send error to monitoring in the future
    console.error(error);
  }, [error]);

  return (
    <html lang="ro" className="dark">
      <body
        className="min-h-screen text-white flex items-center justify-center px-4"
        style={{
          backgroundImage:
            "linear-gradient(rgba(12, 11, 16, 0.7), rgba(12, 11, 16, 0.7)), url(/images/background.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[oklch(0.18_0.03_280_/_0.5)] shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_80px_rgba(159,43,255,0.15)] p-6 md:p-8 space-y-6 text-center">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15">
              <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">A apărut o eroare neașteptată</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Ne pare rău, ceva nu a funcționat corect. Poți încerca din nou sau te poți întoarce la pagina
              principală.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              type="button"
              onClick={reset}
              className="min-h-[44px] px-6 gap-2"
              aria-label="Reîncearcă încărcarea paginii"
            >
              <RotateCw className="h-4 w-4" aria-hidden="true" />
              Reîncearcă
            </Button>

            <Button type="button" variant="outline" className="min-h-[44px] px-6 gap-2" asChild>
              <Link href="/" aria-label="Înapoi la pagina principală">
                <Home className="h-4 w-4" aria-hidden="true" />
                Înapoi acasă
              </Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}



