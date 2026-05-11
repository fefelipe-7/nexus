import { colors } from './colors';
import { spacing } from './spacing';
import { radius } from './radius';
import { typography } from './typography';
import { shadows } from './shadows';

const baseColors = {
  background: colors.base.black,
  surface: colors.neutral[900],
  surfaceSecondary: colors.neutral[950],
  surfaceElevated: colors.neutral[800],
  border: colors.neutral[800],
  borderLight: colors.glass.light,
  text: {
    primary: colors.neutral[50],
    secondary: colors.neutral[300],
    tertiary: colors.neutral[500],
    inverse: colors.base.black,
  },
};

export const darkTheme = {
  colors: {
    ...baseColors,
    ...colors,
  },
  spacing,
  radius,
  typography,
  shadows,
};

const lightBaseColors = {
  background: '#F8F8FA' as const,
  surface: '#F0F0F3' as const,
  surfaceSecondary: '#E0E1E6' as const,
  surfaceElevated: '#FFFFFF' as const,
  border: '#C5C6CE' as const,
  borderLight: colors.glass.light,
  text: {
    primary: '#1A1B23' as const,
    secondary: '#565969' as const,
    tertiary: '#6E7182' as const,
    inverse: '#FFFFFF' as const,
  },
};

export const lightTheme = {
  colors: {
    ...lightBaseColors,
    ...colors,
  },
  spacing,
  radius,
  typography,
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

export type Theme = typeof darkTheme;
