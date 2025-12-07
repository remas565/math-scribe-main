import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-14 h-8 rounded-full p-1 transition-all duration-500 ease-out",
        "bg-secondary border border-border shadow-soft",
        "hover:shadow-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      )}
      aria-label="Toggle theme"
    >
      <div
        className={cn(
          "absolute top-1 w-6 h-6 rounded-full transition-all duration-500 ease-out",
          "flex items-center justify-center",
          "bg-card shadow-soft",
          isDark ? "left-7" : "left-1"
        )}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-primary" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-primary" />
        )}
      </div>
    </button>
  );
}
