import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme } from '@/design/theme';

type ThemeMode = 'dark' | 'light';

interface AppState {
  themeMode: ThemeMode;
  isAuthenticated: boolean;
  userId: string | null;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  login: (userId: string) => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      themeMode: 'dark',
      isAuthenticated: false,
      userId: null,

      setThemeMode: (mode: ThemeMode) => {
        set({ themeMode: mode });
      },

      toggleTheme: () => {
        const currentMode = get().themeMode;
        const newMode = currentMode === 'dark' ? 'light' : 'dark';
        set({ themeMode: newMode });
      },

      login: (userId: string) => {
        set({ isAuthenticated: true, userId });
      },

      logout: () => {
        set({ isAuthenticated: false, userId: null });
      },
    }),
    {
      name: 'nexus-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        themeMode: state.themeMode,
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
      }),
    }
  )
);

// Re-export themes for direct use
export { darkTheme, lightTheme };
