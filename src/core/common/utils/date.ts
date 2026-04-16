import moment from 'moment';

export function formatDate(date: string | Date): string {
  return moment(date).format('MMM D, YYYY');
}

export function formatRelative(date: string | Date): string {
  return moment(date).fromNow();
}

export function formatShort(date: string | Date): string {
  return moment(date).format('MMM D');
}

export function isToday(date: string | Date): boolean {
  return moment(date).isSame(moment(), 'day');
}

export function isFuture(date: string | Date): boolean {
  return moment(date).isAfter(moment());
}
