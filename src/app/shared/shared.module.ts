import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleBtnComponent } from './components/google-btn/google-btn.component';
@NgModule({
    declarations: [GoogleBtnComponent],
    exports: [GoogleBtnComponent],
    imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage],
})
export class SharedModule {}
