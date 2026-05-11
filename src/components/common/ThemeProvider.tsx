import React, { createContext, useContext, ReactNode } from 'react';
import { useStore, darkTheme, lightTheme } from '@/store/useStore';

const ThemeContext = createContext<typeof darkTheme | typeof lightTheme | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeMode = useStore((state) => state.themeMode);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): typeof darkTheme | typeof lightTheme {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
