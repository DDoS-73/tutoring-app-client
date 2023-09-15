import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { BodyComponent } from './components/body/body.component';
import { DialogContainerComponent } from './components/dialog-container/dialog-container.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from './components/loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    HeaderComponent,
    BodyComponent,
    DialogContainerComponent,
    LoaderComponent,
  ],
  exports: [
    HeaderComponent,
    BodyComponent,
    DialogContainerComponent,
    LoaderComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatDividerModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class SharedModule {}
