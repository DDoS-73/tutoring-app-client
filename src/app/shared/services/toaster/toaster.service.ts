import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToasterComponent } from '../../components/toaster/toaster.component';
import { ToasterData } from '../../models/toaster.model';

@Injectable({ providedIn: 'root' })
export class ToasterService {
    private duration = 1500;
    constructor(private snackbar: MatSnackBar) {}

    public success(message: string): void {
        this.snackbar.openFromComponent<ToasterComponent, ToasterData>(
            ToasterComponent,
            {
                duration: this.duration,
                panelClass: ['snackbar-success'],
                data: {
                    message,
                    icon: 'check_circle',
                },
            }
        );
    }

    public error(message: string): void {
        this.snackbar.openFromComponent<ToasterComponent, ToasterData>(
            ToasterComponent,
            {
                duration: this.duration,
                panelClass: ['snackbar-error'],
                data: {
                    message,
                    icon: 'error',
                },
            }
        );
    }
}
