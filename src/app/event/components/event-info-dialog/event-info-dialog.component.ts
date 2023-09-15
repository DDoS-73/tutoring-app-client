import { Component, DestroyRef, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Event } from '../../models/Event.model';
import { EventService } from '../../services/EventService/event.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-event-info-dialog',
  templateUrl: './event-info-dialog.component.html',
  styleUrls: ['./event-info-dialog.component.scss'],
})
export class EventInfoDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public event: Event,
    private eventService: EventService,
    private destroyRef: DestroyRef
  ) {}

  public changePaidStatus() {
    this.eventService
      .changePaidStatus(this.event._id || '')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        this.event = event;
      });
  }
}
