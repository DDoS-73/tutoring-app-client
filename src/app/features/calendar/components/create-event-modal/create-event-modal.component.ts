import { Component, inject, input, output, viewChild } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CalendarEvent } from '../../models/calendar-event.model';
import { EventService } from '../../services/event.service';
import { EventFormComponent } from '../event-form/event-form.component';

@Component({
  selector: 'app-create-event-modal',
  templateUrl: './create-event-modal.component.html',
  styleUrl: './create-event-modal.component.scss',
  imports: [EventFormComponent, NzButtonModule],
})
export class CreateEventModalComponent {
  private eventForm =
    viewChild.required<EventFormComponent>(EventFormComponent);

  public event = input.required<CalendarEvent>();
  public eventCreated = output<void>();

  private readonly eventService = inject(EventService);

  protected isCreating = this.eventService.createEventMutation.isPending;
  protected participants = this.eventService.participantsQuery.data;

  protected createEvent() {
    const { eventForm } = this.eventForm();
    if (eventForm.invalid) return;

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
    });

    this.eventService.createEventMutation.mutate(calendarEvent, {
      onSuccess: () => {
        this.eventCreated.emit();
      },
    });
  }
}
