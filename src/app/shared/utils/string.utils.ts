export class StringUtils {
  private static readonly AVATAR_COLORS = ['#d6c2a1', '#c99b6e', '#e8d9c5', '#b58d6a', '#cbb089'];

  public static toInitials(name: string | null | undefined): string {
    const safeName = (name || '').trim();
    const parts = safeName.split(/\s+/);
    if (parts.length === 0 || !parts[0]) return '?';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  public static capitalizeFirst(value: string): string {
    return value.charAt(0).toLocaleUpperCase('uk') + value.slice(1);
  }

  public static emptyToNull(value: string): string | null {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }

  public static avatarColor(name: string | null | undefined): string {
    const safeName = name || '';
    let hash = 0;
    for (let i = 0; i < safeName.length; i++) {
      hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = StringUtils.AVATAR_COLORS;
    return colors[Math.abs(hash) % colors.length];
  }
}
