"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { DailyWidget } from "@/components/layout/daily-widget";

const slides = [
  {
    id: 1,
    title: "Numerele tale îți luminează drumul",
    description:
      "Fiecare cifră din data ta de naștere poartă o vibrație unică. SpiritHub îți arată ce spun numerele despre personalitatea și direcția ta în viață.",
    href: "/numerologie",
    type: "numerology" as const,
  },
  {
    id: 2,
    title: "Visele tale sunt mesaje de la suflet",
    description:
      "Dincolo de logică se află o lume de simboluri și mesaje. Notează-ți visele, iar SpiritHub te ajută să le înțelegi ca să-ți clarifici emoțiile și dorințele ascunse.",
    href: "/vise",
    type: "dreams" as const,
  },
  {
    id: 3,
    title: "Prinde ritmul energiei tale",
    description:
      "Corpul, mintea și emoțiile tale se mișcă în cicluri naturale. SpiritHub îți arată bioritmul, ca să știi când să acționezi, când să creezi și când să-ți oferi o pauză.",
    href: "/bioritm",
    type: "biorhythm" as const,
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const goToSlide = (index: number) => {
    if (index === currentSlide || isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setIsPaused(true); // Pause auto-rotation when user manually navigates
    setTimeout(() => setIsAnimating(false), 700);
    // Resume auto-rotation after 8 seconds of inactivity
    setTimeout(() => setIsPaused(false), 8000);
  };

  // Automatic slide rotation every 5 seconds
  useEffect(() => {
    if (isPaused || isAnimating) return;

    const autoRotate = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % slides.length;
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 700);
        return next;
      });
    }, 5000);

    return () => clearInterval(autoRotate);
  }, [isPaused, isAnimating]);

  // Keyboard navigation - only when focus is on the carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle arrow keys when not typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      if (isAnimating) return;

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentSlide((prev) => {
          const next = (prev + 1) % slides.length;
          setIsAnimating(true);
          setIsPaused(true);
          setTimeout(() => setIsAnimating(false), 700);
          setTimeout(() => setIsPaused(false), 8000);
          return next;
        });
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentSlide((prev) => {
          const next = (prev - 1 + slides.length) % slides.length;
          setIsAnimating(true);
          setIsPaused(true);
          setTimeout(() => setIsAnimating(false), 700);
          setTimeout(() => setIsPaused(false), 8000);
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAnimating]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden overflow-y-auto">
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#9F2BFF] focus:text-white focus:rounded-md focus:ring-2 focus:ring-[#9F2BFF] focus:ring-offset-2"
      >
        Sari la conținutul principal
      </a>
      {/* Main Container - Enhanced with design.json specifications */}
      <div className="flex flex-col items-center justify-start p-4 md:p-8 lg:p-16 min-h-screen">
        {/* Daily Widget Section - Above the hero slider */}
        <div className="w-full max-w-[1400px] mb-8">
          <DailyWidget />
        </div>

        {/* Hero Slider Card */}
        <div
          className="relative w-full max-w-[1400px] h-[900px] overflow-hidden"
          style={{
            backgroundImage: "url(/images/backgorund.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            backdropFilter: "blur(40px)",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 80px rgba(159, 43, 255, 0.15)",
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Header - Persistent with design.json typography */}
          <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-6 md:px-16 md:py-8">
            {/* Logo - Top Left with exact design.json specs */}
            <Link
              href="/"
              className="text-white hover:opacity-80 transition-opacity duration-300"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "18px",
                letterSpacing: "0.5px",
              }}
            >
              SpiritHub.ro
            </Link>

            {/* Hamburger Menu - Top Right */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:opacity-80 transition-opacity duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9F2BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-md"
              aria-label={mobileMenuOpen ? "Închide meniul" : "Deschide meniul"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </header>

          {/* Mobile Menu Overlay - Enhanced */}
          {mobileMenuOpen && (
            <div
              id="mobile-menu"
              className="absolute inset-0 z-50 flex items-center justify-center animate-fade-in"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(26, 24, 34, 0.98) 0%, rgba(12, 11, 16, 0.98) 100%)",
                backdropFilter: "blur(20px)",
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-menu-title"
            >
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-8 right-8 text-white hover:text-[#9F2BFF] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9F2BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-md"
                aria-label="Închide meniul"
              >
                <span className="text-4xl font-light" aria-hidden="true">
                  ×
                </span>
              </button>
              <nav className="flex flex-col items-center gap-8" aria-label="Navigare principală">
                <h2 id="mobile-menu-title" className="sr-only">
                  Meniul principal
                </h2>
                <Link
                  href="/numerologie"
                  className="text-white hover:text-[#9F2BFF] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9F2BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-md px-4 py-2 min-h-[44px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "24px",
                    letterSpacing: "0.5px",
                  }}
                >
                  Numerologie
                </Link>
                <Link
                  href="/vise"
                  className="text-white hover:text-[#9F2BFF] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9F2BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-md px-4 py-2 min-h-[44px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "24px",
                    letterSpacing: "0.5px",
                  }}
                >
                  Interpretare Vise
                </Link>
                <Link
                  href="/bioritm"
                  className="text-white hover:text-[#9F2BFF] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9F2BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-md px-4 py-2 min-h-[44px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "24px",
                    letterSpacing: "0.5px",
                  }}
                >
                  Bioritm
                </Link>
              </nav>
            </div>
          )}

          {/* Footer - Persistent with design.json styling */}
          <footer className="absolute bottom-0 left-0 z-40 px-8 py-6 md:px-16 md:py-8">
            <div
              className="flex gap-8"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                color: "#8A8A8A",
              }}
            >
              <Link
                href="/termeni"
                className="hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9F2BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-md px-2 py-1 min-h-[44px] flex items-center"
                style={{
                  textDecoration: "none",
                }}
              >
                Termeni
              </Link>
              <Link
                href="/confidentialitate"
                className="hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9F2BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-md px-2 py-1 min-h-[44px] flex items-center"
                style={{
                  textDecoration: "none",
                }}
              >
                Confidențialitate
              </Link>
            </div>
          </footer>

          {/* Slide Content - Enhanced with design.json spacing */}
          <main
            id="main-content"
            className="absolute inset-0 flex items-center justify-center px-6 md:px-16 lg:px-20 py-24"
          >
            <div className="w-full h-full flex items-center max-w-[1200px]">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 w-full h-full items-center">
                {/* Left Column - Text Content (40%) with design.json typography */}
                <div className="lg:col-span-2 space-y-8">
                  <div
                    key={`text-${currentSlide}`}
                    className="space-y-8 transition-opacity duration-500"
                  >
                    <h1
                      className="mb-4"
                      style={{
                        color: "#FFFFFF",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                        fontSize: "clamp(32px, 5vw, 64px)",
                        letterSpacing: "-0.5px",
                        lineHeight: "1.2",
                      }}
                    >
                      {slides[currentSlide].title}
                    </h1>

                    <p
                      className="mb-8"
                      style={{
                        color: "#D0D0D0",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 400,
                        fontSize: "18px",
                        lineHeight: "1.6",
                        letterSpacing: "0.2px",
                      }}
                    >
                      {slides[currentSlide].description}
                    </p>

                    <Link
                      href={slides[currentSlide].href}
                      className="inline-block px-10 py-4 rounded-full font-medium text-white transition-all duration-300 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9F2BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent min-h-[44px] flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, #9F2BFF 0%, #4D5FFF 100%)",
                        boxShadow: "0 8px 32px rgba(159, 43, 255, 0.4)",
                        fontSize: "16px",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        letterSpacing: "0.3px",
                      }}
                    >
                      Explorează acum
                    </Link>
                  </div>
                </div>

                {/* Right Column - Graphic (60%) */}
                <div className="lg:col-span-3 h-[400px] lg:h-full flex items-center justify-center">
                  <div
                    key={`graphic-${currentSlide}`}
                    className="w-full h-full flex items-center justify-center transition-opacity duration-500"
                  >
                    {slides[currentSlide].type === "numerology" && <NumerologyGraphic />}
                    {slides[currentSlide].type === "dreams" && <DreamsGraphic />}
                    {slides[currentSlide].type === "biorhythm" && <BiorhythmGraphic />}
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Slider Navigation - Right Side (GalaxyLine style) */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-8 pointer-events-auto"
              role="group"
              aria-label="Navigare slide-uri"
            >
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  disabled={isAnimating}
                  className="flex flex-col items-center gap-3 group disabled:opacity-50 relative min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9F2BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-md"
                  aria-label={`Slide ${index + 1} din ${slides.length}: ${slide.title}`}
                  aria-current={index === currentSlide ? "true" : "false"}
                >
                  {/* Horizontal line above (only visible for current slide) */}
                  <div
                    className={`w-8 h-[1px] transition-all duration-300 ${
                      index === currentSlide ? "bg-white opacity-100" : "bg-transparent opacity-0"
                    }`}
                  />

                  {/* Slide number */}
                  <span
                    className={`font-mono transition-all duration-300 ${
                      index === currentSlide ? "text-white text-base" : "text-[#8A8A8A] text-sm"
                    } group-hover:text-white`}
                    style={{
                      fontWeight: 400,
                      letterSpacing: "0.5px",
                    }}
                  >
                    0{slide.id}
                  </span>

                  {/* Horizontal line below (only visible for current slide) */}
                  <div
                    className={`w-8 h-[1px] transition-all duration-300 ${
                      index === currentSlide ? "bg-white opacity-100" : "bg-transparent opacity-0"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Slide 1: Numerology Graphic
function NumerologyGraphic() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="relative w-full max-w-[600px] aspect-square flex items-center justify-center overflow-hidden"
        style={{
          borderRadius: "50%",
        }}
      >
        {/* Image with blend mode */}
        <Image
          src="/images/numerology.png"
          alt="Numerology Wheel - Descoperă-ți numărul destinului"
          width={600}
          height={600}
          className="w-full h-auto object-contain"
          style={{
            mixBlendMode: "screen",
            opacity: 0.9,
            filter: "brightness(1.1) contrast(1.05)",
          }}
          priority
        />
        {/* Aggressive radial gradient overlay to completely dissolve edges */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "radial-gradient(circle at center, transparent 0%, transparent 35%, rgba(26, 24, 34, 0.3) 55%, rgba(26, 24, 34, 0.7) 75%, rgba(12, 11, 16, 0.95) 90%, #0C0B10 100%)",
          }}
        />
      </div>
    </div>
  );
}

// Slide 2: Dreams Graphic
function DreamsGraphic() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="relative w-full max-w-[600px] aspect-square flex items-center justify-center overflow-hidden"
        style={{
          borderRadius: "50%",
        }}
      >
        {/* Image with blend mode */}
        <Image
          src="/images/dreams.png"
          alt="Dream Symbols - Interpretează-ți visele"
          width={600}
          height={600}
          className="w-full h-auto object-contain"
          style={{
            mixBlendMode: "screen",
            opacity: 0.9,
            filter: "brightness(1.1) contrast(1.05)",
          }}
        />
        {/* Aggressive radial gradient overlay to completely dissolve edges */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "radial-gradient(circle at center, transparent 0%, transparent 35%, rgba(26, 24, 34, 0.3) 55%, rgba(26, 24, 34, 0.7) 75%, rgba(12, 11, 16, 0.95) 90%, #0C0B10 100%)",
          }}
        />
      </div>
    </div>
  );
}

// Slide 3: Biorhythm Graphic
function BiorhythmGraphic() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="relative max-w-[600px] aspect-square flex items-center justify-center overflow-hidden"
        style={{
          borderRadius: "50%",
        }}
      >
        {/* Image with blend mode */}
        <Image
          src="/images/biorhythm.png"
          alt="Biorhythm Cycles - Sincronizează-te cu ritmurile vieții"
          width={600}
          height={600}
          className="w-full h-auto object-contain"
          style={{
            mixBlendMode: "screen",
            opacity: 0.9,
            filter: "brightness(1.1) contrast(1.05)",
          }}
        />
        {/* Aggressive radial gradient overlay to completely dissolve edges */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "radial-gradient(circle at center, transparent 0%, transparent 35%, rgba(26, 24, 34, 0.3) 55%, rgba(26, 24, 34, 0.7) 75%, rgba(12, 11, 16, 0.95) 90%, #0C0B10 100%)",
          }}
        />
      </div>
    </div>
  );
}
