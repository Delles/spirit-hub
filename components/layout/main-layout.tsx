interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col text-foreground overflow-x-hidden selection:bg-[#9F2BFF] selection:text-white">
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Sari la conținutul principal
      </a>
      <main id="main-content" className="flex-1 w-full">
        <div className="mx-auto max-w-[1200px] p-4 md:p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
