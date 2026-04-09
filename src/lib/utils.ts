import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { calculateDistance } from "./geo"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formule de Haversine pour calculer la distance en mètres entre deux coordonnées GPS
export function getDistanceClient(lat1: number, lon1: number, lat2: number, lon2: number): number {
  return calculateDistance(lat1, lon1, lat2, lon2);
}
