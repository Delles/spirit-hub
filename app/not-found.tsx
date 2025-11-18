import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="ro" className="dark">
      <body className="min-h-screen bg-[#0C0B10] text-white flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[oklch(0.18_0.03_280_/_0.5)] shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_80px_rgba(159,43,255,0.15)] p-6 md:p-8 space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">Pagina nu a fost găsită</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Linkul pe care l-ai urmat nu mai există sau a fost tastat greșit. Verifică adresa sau
              alege unul dintre instrumentele principale SpiritHub.ro.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium hover:bg-white/10 transition-colors min-h-[44px]"
              aria-label="Înapoi la pagina principală"
            >
              Pagina principală
            </Link>
            <Link
              href="/numerologie"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium hover:bg-white/10 transition-colors min-h-[44px]"
            >
              Numerologie
            </Link>
            <Link
              href="/vise"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium hover:bg-white/10 transition-colors min-h-[44px]"
            >
              Interpretare vise
            </Link>
            <Link
              href="/bioritm"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium hover:bg-white/10 transition-colors min-h-[44px]"
            >
              Bioritm
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}


