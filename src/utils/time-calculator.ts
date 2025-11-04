/**
 * Calculates time remaining until next horoscope
 * @param weekEnd - End date of current prediction week
 * @returns Milliseconds until next horoscope (0 if week has ended)
 */
export function calculateTimeUntilNextHoroscope(weekEnd: Date): number {
  const now = new Date();
  const endOfWeek = new Date(weekEnd);
  
  // Calculate difference in milliseconds
  const diffMs = endOfWeek.getTime() - now.getTime();
  
  // If week has already ended, return 0
  if (diffMs <= 0) {
    return 0;
  }
  
  return diffMs;
}
