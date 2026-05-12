import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TimePickerComponent } from 'src/app/shared/components/time-picker/time-picker.component';
import { RECURRENCE_OPTIONS } from '../../const/recurrence.options';
import { TILE_COLORS_OPTIONS } from '../../const/tile-colors.options';
import { CalendarEvent, RecurrenceFrequency } from '../../models/calendar-event.model';
import { CalendarConfig } from '../../models/calendar.config';
import { EventFormControls, RecurrenceControls } from '../../models/event-form.model';
import { Participant } from '../../models/participant.model';

function timeRangeValidator(control: AbstractControl): ValidationErrors | null {
  const startTime = control.get('startTime')?.value;
  const endTime = control.get('endTime')?.value;

  if (!startTime || !endTime) {
    return null;
  }

  return new Date(startTime) >= new Date(endTime) ? { invalidTimeRange: true } : null;
}

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
    NzSelectModule,
  ],
})
export class EventFormComponent implements OnInit {
  public event = input.required<Partial<CalendarEvent>>();
  public participants = input.required<Participant[]>();

  private readonly notificationService = inject(NzNotificationService);
  private readonly destroyRef = inject(DestroyRef);

  public eventForm: FormGroup<EventFormControls> = new FormGroup(
    {
      participant: new FormControl<string | null>(null, [Validators.required]),
      startTime: new FormControl<Date | null>(null, [Validators.required]),
      endTime: new FormControl<Date | null>(null, [Validators.required]),
      recurrence: new FormGroup<RecurrenceControls>({
        frequency: new FormControl<RecurrenceFrequency>(RecurrenceFrequency.NONE, [Validators.required]),
        interval: new FormControl<number>(1, [Validators.required]),
        endDate: new FormControl<string | null>(null),
      }),
      color: new FormControl<string | null>(null, [Validators.required]),
    },
    { validators: timeRangeValidator }
  );

  protected participantsInputValue = signal('');
  protected options: Signal<string[]> = computed(() => {
    return this.participants()?.map((participant) => participant.name) ?? [];
  });
  protected filteredOptions: Signal<string[]> = computed(() => {
    const inputValue = this.participantsInputValue();
    const options = this.options();
    return options.filter((option) => option.toLowerCase().includes(inputValue.toLowerCase()));
  });

  protected readonly CalendarConfig = CalendarConfig;
  protected readonly RECURRENCE_OPTIONS = RECURRENCE_OPTIONS;
  protected readonly TILE_COLORS_OPTIONS = TILE_COLORS_OPTIONS;

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
    const event = this.event();

    this.participantsInputValue.set(event.participant?.name ?? '');

    this.eventForm.patchValue({
      participant: event.participant?.name,
      startTime: event.startTime,
      endTime: event.endTime,
      recurrence: {
        frequency: event.recurrence?.frequency ?? RecurrenceFrequency.NONE,
      },
      color: event.color,
    });

    this.startTimeControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((startTime) => {
      if (!startTime) return;
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 50);
      this.endTimeControl.setValue(endTime);
      this.notificationService.info('Увага', 'Час закінчення встановлено на 50 хвилин після початку');
    });
  }

  public validateForm(): void {
    if (this.eventForm.errors?.['invalidTimeRange']) {
      this.notificationService.error('Помилка', 'Час закінчення повинен бути пізніше часу початку');
      return;
    }

    this.notificationService.error('Помилка', 'Заповніть всі поля');
  }

  protected onDateChange(date: Date): void {
    if (!this.startTimeControl.value || !this.endTimeControl.value) return;
    const newStartTimeDate = new Date(this.startTimeControl.value);

    newStartTimeDate.setDate(date.getDate());
    newStartTimeDate.setMonth(date.getMonth());
    newStartTimeDate.setFullYear(date.getFullYear());

    this.startTimeControl.setValue(newStartTimeDate);

    const newEndTimeDate = new Date(this.endTimeControl.value);
    newEndTimeDate.setDate(date.getDate());
    newEndTimeDate.setMonth(date.getMonth());
    newEndTimeDate.setFullYear(date.getFullYear());

    this.endTimeControl.setValue(newEndTimeDate);
  }
}
