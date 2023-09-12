import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TileData } from '../../models/TileData.model';
import { Event } from '../../models/Event.model';
import { DateService } from '../../services/DateService/date.service';
import { EventService } from '../../services/EventService/event.service';
@Component({
  selector: 'app-create-event-dialog',
  templateUrl: './create-event-dialog.component.html',
  styleUrls: ['./create-event-dialog.component.scss'],
})
export class CreateEventDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<CreateEventDialogComponent>,
    private dateService: DateService,
    private eventService: EventService,
    @Inject(MAT_DIALOG_DATA) private data: TileData
  ) {}

  initFormData: Event = {
    client: '',
    price: 0,
    date: this.dateService.getWeekDayByIndex(this.data.col - 1),
    startTime: 8 + this.data.row + ':00',
    finishTime: 8 + this.data.row + 1 + ':00',
    repeatable: false,
  };

  close() {
    this.dialogRef.close();
  }

  createEvent(event: Event) {
    this.eventService.createEvent(event).subscribe(() => this.close());
  }
}
