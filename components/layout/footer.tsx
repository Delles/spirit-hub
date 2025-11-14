import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                SpiritHub.ro
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Platformă de numerologie, interpretare vise și bioritm pentru
              descoperirea de sine.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Instrumente</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/numerologie"
                  className="hover:text-primary transition-colors"
                >
                  Numerologie
                </Link>
              </li>
              <li>
                <Link
                  href="/vise"
                  className="hover:text-primary transition-colors"
                >
                  Interpretare Vise
                </Link>
              </li>
              <li>
                <Link
                  href="/bioritm"
                  className="hover:text-primary transition-colors"
                >
                  Bioritm
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Informații</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/confidentialitate"
                  className="hover:text-primary transition-colors"
                >
                  Confidențialitate
                </Link>
              </li>
              <li>
                <Link
                  href="/termeni"
                  className="hover:text-primary transition-colors"
                >
                  Termeni și Condiții
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Copyright & Disclaimer */}
        <div className="space-y-2 text-center text-xs text-muted-foreground">
          <p>© {currentYear} SpiritHub.ro. Toate drepturile rezervate.</p>
          <p className="max-w-3xl mx-auto">
            Disclaimer: Informațiile oferite pe acest site sunt destinate
            exclusiv scopurilor de divertisment și reflecție personală. Nu
            înlocuiesc sfatul profesional medical, psihologic sau financiar.
          </p>
        </div>
      </div>
    </footer>
  );
}
