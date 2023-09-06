export interface Event {
  client: {
    name: string;
    price: number;
  };
  datetime: {
    date: Date;
    start: string;
    finish: string;
  };
}
