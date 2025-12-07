import { ThemeToggle } from './ThemeToggle';
import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-border/50">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-lavender to-soft-blue shadow-soft">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">Math OCR </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Printed Math → LaTeX Magic</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
