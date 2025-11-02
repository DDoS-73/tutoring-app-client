import { Option } from 'src/app/shared/models/option';
import { ChangeEventMode } from './change-event-mode';

export const UPDATE_EVENT_MODE_OPTIONS: Option<ChangeEventMode>[] = [
  { value: ChangeEventMode.ALL, label: 'Змінити всі' },
  { value: ChangeEventMode.SINGLE, label: 'Змінити одну' },
  { value: ChangeEventMode.FUTURE, label: 'Змінити цю і майбутні' },
];
