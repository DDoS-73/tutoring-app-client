import { Component, inject, input, output, viewChild } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalService } from 'ng-zorro-antd/modal';
import { take } from 'rxjs';
import { Option } from 'src/app/shared/models/option';
import { ChangeEventMode } from '../../const/change-event-mode';
import { DELETE_EVENT_MODE_OPTIONS } from '../../const/delete-event-mode-options';
import { UPDATE_EVENT_MODE_OPTIONS } from '../../const/update-event-mode-options';
import { CalendarEvent, Recurrence, RecurrenceFrequency } from '../../models/calendar-event.model';
import { EventService } from '../../services/event.service';
import { ChangeEventModeModalComponent } from '../change-event-mode-modal/change-event-mode-modal.component';
import { EventFormComponent } from '../event-form/event-form.component';

@Component({
  selector: 'app-update-event-modal',
  templateUrl: './update-event-modal.component.html',
  styleUrl: './update-event-modal.component.scss',
  imports: [EventFormComponent, NzButtonModule],
})
export class UpdateEventModalComponent {
  private eventForm = viewChild.required<EventFormComponent>(EventFormComponent);

  public event = input.required<CalendarEvent>();
  public eventChanged = output<void>();

  private readonly eventService = inject(EventService);
  private readonly dialog = inject(NzModalService);

  protected isUpdating = this.eventService.updateEventMutation.isPending;
  protected isDeleting = this.eventService.deleteEventMutation.isPending;
  protected participants = this.eventService.participantsQuery.data;

  protected updateEvent() {
    const { eventForm } = this.eventForm();
    const event = this.event();

    if (eventForm.invalid || !event.id) return;

    const formValue = eventForm.value;
    const participants = this.participants() ?? [];
    const participant = participants.find((participant) => participant.name === formValue.participant);

    const recurrence = new Recurrence({
      frequency: formValue.recurrence!.frequency!,
      interval: formValue.recurrence!.interval!,
      endDate: formValue.recurrence!.endDate!,
    });

    const calendarEvent = new CalendarEvent({
      startTime: formValue.startTime!,
      endTime: formValue.endTime!,
      participant: participant ?? {
        name: formValue.participant!,
      },
      id: event.id,
      recurrence,
      color: formValue.color!,
    });

    if (event.recurrence.frequency === RecurrenceFrequency.NONE) {
      this._updateEventMutation(calendarEvent, ChangeEventMode.ALL);
      return;
    }

    const modalRef = this.dialog.create<ChangeEventModeModalComponent, Option<ChangeEventMode>[], ChangeEventMode>({
      nzTitle: 'Оновлення події',
      nzContent: ChangeEventModeModalComponent,
      nzFooter: null,
      nzCentered: true,
      nzWidth: '30vw',
      nzData: UPDATE_EVENT_MODE_OPTIONS,
    });
    modalRef.afterClose.pipe(take(1)).subscribe((mode) => {
      if (!mode || !event.id) return;
      this._updateEventMutation(calendarEvent, mode);
    });
  }

  protected deleteEvent() {
    const event = this.event();
    if (!event.id) return;

    if (event.recurrence.frequency === RecurrenceFrequency.NONE) {
      this._deleteEventMutation(event, ChangeEventMode.ALL);
      return;
    }

    const modalRef = this.dialog.create<ChangeEventModeModalComponent, Option<ChangeEventMode>[], ChangeEventMode>({
      nzTitle: 'Видалення події',
      nzContent: ChangeEventModeModalComponent,
      nzFooter: null,
      nzCentered: true,
      nzWidth: '30vw',
      nzData: DELETE_EVENT_MODE_OPTIONS,
    });
    modalRef.afterClose.pipe(take(1)).subscribe((mode) => {
      if (!mode || !event.id) return;
      this._deleteEventMutation(event, mode);
    });
  }

  private _deleteEventMutation(event: CalendarEvent, mode: ChangeEventMode) {
    if (!event.id) return;

    this.eventService.deleteEventMutation.mutate(
      {
        id: event.id,
        mode,
        date: event.startTime,
      },
      {
        onSuccess: () => this.eventChanged.emit(),
      }
    );
  }

  private _updateEventMutation(calendarEvent: CalendarEvent, mode: ChangeEventMode) {
    if (!calendarEvent.id) return;

    this.eventService.updateEventMutation.mutate(
      { calendarEvent, mode, date: calendarEvent.startTime },
      { onSuccess: () => this.eventChanged.emit() }
    );
  }
}
