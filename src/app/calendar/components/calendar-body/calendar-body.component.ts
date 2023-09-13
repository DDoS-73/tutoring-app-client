import { Component, DestroyRef, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateEventDialogComponent } from '../create-event-dialog/create-event-dialog.component';
import { TileData } from '../../models/TileData.model';
import { DateService } from '../../services/DateService/date.service';
import { CELL_HEIGHT } from '../../../shared/const/cellHeight';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { Event } from '../../models/Event.model';
import { EventService } from '../../services/EventService/event.service';

@Component({
  selector: 'app-calendar-body',
  templateUrl: './calendar-body.component.html',
  styleUrls: ['./calendar-body.component.scss'],
})
export class CalendarBodyComponent implements OnInit {
  tiles = new Array(14 * 7);
  cellHeight = CELL_HEIGHT;
  events$!: Observable<Event[]>;

  constructor(
    private dialog: MatDialog,
    private dateService: DateService,
    private eventService: EventService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.getEvents();
  }

  private getEvents() {
    this.dateService.weekDays
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(days => {
        this.events$ = this.eventService.getAllEventsByWeek(days[0]);
      });
  }

  openDialog(row: number, col: number) {
    const dialogConfig = new MatDialogConfig<TileData>();
    dialogConfig.minWidth = '100vw';
    dialogConfig.minHeight = '100vh';
    dialogConfig.data = { row, col };
    dialogConfig.autoFocus = false;
    this.dialog
      .open(CreateEventDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.getEvents();
        }
      });
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
