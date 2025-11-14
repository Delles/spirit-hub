import { Header } from "./header";
import { Footer } from "./footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
