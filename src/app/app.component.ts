import { Component } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { RouterOutlet } from '@angular/router';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        SharedModule,
        CoreModule,
        RouterOutlet
    ]
})
export class AppComponent {
    title = 'Tutoring-app';
}
