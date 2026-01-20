import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

interface DeviceDetection {
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  hasHoverCapability: boolean;
  orientation: Orientation;
  viewport: {
    width: number;
    height: number;
  };
}

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
} as const;

export function useDeviceDetection(): DeviceDetection {
  const [detection, setDetection] = useState<DeviceDetection>(() => {
    if (typeof window === 'undefined') {
      return {
        deviceType: 'desktop',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouchDevice: false,
        hasHoverCapability: true,
        orientation: 'landscape',
        viewport: { width: 1920, height: 1080 },
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasHoverCapability = window.matchMedia('(hover: hover)').matches;

    let deviceType: DeviceType = 'desktop';
    if (width < BREAKPOINTS.mobile) {
      deviceType = 'mobile';
    } else if (width < BREAKPOINTS.tablet) {
      deviceType = 'tablet';
    }

    return {
      deviceType,
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'desktop',
      isTouchDevice,
      hasHoverCapability,
      orientation: width > height ? 'landscape' : 'portrait',
      viewport: { width, height },
    };
  });

  useEffect(() => {
    const updateDetection = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const hasHoverCapability = window.matchMedia('(hover: hover)').matches;

      let deviceType: DeviceType = 'desktop';
      if (width < BREAKPOINTS.mobile) {
        deviceType = 'mobile';
      } else if (width < BREAKPOINTS.tablet) {
        deviceType = 'tablet';
      }

      setDetection({
        deviceType,
        isMobile: deviceType === 'mobile',
        isTablet: deviceType === 'tablet',
        isDesktop: deviceType === 'desktop',
        isTouchDevice,
        hasHoverCapability,
        orientation: width > height ? 'landscape' : 'portrait',
        viewport: { width, height },
      });
    };

    let timeoutId: any;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDetection, 150);
    };

    window.addEventListener('resize', debouncedUpdate);
    window.addEventListener('orientationchange', updateDetection);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedUpdate);
      window.removeEventListener('orientationchange', updateDetection);
    };
  }, []);

  return detection;
}
