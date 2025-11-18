"use client";

import { BreadcrumbNav } from "./breadcrumb-nav";

export function SectionHeader() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <BreadcrumbNav />
      </div>
    </header>
  );
}

