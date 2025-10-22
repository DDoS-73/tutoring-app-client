import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  Signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { TimePickerComponent } from 'src/app/shared/components/time-picker/time-picker.component';
import { CalendarEvent } from '../../models/calendar-event.model';
import { CalendarConfig } from '../../models/calendar.config';
import { EventFormControls } from '../../models/event-form.model';
import { Participant } from '../../models/participant.model';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NzDatePickerComponent,
    NzAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    TimePickerComponent,
  ],
})
export class EventFormComponent implements OnInit {
  public event = input.required<Partial<CalendarEvent>>();
  public participants = input.required<Participant[]>();

  public eventForm: FormGroup<EventFormControls> = new FormGroup({
    participant: new FormControl<string | null>(null, [Validators.required]),
    startTime: new FormControl<Date | null>(null, [Validators.required]),
    endTime: new FormControl<Date | null>(null, [Validators.required]),
  });

  protected options: Signal<string[]> = computed(() => {
    return this.participants()?.map(participant => participant.name) ?? [];
  });

  protected readonly CalendarConfig = CalendarConfig;

  get participantControl() {
    return this.eventForm.controls['participant'];
  }

  get startTimeControl() {
    return this.eventForm.controls['startTime'];
  }

  get endTimeControl() {
    return this.eventForm.controls['endTime'];
  }

  ngOnInit(): void {
    this.eventForm.patchValue({
      participant: this.event().participant?.name,
      startTime: this.event().startTime,
      endTime: this.event().endTime,
    });
  }
}
