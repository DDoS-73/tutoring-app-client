import { Client } from '../../features/calendar/models/Client.model';

export interface Event {
    _id?: string | number;
    client: Client;
    price: number;
    date: Date;
    startTime: string;
    finishTime: string;
    repeatable: boolean;
    isPaid?: boolean;
}
