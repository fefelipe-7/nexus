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

  if (diffMins < 1) return 'agora mesmo';
  if (diffMins < 60) return `há ${diffMins}m`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays < 7) return `há ${diffDays}d`;
  return formatDate(date);
}

export function getMoodLabel(mood: number): string {
  if (mood >= 8) return 'Excelente';
  if (mood >= 6) return 'Bom';
  if (mood >= 4) return 'Neutro';
  if (mood >= 2) return 'Baixo';
  return 'Muito Baixo';
}

export function getEnergyLabel(energy: number): string {
  if (energy >= 8) return 'Alta';
  if (energy >= 6) return 'Boa';
  if (energy >= 4) return 'Moderada';
  if (energy >= 2) return 'Baixa';
  return 'Exausto';
}

export function getStressLabel(stress: number): string {
  if (stress >= 8) return 'Muito Alto';
  if (stress >= 6) return 'Alto';
  if (stress >= 4) return 'Moderado';
  if (stress >= 2) return 'Baixo';
  return 'Mínimo';
}
