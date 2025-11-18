import { MainLayout } from "@/components/layout/main-layout";
import { SectionHeader } from "@/components/shared/section-header";

export default function NumerologieLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      <SectionHeader />
      {children}
    </MainLayout>
  );
}
