import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateEventDialogComponent } from '../create-event-dialog/create-event-dialog.component';
import { TileData } from '../../models/TileData.model';
import { DateService } from '../../services/DateService/date.service';

@Component({
  selector: 'app-calendar-body',
  templateUrl: './calendar-body.component.html',
  styleUrls: ['./calendar-body.component.scss'],
})
export class CalendarBodyComponent {
  tiles = new Array(14 * 7);

  constructor(
    private dialog: MatDialog,
    private dateService: DateService
  ) {}

  openDialog(row: number, col: number) {
    const dialogConfig = new MatDialogConfig<TileData>();
    dialogConfig.minWidth = '100vw';
    dialogConfig.minHeight = '100vh';
    dialogConfig.data = { row, col };
    dialogConfig.autoFocus = false;
    this.dialog.open(CreateEventDialogComponent, dialogConfig);
  }

  calculateDay(index: number): number {
    return (index + 1) % 7 ? (index + 1) % 7 : 7;
  }

  calculateRow(index: number): number {
    return Math.floor(index / 7);
  }

  onSwipeLeft() {
    this.dateService.getNextWeek();
  }

  onSwipeRight() {
    this.dateService.getPrevWeek();
  }
}
