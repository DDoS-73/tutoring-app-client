export function monthRangeIso(date: Date): { from: string; to: string } {
  const year = date.getFullYear();
  const month = date.getMonth();

  const from = new Date(year, month, 1, 0, 0, 0, 0);
  const to = new Date(year, month + 1, 0, 23, 59, 59, 999);

  return { from: from.toISOString(), to: to.toISOString() };
}

export function formatMonthLabel(date: Date): string {
  const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function shiftMonth(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}
