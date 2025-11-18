import { MainLayout } from "@/components/layout/main-layout";
import { SectionHeader } from "@/components/shared/section-header";

export default function ViseLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      <SectionHeader />
      {children}
    </MainLayout>
  );
}
