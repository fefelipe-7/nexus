import { ReactNode, useEffect } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { MobileLayout } from './MobileLayout/MobileLayout';
import { DesktopLayout } from './DesktopLayout/DesktopLayout';
import { useThemeStore } from '@/state/stores/themeStore';

interface ResponsiveLayoutProps {
  children: ReactNode;
}

export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const { isMobile, isTablet } = useDeviceDetection();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  if (isMobile || isTablet) {
    return <MobileLayout>{children}</MobileLayout>;
  }

  return <DesktopLayout>{children}</DesktopLayout>;
}
