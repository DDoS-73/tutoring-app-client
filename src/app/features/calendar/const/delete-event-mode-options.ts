import { Option } from '../../../shared/models/option';
import { ChangeEventMode } from './change-event-mode';

export const DELETE_EVENT_MODE_OPTIONS: Option<ChangeEventMode>[] = [
  { value: ChangeEventMode.ALL, label: 'Видалити всі' },
  { value: ChangeEventMode.SINGLE, label: 'Видалити одну' },
  { value: ChangeEventMode.FUTURE, label: 'Видалити цю і майбутні' },
];
