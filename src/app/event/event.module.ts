import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventFormComponent } from './components/event-form/event-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CreateEventDialogComponent } from './components/create-event-dialog/create-event-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { EventTileComponent } from './components/event-tile/event-tile.component';
import { EventInfoDialogComponent } from './components/event-info-dialog/event-info-dialog.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    EventFormComponent,
    CreateEventDialogComponent,
    EventTileComponent,
    EventInfoDialogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    MatIconModule,
    MatDialogModule,
    SharedModule,
  ],
  exports: [EventFormComponent, CreateEventDialogComponent, EventTileComponent],
})
export class EventModule {}
