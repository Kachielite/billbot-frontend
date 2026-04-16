// Mapping of non-expense activity types to emoji
// Keep this file in `core/common` so features can import the mapping via `@/` alias
export const ActivityTypeEmojiMap = {
  'pool.created': '🏁',
  'pool.settled': '✅',
  'pool.member_added': '➕',
  'pool.member_removed': '➖',
  'settlement.submitted': '💸',
  'settlement.confirmed': '✅',
  'settlement.disputed': '⚠️',
} as const;

export type ActivityTypeEmojiKey = keyof typeof ActivityTypeEmojiMap;

export function getActivityEmoji(type: string): string {
  return (ActivityTypeEmojiMap as Record<string, string>)[type] ?? '🔔';
}
