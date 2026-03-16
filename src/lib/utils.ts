import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(t: number): string {
  const clamped = Math.max(0, t);
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  const whole = Math.floor(seconds);
  const millis = Math.round((seconds - whole) * 1000);
  return `${minutes}:${whole.toString().padStart(2, "0")}.${millis.toString().padStart(3, "0")}`;
}
