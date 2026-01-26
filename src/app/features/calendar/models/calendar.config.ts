export class CalendarConfig {
  static daysOfTheWeek: string[] = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд'];

  static startHour = 7;
  static endHour = 22;
  static hoursAmount = CalendarConfig.endHour - CalendarConfig.startHour + 1;

  static hours = new Array(CalendarConfig.hoursAmount).fill(0).map((_, i) => i + CalendarConfig.startHour);
}
