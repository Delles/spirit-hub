import { MainLayout } from "@/components/layout/main-layout";

export default function BioritmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}

