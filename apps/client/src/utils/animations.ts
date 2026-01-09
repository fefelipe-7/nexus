export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

export const MOBILE_ANIMATIONS = {
  tap: 'active:scale-95 transition-transform duration-150',
  swipe: 'transition-transform duration-200',
  slide: 'animate-in slide-in-from-bottom duration-300',
  fade: 'animate-in fade-in duration-200',
} as const;

export const DESKTOP_ANIMATIONS = {
  hover: 'hover:scale-105 transition-all duration-300',
  hoverShadow: 'hover:shadow-lg transition-shadow duration-300',
  hoverTranslate: 'hover:translate-x-1 transition-transform duration-200',
  fadeIn: 'animate-in fade-in-0 zoom-in-95 duration-200',
} as const;

export function getAnimationClass(isMobile: boolean, type: 'tap' | 'hover' | 'slide' | 'fade') {
  if (isMobile) {
    switch (type) {
      case 'tap':
        return MOBILE_ANIMATIONS.tap;
      case 'slide':
        return MOBILE_ANIMATIONS.slide;
      case 'fade':
        return MOBILE_ANIMATIONS.fade;
      default:
        return '';
    }
  } else {
    switch (type) {
      case 'hover':
        return DESKTOP_ANIMATIONS.hover;
      case 'fade':
        return DESKTOP_ANIMATIONS.fadeIn;
      default:
        return '';
    }
  }
}
