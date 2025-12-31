import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function getMoodLabel(mood: number): string {
  if (mood >= 8) return 'Excellent';
  if (mood >= 6) return 'Good';
  if (mood >= 4) return 'Neutral';
  if (mood >= 2) return 'Low';
  return 'Very Low';
}

export function getEnergyLabel(energy: number): string {
  if (energy >= 8) return 'High';
  if (energy >= 6) return 'Good';
  if (energy >= 4) return 'Moderate';
  if (energy >= 2) return 'Low';
  return 'Exhausted';
}

export function getStressLabel(stress: number): string {
  if (stress >= 8) return 'Very High';
  if (stress >= 6) return 'High';
  if (stress >= 4) return 'Moderate';
  if (stress >= 2) return 'Low';
  return 'Minimal';
}
