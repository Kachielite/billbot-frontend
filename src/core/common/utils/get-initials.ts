function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => (part[0] ?? '').toUpperCase())
    .join('');
}

export default getInitials;
