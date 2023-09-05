import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateEventDialogComponent } from '../create-event-dialog/create-event-dialog.component';
import { TileData } from '../../models/TileData.model';

@Component({
  selector: 'app-calendar-body',
  templateUrl: './calendar-body.component.html',
  styleUrls: ['./calendar-body.component.scss']
})
export class CalendarBodyComponent {
  tiles = new Array(14*7);

  constructor(private dialog: MatDialog) {}

  openDialog(row: string | undefined = '', col: string | undefined = '') {
    const dialogConfig = new MatDialogConfig<TileData>();
    dialogConfig.minWidth = '100vw';
    dialogConfig.minHeight = '100vh';
    dialogConfig.data = { row, col };
    dialogConfig.autoFocus = false;
    this.dialog.open(CreateEventDialogComponent, dialogConfig);
  }

  onTileClick(event: MouseEvent) {
    const target = event.target as HTMLDivElement;
    const currentMatTile = target.closest('mat-grid-tile') as HTMLElement;
    this.openDialog(currentMatTile.dataset['row'], currentMatTile.dataset['col']);
  }

  calculateDay(index: number): number {
    return (index + 1) % 7 ? (index + 1) % 7 : 7;
  }

  calculateRow(index: number): number {
    return Math.floor((index + 8) / 7);
  }
}
