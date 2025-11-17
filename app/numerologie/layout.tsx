import { MainLayout } from "@/components/layout/main-layout";

export default function NumerologieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}

