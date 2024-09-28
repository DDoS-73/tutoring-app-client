import { InjectionToken } from '@angular/core';

export class CalendarConfig {
    public readonly daysOfTheWeek: string[] = [
        'пн',
        'вт',
        'ср',
        'чт',
        'пт',
        'сб',
        'нд',
    ];

    public cellHeight: number = 0;
    public cellWidth: number = 0;

    public readonly hoursAmount = 24;

    public setCellHeight(height: number) {
        this.cellHeight = height;
    }

    public setCellWidth(width: number) {
        this.cellWidth = width;
    }
}

export const CALENDAR_CONFIG_TOKEN = new InjectionToken<CalendarConfig>(
    'calendarConfig'
);
