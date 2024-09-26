import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-dialog-container',
    templateUrl: './dialog-container.component.html',
    styleUrls: ['./dialog-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContainerComponent {
    @Input() title: string = '';
}
