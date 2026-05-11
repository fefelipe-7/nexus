import { colors } from './colors';
import { spacing } from './spacing';
import { radius } from './radius';
import { typography } from './typography';
import { shadows } from './shadows';

export const darkTheme = {
  colors: {
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
    ...colors,
  },
  spacing,
  radius,
  typography,
  shadows,
} as const;

export type Theme = typeof darkTheme;