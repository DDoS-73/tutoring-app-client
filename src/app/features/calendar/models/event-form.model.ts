import { FormControl, FormGroup } from '@angular/forms';
import { RecurrenceFrequency } from './calendar-event.model';

export interface RecurrenceControls {
  frequency: FormControl<RecurrenceFrequency | null>;
  interval: FormControl<number | null>;
  endDate: FormControl<string | null>;
}

export interface EventFormControls {
  participant: FormControl<string | null>;
  startTime: FormControl<Date | null>;
  endTime: FormControl<Date | null>;
  recurrence: FormGroup<RecurrenceControls>;
}
