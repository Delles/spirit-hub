import Link from "next/link";

export function LegalFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/20 px-4 py-6 text-sm text-white/50">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>SpiritHub.ro oferă conținut pentru reflecție personală și divertisment.</p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Linkuri legale">
          <Link href="/ghiduri" className="hover:text-white">
            Ghiduri
          </Link>
          <Link href="/despre" className="hover:text-white">
            Despre
          </Link>
          <Link href="/confidentialitate" className="hover:text-white">
            Confidențialitate
          </Link>
          <Link href="/termeni" className="hover:text-white">
            Termeni
          </Link>
        </nav>
      </div>
    </footer>
  );
}
