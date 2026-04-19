/**
 * Return a greeting string based on the provided date (or current time if omitted).
 *
 * Rules:
 * - 00:00 - 11:59 -> "Good morning"
 * - 12:00 - 16:59 -> "Good afternoon"
 * - 17:00 - 23:59 -> "Good evening"
 *
 * @param date Optional Date object. Defaults to now.
 * @returns Greeting string.
 */
export function getGreeting(date?: Date): string {
  const d = date ?? new Date();
  const hour = d.getHours();

  if (hour >= 0 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 23) return 'Good evening';
  return 'Good night';
}

/**
 * Convenience: return a greeting optionally including a person's name.
 * Example: getGreetingForName('Derrick') -> 'Good morning, Derrick'
 */
export function getGreetingForName(date?: Date): string {
  return getGreeting(date);
}
