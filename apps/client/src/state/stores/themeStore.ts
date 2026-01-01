import { create } from 'zustand';
import { Theme, themes, applyTheme, getStoredTheme } from '@/ui/themes/themes';

interface ThemeStore {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  currentTheme: themes[0],
  
  setTheme: (theme: Theme) => {
    applyTheme(theme);
    set({ currentTheme: theme });
  },
  
  initTheme: () => {
    const storedTheme = getStoredTheme();
    applyTheme(storedTheme);
    set({ currentTheme: storedTheme });
  },
}));
