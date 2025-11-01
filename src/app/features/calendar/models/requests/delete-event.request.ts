import { DeleteMode } from '../../const/delete-mode';

export interface DeleteEventRequest {
  id: string | number;
  mode: DeleteMode;
  date: Date;
}
