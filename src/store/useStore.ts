import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { Theme } from '@/design/theme';

type State = {
  theme: Theme;
  toggleTheme: () => void;
};

export const useStore = create<State>()(
  devtools(set => ({
    theme: {} as Theme, // placeholder, can be extended later
    toggleTheme: () => set(state => ({ theme: state.theme })),
  }))
);