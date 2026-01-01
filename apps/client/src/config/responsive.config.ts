export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const MEDIA_QUERIES = {
  xs: `(min-width: ${BREAKPOINTS.xs}px)`,
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  '2xl': `(min-width: ${BREAKPOINTS['2xl']}px)`,
  mobile: `(max-width: ${BREAKPOINTS.sm - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.md - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.md}px)`,
} as const;

export const TOUCH_TARGET_SIZE = 44; // Mínimo recomendado para touch
export const SAFE_AREA_INSET = 16; // Padding seguro em mobile

export const RESPONSIVE_SPACING = {
  mobile: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  tablet: {
    xs: 6,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },
  desktop: {
    xs: 8,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
} as const;

export const RESPONSIVE_FONT_SIZE = {
  mobile: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  },
  tablet: {
    xs: 13,
    sm: 15,
    md: 17,
    lg: 19,
    xl: 22,
  },
  desktop: {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 24,
  },
} as const;

export const GRID_COLUMNS = {
  mobile: 1,
  tablet: 2,
  desktop: 3,
} as const;

export const useResponsive = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < BREAKPOINTS.sm;
  const isTablet = typeof window !== 'undefined' && 
    window.innerWidth >= BREAKPOINTS.sm && 
    window.innerWidth < BREAKPOINTS.md;
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= BREAKPOINTS.md;

  return { isMobile, isTablet, isDesktop };
};
