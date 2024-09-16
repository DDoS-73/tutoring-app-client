import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-google-btn',
    templateUrl: './google-btn.component.html',
    styleUrl: './google-btn.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleBtnComponent {}
