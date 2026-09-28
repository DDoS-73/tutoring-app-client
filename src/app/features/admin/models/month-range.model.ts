export class MonthRange {
  public readonly from: string;
  public readonly to: string;
  public readonly label: string;

  constructor(private readonly anchor: Date) {
    const year = anchor.getFullYear();
    const month = anchor.getMonth();
    this.from = new Date(year, month, 1, 0, 0, 0, 0).toISOString();
    this.to = new Date(year, month + 1, 0, 23, 59, 59, 999).toISOString();
    this.label = MonthRange.formatLabel(anchor);
  }

  public static current(): MonthRange {
    return new MonthRange(new Date());
  }

  public shift(delta: number): MonthRange {
    return new MonthRange(new Date(this.anchor.getFullYear(), this.anchor.getMonth() + delta, 1));
  }

  private static formatLabel(date: Date): string {
    const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }
}
