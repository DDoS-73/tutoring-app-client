import { HOURS_AMOUNT } from './hoursAmount';

export const CALENDAR_BODY_HEIGHT = window.innerHeight - 78 - 37;
export const CELL_HEIGHT = Math.floor(CALENDAR_BODY_HEIGHT / HOURS_AMOUNT) - 1;
