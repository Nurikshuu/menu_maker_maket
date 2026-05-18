'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/ui.store';

/** Syncs the Zustand theme state to the <html> dark class. */
export function ThemeApplier() {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return null;
}
