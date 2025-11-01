import { Component, inject, input, output, viewChild } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { take } from 'rxjs';
import { DeleteMode } from '../../const/delete-mode';
import { CalendarEvent, Recurrence, RecurrenceFrequency } from '../../models/calendar-event.model';
import { EventService } from '../../services/event.service';
import { DeleteModeModalComponent } from '../delete-mode-modal/delete-mode-modal.component';
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
    });

    this.eventService.updateEventMutation.mutate({ calendarEvent }, { onSuccess: () => this.eventChanged.emit() });
  }

  protected deleteEvent() {
    const event = this.event();
    if (!event.id) return;

    if (event.recurrence.frequency === RecurrenceFrequency.NONE) {
      this._deleteEventMutation(event, DeleteMode.ALL);
      return;
    }

    const modalRef: NzModalRef<DeleteModeModalComponent, DeleteMode> = this.dialog.create({
      nzTitle: 'Видалення події',
      nzContent: DeleteModeModalComponent,
      nzFooter: null,
      nzCentered: true,
      nzWidth: '30vw',
    });
    modalRef.afterClose.pipe(take(1)).subscribe((mode) => {
      if (!mode || !event.id) return;
      this._deleteEventMutation(event, mode);
    });
  }

  private _deleteEventMutation(event: CalendarEvent, mode: DeleteMode) {
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
}
