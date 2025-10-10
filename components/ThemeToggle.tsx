'use client';

import { Monitor, Moon, Sun } from 'lucide-react';

import { Button } from '@/components/components/ui/button';
import { useTheme } from '@/components/theme-provider';

const NEXT_THEME: Record<'light' | 'dark' | 'system', 'light' | 'dark' | 'system'> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
};

const THEME_ICON: Record<'light' | 'dark' | 'system', React.ComponentType<{ className?: string }>> =
  {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

const THEME_LABEL: Record<'light' | 'dark' | 'system', string> = {
  light: 'Switch to dark theme',
  dark: 'Use system theme',
  system: 'Switch to light theme',
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const Icon = THEME_ICON[theme];

  const handleClick = () => {
    setTheme(NEXT_THEME[theme]);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="relative h-9 w-9"
      aria-label={THEME_LABEL[theme]}
      title={THEME_LABEL[theme]}
    >
      <Icon className="h-4 w-4" />
      <span className="sr-only">{THEME_LABEL[theme]}</span>
    </Button>
  );
}
