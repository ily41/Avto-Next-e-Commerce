import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { API_BASE_URL } from "./store/api"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fullUrl(path: string | null | undefined): string {
  if (!path) return "/logos/logo3.svg"; // Default placeholder
  if (path?.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
}

export function getRoleFromToken(token: string | undefined): string | null {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    // Based on your JWT snippet, the role is at 'role' key
    return payload.role || null;
  } catch (error) {
    return null;
  }
}

export function formatDate(date: string | number | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', options || {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(date: string | number | Date): string {
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(d).replace(',', ' •');
}
