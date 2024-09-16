import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ToasterData } from '../../models/toaster.model';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
    selector: 'app-toaster',
    templateUrl: './toaster.component.html',
    styleUrl: './toaster.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToasterComponent {
    constructor(@Inject(MAT_SNACK_BAR_DATA) protected data: ToasterData) {}
}
