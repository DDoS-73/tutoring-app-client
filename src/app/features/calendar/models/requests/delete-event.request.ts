import { ChangeEventMode } from '../../const/change-event-mode';

export interface DeleteEventRequest {
  id: string | number;
  mode: ChangeEventMode;
  date: Date;
}
