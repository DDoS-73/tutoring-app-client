import { ChangeDetectionStrategy, Component, computed, input, OnInit, Signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { TimePickerComponent } from 'src/app/shared/components/time-picker/time-picker.component';
import { RECURRENCE_OPTIONS } from '../../const/recurrence.options';
import { CalendarEvent, RecurrenceFrequency } from '../../models/calendar-event.model';
import { CalendarConfig } from '../../models/calendar.config';
import { EventFormControls, RecurrenceControls } from '../../models/event-form.model';
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
    NzRadioModule,
  ],
})
export class EventFormComponent implements OnInit {
  public event = input.required<Partial<CalendarEvent>>();
  public participants = input.required<Participant[]>();

  public eventForm: FormGroup<EventFormControls> = new FormGroup({
    participant: new FormControl<string | null>(null, [Validators.required]),
    startTime: new FormControl<Date | null>(null, [Validators.required]),
    endTime: new FormControl<Date | null>(null, [Validators.required]),
    recurrence: new FormGroup<RecurrenceControls>({
      frequency: new FormControl<RecurrenceFrequency>(RecurrenceFrequency.NONE, [Validators.required]),
      interval: new FormControl<number>(1, [Validators.required]),
      endDate: new FormControl<string | null>(null),
    }),
  });

  protected readonly RECURRENCE_OPTIONS = RECURRENCE_OPTIONS;

  protected options: Signal<string[]> = computed(() => {
    return this.participants()?.map((participant) => participant.name) ?? [];
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
