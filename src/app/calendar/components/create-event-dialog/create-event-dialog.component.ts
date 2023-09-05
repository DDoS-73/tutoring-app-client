import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TileData } from '../../models/TileData.model';
import { Event } from '../../models/Event.model';
@Component({
  selector: 'app-create-event-dialog',
  templateUrl: './create-event-dialog.component.html',
  styleUrls: ['./create-event-dialog.component.scss']
})
export class CreateEventDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<CreateEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: TileData
  ) {
    console.log(data);
  }

  close() {
    this.dialogRef.close();
  }

  createEvent(event: Event) {
    console.log(event);
  }
}
