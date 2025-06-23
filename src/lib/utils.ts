import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRoutineByIMC(bmi: number) {
  if (bmi < 18.5) return "ganar-peso";
  if (bmi < 25) return "mantenimiento";
  if (bmi < 30) return "tonificar";
  return "bajar-peso";
}
