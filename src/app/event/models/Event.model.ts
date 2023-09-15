import { Client } from '../../calendar/models/Client.model';

export interface Event {
  client: Client;
  price: number;
  date: Date;
  startTime: string;
  finishTime: string;
  repeatable: boolean;
}
