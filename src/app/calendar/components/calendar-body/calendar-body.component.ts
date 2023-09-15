import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateEventDialogComponent } from '../../../event/components/create-event-dialog/create-event-dialog.component';
import { TileData } from '../../models/TileData.model';
import { DateService } from '../../services/DateService/date.service';
import { CELL_HEIGHT } from '../../../shared/const/cellHeight';
import { Observable } from 'rxjs';
import { Event } from '../../../event/models/Event.model';
import { EventService } from '../../../event/services/EventService/event.service';
import { CustomMatDialogConfig } from '../../../shared/const/CustomMatDialogConfig';

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
    private eventService: EventService,
    private dateService: DateService
  ) {}

  ngOnInit() {
    this.events$ = this.eventService.events$;
  }

  openDialog(row: number, col: number) {
    const dialogConfig = new CustomMatDialogConfig<TileData>();
    dialogConfig.data = { row, col };
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
