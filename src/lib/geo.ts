/**
 * Calculates the distance between two points on the Earth's surface using the Haversine formula.
 * @param lat1 Latitude of point 1 in degrees
 * @param lon1 Longitude of point 1 in degrees
 * @param lat2 Latitude of point 2 in degrees
 * @param lon2 Longitude of point 2 in degrees
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Checks if a student is within the allowed radius of a session.
 * @param studentLat 
 * @param studentLon 
 * @param sessionLat 
 * @param sessionLon 
 * @param radius 
 * @param tolerance Extra distance allowed (useful for server-side checks)
 * @returns boolean
 */
export function isWithinRange(
  studentLat: number,
  studentLon: number,
  sessionLat: number,
  sessionLon: number,
  radius: number = 100,
  tolerance: number = 0
): boolean {
  const distance = calculateDistance(studentLat, studentLon, sessionLat, sessionLon);
  return distance <= (radius + tolerance);
}
