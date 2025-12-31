export interface Theme {
  id: string;
  name: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'default',
    name: 'Padrão',
    colors: {
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      card: '0 0% 100%',
      cardForeground: '222.2 84% 4.9%',
      popover: '0 0% 100%',
      popoverForeground: '222.2 84% 4.9%',
      primary: '222.2 47.4% 11.2%',
      primaryForeground: '210 40% 98%',
      secondary: '210 40% 96.1%',
      secondaryForeground: '222.2 47.4% 11.2%',
      muted: '210 40% 96.1%',
      mutedForeground: '215.4 16.3% 46.9%',
      accent: '210 40% 96.1%',
      accentForeground: '222.2 47.4% 11.2%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '210 40% 98%',
      border: '214.3 31.8% 91.4%',
      input: '214.3 31.8% 91.4%',
      ring: '222.2 84% 4.9%',
    },
  },
  {
    id: 'ocean',
    name: 'Oceano',
    colors: {
      background: '210 40% 98%',
      foreground: '210 60% 8%',
      card: '0 0% 100%',
      cardForeground: '210 60% 8%',
      popover: '0 0% 100%',
      popoverForeground: '210 60% 8%',
      primary: '199 89% 48%',
      primaryForeground: '0 0% 100%',
      secondary: '199 20% 92%',
      secondaryForeground: '199 89% 20%',
      muted: '199 20% 92%',
      mutedForeground: '199 15% 45%',
      accent: '199 89% 48%',
      accentForeground: '0 0% 100%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '0 0% 100%',
      border: '199 20% 85%',
      input: '199 20% 85%',
      ring: '199 89% 48%',
    },
  },
  {
    id: 'forest',
    name: 'Floresta',
    colors: {
      background: '140 20% 98%',
      foreground: '140 60% 8%',
      card: '0 0% 100%',
      cardForeground: '140 60% 8%',
      popover: '0 0% 100%',
      popoverForeground: '140 60% 8%',
      primary: '142 76% 36%',
      primaryForeground: '0 0% 100%',
      secondary: '142 20% 92%',
      secondaryForeground: '142 76% 16%',
      muted: '142 20% 92%',
      mutedForeground: '142 15% 45%',
      accent: '142 76% 36%',
      accentForeground: '0 0% 100%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '0 0% 100%',
      border: '142 20% 85%',
      input: '142 20% 85%',
      ring: '142 76% 36%',
    },
  },
  {
    id: 'sunset',
    name: 'Pôr do Sol',
    colors: {
      background: '30 40% 98%',
      foreground: '30 60% 8%',
      card: '0 0% 100%',
      cardForeground: '30 60% 8%',
      popover: '0 0% 100%',
      popoverForeground: '30 60% 8%',
      primary: '24 95% 53%',
      primaryForeground: '0 0% 100%',
      secondary: '30 20% 92%',
      secondaryForeground: '24 95% 23%',
      muted: '30 20% 92%',
      mutedForeground: '30 15% 45%',
      accent: '24 95% 53%',
      accentForeground: '0 0% 100%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '0 0% 100%',
      border: '30 20% 85%',
      input: '30 20% 85%',
      ring: '24 95% 53%',
    },
  },
  {
    id: 'midnight',
    name: 'Meia-Noite',
    colors: {
      background: '222 47% 11%',
      foreground: '210 40% 98%',
      card: '222 47% 15%',
      cardForeground: '210 40% 98%',
      popover: '222 47% 15%',
      popoverForeground: '210 40% 98%',
      primary: '217 91% 60%',
      primaryForeground: '222 47% 11%',
      secondary: '217 33% 17%',
      secondaryForeground: '210 40% 98%',
      muted: '217 33% 17%',
      mutedForeground: '215 20% 65%',
      accent: '217 33% 17%',
      accentForeground: '210 40% 98%',
      destructive: '0 63% 31%',
      destructiveForeground: '210 40% 98%',
      border: '217 33% 17%',
      input: '217 33% 17%',
      ring: '217 91% 60%',
    },
  },
];

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVar, value);
  });
  
  localStorage.setItem('nexus-theme', theme.id);
}

export function getStoredTheme(): Theme {
  const storedId = localStorage.getItem('nexus-theme');
  return themes.find(t => t.id === storedId) || themes[0];
}
