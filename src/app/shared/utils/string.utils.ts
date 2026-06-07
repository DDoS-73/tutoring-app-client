export function toInitials(name: string | null | undefined): string {
  const safeName = (name || '').trim();
  const parts = safeName.split(/\s+/);
  if (parts.length === 0 || !parts[0]) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getAvatarColor(name: string | null | undefined): string {
  const colors = ['#d6c2a1', '#c99b6e', '#e8d9c5', '#b58d6a', '#cbb089'];
  const safeName = name || '';
  let hash = 0;
  for (let i = 0; i < safeName.length; i++) {
    hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}
