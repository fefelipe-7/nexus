export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export function triggerHaptic(pattern: HapticPattern = 'light') {
  if (!('vibrate' in navigator)) {
    return;
  }

  const patterns: Record<HapticPattern, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 50,
    success: [10, 50, 10],
    warning: [20, 100, 20],
    error: [50, 100, 50, 100, 50],
  };

  try {
    navigator.vibrate(patterns[pattern]);
  } catch (error) {
    console.warn('Haptic feedback not supported:', error);
  }
}

export function isHapticSupported(): boolean {
  return 'vibrate' in navigator;
}
