import { describe, it, expect } from 'vitest'
import { getDistanceClient } from './utils'

describe('getDistanceClient (Haversine Formula)', () => {
  it('should return 0 for the same coordinates', () => {
    const lat = 48.8584
    const lon = 2.2945
    expect(getDistanceClient(lat, lon, lat, lon)).toBe(0)
  })

  it('should calculate the correct distance between two known points (Eiffel Tower and Louvre)', () => {
    // Eiffel Tower: 48.8584, 2.2945
    // Louvre: 48.8606, 2.3376
    // Expected distance is approximately 3150-3200 meters
    const dist = getDistanceClient(48.8584, 2.2945, 48.8606, 2.3376)
    expect(dist).toBeGreaterThan(3100)
    expect(dist).toBeLessThan(3200)
  })

  it('should return a small distance for very close points', () => {
    // Approx 1.1 meters for 0.00001 degrees latitude
    const dist = getDistanceClient(48.8584, 2.2945, 48.85841, 2.2945)
    expect(dist).toBeGreaterThan(1)
    expect(dist).toBeLessThan(1.2)
  })

  it('should handle points across the prime meridian', () => {
    const dist = getDistanceClient(51.4779, -0.0015, 51.4779, 0.0015)
    expect(dist).toBeGreaterThan(0)
    expect(dist).toBeLessThan(300) // Scientific estimate for Greenwich
  })

  it('should handle points across the equator', () => {
    const dist = getDistanceClient(-0.0001, 0, 0.0001, 0)
    expect(dist).toBeGreaterThan(20)
    expect(dist).toBeLessThan(25)
  })
})
