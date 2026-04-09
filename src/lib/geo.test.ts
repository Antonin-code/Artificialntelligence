import { describe, it, expect } from 'vitest'
import { calculateDistance, isWithinRange } from './geo'

describe('Geolocation Logic (geo.ts)', () => {
  describe('calculateDistance', () => {
    it('should return 0 for the same point', () => {
      const lat = 48.8584
      const lon = 2.2945
      expect(calculateDistance(lat, lon, lat, lon)).toBe(0)
    })

    it('should calculate accurate distance between two points', () => {
      // Eiffel Tower to Louvre (approx 3.16km)
      const dist = calculateDistance(48.8584, 2.2945, 48.8606, 2.3376)
      expect(dist).toBeGreaterThan(3100)
      expect(dist).toBeLessThan(3250)
    })
  })

  describe('isWithinRange', () => {
    const sessionLat = 48.8584
    const sessionLon = 2.2945
    const radius = 100

    it('should return true if student is exactly at session location', () => {
      expect(isWithinRange(sessionLat, sessionLon, sessionLat, sessionLon, radius)).toBe(true)
    })

    it('should return true if student is inside the radius', () => {
      // Approx 50m away
      expect(isWithinRange(48.8584, 2.2952, sessionLat, sessionLon, radius)).toBe(true)
    })

    it('should return false if student is outside the radius', () => {
      // Approx 200m away
      expect(isWithinRange(48.8584, 2.2975, sessionLat, sessionLon, radius)).toBe(false)
    })

    it('should return true if student is slightly outside but within tolerance', () => {
      // Approx 105m away
      const farLat = 48.8584
      const farLon = 2.2960 // Dist ~110m
      // Verification with 10m tolerance (100 + 10 = 110)
      // Let's pick a more precise point for 105m
      // 0.001 lon at 48.8 lat is ~73m. So 0.0014 lon is ~102m.
      expect(isWithinRange(48.8584, 2.2945 + 0.0014, sessionLat, sessionLon, 100, 10)).toBe(true)
    })

    it('should return false if student is outside even with tolerance', () => {
      // Approx 150m away
      expect(isWithinRange(48.8584, 2.2966, sessionLat, sessionLon, 100, 10)).toBe(false)
    })
  })
})
