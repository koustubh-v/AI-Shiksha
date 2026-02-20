import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  // Clean potentially messy prefixes and resolve against backend origin
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Prevent double-slashes
  return `${API_URL.replace(/\/$/, '')}${cleanPath}`;
}
