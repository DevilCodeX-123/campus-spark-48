import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none ${className || ''}`}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500 hover:text-yellow-400 drop-shadow-sm" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-300 hover:text-blue-200 drop-shadow-sm" />
    </button>
  );
}
