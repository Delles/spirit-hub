import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BreadcrumbSchema } from "@/components/shared/breadcrumb-schema";
import { guides } from "@/data/guides";

export const metadata: Metadata = {
  title: "Ghiduri Numerologie și Bioritm | SpiritHub.ro",
  description:
    "Ghiduri în limba română despre numerologie, calea vieții, numărul destinului, compatibilitate, bioritm și energia zilei.",
  alternates: {
    canonical: "https://www.spirithub.ro/ghiduri",
  },
};

export default function GuidesPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Acasă", url: "https://www.spirithub.ro" },
          { name: "Ghiduri" },
        ]}
      />

      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#9F2BFF]/40 bg-[#9F2BFF]/10">
            <BookOpen className="h-7 w-7 text-[#9F2BFF]" aria-hidden="true" />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-white">Ghiduri SpiritHub</h1>
          <p className="mx-auto max-w-2xl text-[#E0E0E0]">
            Explicații clare despre numerologie și bioritm, cu legături directe către
            calculatoarele gratuite.
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          {guides.map((guide) => (
            <Link key={guide.slug} href={`/ghiduri/${guide.slug}`} className="group">
              <Card className="h-full p-5 transition-all duration-300 hover:border-[#9F2BFF]/50 hover:bg-[#9F2BFF]/5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#9F2BFF]/40 bg-[#9F2BFF]/10">
                    <guide.icon className="h-5 w-5 text-[#9F2BFF]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#A5B4FC]">
                      {guide.category} · {guide.readMinutes} min
                    </p>
                    <h2 className="text-lg font-semibold leading-snug text-white">
                      {guide.title}
                    </h2>
                  </div>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-[#E0E0E0]/80">
                  {guide.description}
                </p>
                <div className="flex items-center text-sm font-medium text-[#9F2BFF]">
                  Citește ghidul
                  <ArrowLeft
                    className="ml-2 h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
