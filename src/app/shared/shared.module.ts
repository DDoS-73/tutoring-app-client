import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { MatDividerModule } from '@angular/material/divider';
import { DialogContainerComponent } from './components/dialog-container/dialog-container.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from './components/loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ToasterComponent } from './components/toaster/toaster.component';
import { GoogleBtnComponent } from './components/google-btn/google-btn.component';

@NgModule({
    declarations: [
        HeaderComponent,
        DialogContainerComponent,
        LoaderComponent,
        ToasterComponent,
        GoogleBtnComponent,
    ],
    exports: [
        HeaderComponent,
        DialogContainerComponent,
        LoaderComponent,
        ToasterComponent,
        GoogleBtnComponent,
    ],
    imports: [
        CommonModule,
        MatDividerModule,
        MatDialogModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        NgOptimizedImage,
    ],
})
export class SharedModule {}
