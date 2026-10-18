export type DisplayDateError = 'date' | 'dateRange' | 'dateInvalid';

export class DateUtils {
  private static readonly DISPLAY_DATE_PATTERN = /^(\d{2})\.(\d{2})\.(\d{4})$/;
  private static readonly ISO_DATE_PREFIX = /^(\d{4})-(\d{2})-(\d{2})/;
  private static readonly DISPLAY_DATE_DIGITS = 8;
  private static readonly MIN_YEAR = 1900;
  private static readonly MAX_YEAR = 2100;

  public static isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  public static isoDateToLocal(iso: string): Date {
    const [year, month, day] = iso.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  public static startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  public static todayUtc(): Date {
    const now = new Date();
    return new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  }

  public static maskDisplayDate(raw: string): string {
    const digits = raw.replace(/\D/g, '').slice(0, DateUtils.DISPLAY_DATE_DIGITS);
    return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join('.');
  }

  public static isoToDisplay(iso: string): string | null {
    const match = DateUtils.ISO_DATE_PREFIX.exec(iso);
    return match ? `${match[3]}.${match[2]}.${match[1]}` : null;
  }

  public static displayToIso(text: string): string | null {
    const match = DateUtils.DISPLAY_DATE_PATTERN.exec(text);
    return match ? `${match[3]}-${match[2]}-${match[1]}` : null;
  }

  public static displayDateError(text: string): DisplayDateError | null {
    const match = DateUtils.DISPLAY_DATE_PATTERN.exec(text);
    if (!match) return 'date';
    const [day, month, year] = match.slice(1).map(Number);
    if (year < DateUtils.MIN_YEAR || year > DateUtils.MAX_YEAR) return 'dateRange';
    const date = new Date(year, month - 1, day);
    const exists = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    return exists ? null : 'dateInvalid';
  }
}
