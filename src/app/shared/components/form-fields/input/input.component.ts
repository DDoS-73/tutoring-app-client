import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss',
})
export class InputComponent {
    @Input({ required: true }) control!: FormControl;
    @Input() placeholder: string = '';
    @Input() errorMessage: string = '';
    @Input() label: string = '';
    @Input() type: string = 'text';
}
