import { FormControl } from '@angular/forms';

export interface EventFormControls {
    participant: FormControl<string | null>;
    startTime: FormControl<Date | null>;
    endTime: FormControl<Date | null>;
}
