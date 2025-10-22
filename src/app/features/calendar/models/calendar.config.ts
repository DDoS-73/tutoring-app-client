export class CalendarConfig {
    static daysOfTheWeek: string[] = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд'];

    static hoursAmount = 15;
    static hoursOffset = 8;

    static hours = new Array(CalendarConfig.hoursAmount)
        .fill(0)
        .map((_, i) => i + CalendarConfig.hoursOffset);

    static disabledHours = (): number[] => {
        return Array.from(
            { length: CalendarConfig.hoursOffset },
            (_, i) => i
        ).concat(
            Array.from(
                {
                    length:
                        24 -
                        (CalendarConfig.hoursOffset +
                            CalendarConfig.hoursAmount),
                },
                (_, i) =>
                    i + CalendarConfig.hoursOffset + CalendarConfig.hoursAmount
            )
        );
    };
}
