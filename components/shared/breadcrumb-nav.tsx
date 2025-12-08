"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { getSymbolBySlug } from "@/lib/dream-data";

interface BreadcrumbItem {
  label: string;
  href: string;
}

function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ label: "Acasă", href: "/" }];

  if (segments.length === 0) {
    return breadcrumbs;
  }

  // Map route segments to Romanian labels
  const routeLabels: Record<string, string> = {
    numerologie: "Numerologie",
    vise: "Vise",
    bioritm: "Bioritm",
    "calea-vietii": "Calea Vieții",
    "nume-destin": "Numărul Destinului",
    compatibilitate: "Compatibilitate",
    "numar-zilnic": "Numărul Zilei",
    "visul-zilei": "Visul Zilei",
    critice: "Zile Critice",
    "energia-zilei": "Energia Zilei",
  };

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Check if this is a dream symbol slug (path starts with /vise/ and has a second segment)
    let label = routeLabels[segment];

    if (!label && segments[0] === "vise" && index === 1) {
      // This is a dream symbol slug - look up the proper name
      const symbol = getSymbolBySlug(segment);
      if (symbol) {
        // Capitalize the name (first letter uppercase)
        label = symbol.name.charAt(0).toUpperCase() + symbol.name.slice(1);
      }
    }

    // Fallback to segment if no label found
    if (!label) {
      label = segment;
    }

    breadcrumbs.push({
      label,
      href: currentPath,
    });
  });

  return breadcrumbs;
}

export function BreadcrumbNav() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <div key={crumb.href} className="flex items-center gap-1.5">
              {index === 0 ? (
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href} className="flex items-center gap-1.5">
                      <Home className="h-4 w-4" />
                      <span className="sr-only">{crumb.label}</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ) : (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </>
              )}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

