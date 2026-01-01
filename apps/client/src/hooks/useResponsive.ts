import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '@/config/responsive.config';

export function useResponsive() {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width: screenSize.width,
    height: screenSize.height,
    isMobile: screenSize.width < BREAKPOINTS.sm,
    isTablet: screenSize.width >= BREAKPOINTS.sm && screenSize.width < BREAKPOINTS.md,
    isDesktop: screenSize.width >= BREAKPOINTS.md,
    isSmallMobile: screenSize.width < 375,
    isLargeMobile: screenSize.width >= 375 && screenSize.width < BREAKPOINTS.sm,
  };
}
