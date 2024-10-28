import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Helper function to convert a string, Date, or object to a Date object.
 * This is useful in TanStack Start because currently all dates get serialized to strings.
 * @returns Date
 */
export function actualDate(dateOrString: object | Date | string): Date {
  if (typeof dateOrString === 'string') return new Date(dateOrString);
  if (typeof dateOrString === 'object') return dateOrString as Date;
  return dateOrString;
}
