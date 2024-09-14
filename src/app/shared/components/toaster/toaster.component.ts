import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToasterData } from '../../models/toaster.model';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-toaster',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './toaster.component.html',
    styleUrl: './toaster.component.scss',
})
export class ToasterComponent {
    constructor(@Inject(MAT_SNACK_BAR_DATA) protected data: ToasterData) {}
}
