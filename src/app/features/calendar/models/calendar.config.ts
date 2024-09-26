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

    public readonly monthNames: string[] = [
        'Січень',
        'Лютий',
        'Березень',
        'Квітень',
        'Травень',
        'Червень',
        'Липень',
        'Серпень',
        'Вересень',
        'Жовтень',
        'Листопад',
        'Грудень',
    ];

    public readonly monthNamesInGenitiveCase: string[] = [
        'Січня',
        'Лютого',
        'Березня',
        'Квітня',
        'Травня',
        'Червня',
        'Липня',
        'Серпня',
        'Вересня',
        'Жовтня',
        'Листопада',
        'Грудня',
    ];

    public cellHeight: number = 0;
    public cellWidth: number = 0;

    public readonly hoursAmount = 24;

    constructor() {}

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
