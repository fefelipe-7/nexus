import { TextStyle } from 'react-native';

export const fontFamily = {
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
};

export const fontSize = {
  xs: 12,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

export const lineHeight: Record<keyof typeof fontSize, number> = {
  xs: 16,
  sm: 18,
  md: 22,
  lg: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 38,
  '4xl': 44,
  '5xl': 56,
};

export const fontWeight: Record<string, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

export const typography = {
  hero: {
    fontSize: fontSize['5xl'],
    lineHeight: lineHeight['5xl'],
    fontWeight: fontWeight.bold,
    letterSpacing: -0.5,
  } as TextStyle,

  h1: {
    fontSize: fontSize['4xl'],
    lineHeight: lineHeight['4xl'],
    fontWeight: fontWeight.bold,
    letterSpacing: -0.5,
  } as TextStyle,

  h2: {
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight['3xl'],
    fontWeight: fontWeight.semiBold,
    letterSpacing: -0.3,
  } as TextStyle,

  h3: {
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight['2xl'],
    fontWeight: fontWeight.semiBold,
    letterSpacing: -0.2,
  } as TextStyle,

  h4: {
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    fontWeight: fontWeight.semiBold,
    letterSpacing: -0.1,
  } as TextStyle,

  body: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.lg,
    fontWeight: fontWeight.regular,
  } as TextStyle,

  bodyBold: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.lg,
    fontWeight: fontWeight.semiBold,
  } as TextStyle,

  caption: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontWeight: fontWeight.medium,
  } as TextStyle,

  caption2: {
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    fontWeight: fontWeight.medium,
  } as TextStyle,
};