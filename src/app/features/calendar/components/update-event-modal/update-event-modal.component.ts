import { Component, inject, input, output, viewChild } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CalendarEvent } from '../../models/calendar-event.model';
import { EventService } from '../../services/event.service';
import { EventFormComponent } from '../event-form/event-form.component';

@Component({
  selector: 'app-update-event-modal',
  templateUrl: './update-event-modal.component.html',
  styleUrl: './update-event-modal.component.scss',
  imports: [EventFormComponent, NzButtonModule],
})
export class UpdateEventModalComponent {
  private eventForm =
    viewChild.required<EventFormComponent>(EventFormComponent);

  public event = input.required<CalendarEvent>();
  public eventChanged = output<void>();

  private readonly eventService = inject(EventService);

  protected isUpdating = this.eventService.updateEventMutation.isPending;
  protected isDeleting = this.eventService.deleteEventMutation.isPending;
  protected participants = this.eventService.participantsQuery.data;

  protected updateEvent() {
    const { eventForm } = this.eventForm();
    const event = this.event();

    if (eventForm.invalid || !event.id) return;

    const formValue = eventForm.value;
    const participants = this.participants() ?? [];
    const participant = participants.find(
      participant => participant.name === formValue.participant
    );

    const calendarEvent = new CalendarEvent({
      startTime: formValue.startTime!,
      endTime: formValue.endTime!,
      participant: participant ?? {
        name: formValue.participant!,
      },
      id: event.id,
    });

    this.eventService.updateEventMutation.mutate(
      { calendarEvent },
      { onSuccess: () => this.eventChanged.emit() }
    );
  }

  protected deleteEvent() {
    const event = this.event();
    if (!event.id) return;
    this.eventService.deleteEventMutation.mutate(event.id, {
      onSuccess: () => this.eventChanged.emit(),
    });
  }
}
