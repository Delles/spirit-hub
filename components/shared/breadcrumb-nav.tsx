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
import { siteConfig } from "@/config/site";

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
    interpretare: "Interpretare Vis",
    critice: "Zile Critice",
  };

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = routeLabels[segment] || segment;
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

