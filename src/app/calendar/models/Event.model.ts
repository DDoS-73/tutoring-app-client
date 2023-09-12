import { Client } from './Client.model';

export interface Event {
  client: Client | string;
  price: number;
  date: Date;
  startTime: string;
  finishTime: string;
  repeatable: boolean;
}
