import { Component, EventEmitter, Injectable, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter  {
  override getFirstDayOfWeek(): number {
    return 1;
  }
}

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  providers:[{ provide: DateAdapter, useClass: CustomDateAdapter}]
})
export class EventFormComponent {
  clients = ['Vlad', 'Dana', 'Katya'];
  @Output() formSubmit = new EventEmitter();
  constructor(private fb: FormBuilder) {}

  eventForm = this.fb.group({
    client: this.fb.group({
      name: [''],
      price: ['']
    }),
    datetime: this.fb.group({
      date: [new Date()],
      start: ['18:00'],
      finish: ['19:00']
    })
  })

  submit() {
    this.formSubmit.emit(this.eventForm.value);
  }

  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#424242',
      buttonColor: '#fff'
    },
    dial: {
      dialBackgroundColor: '#555',
    },
    clockFace: {
      clockFaceBackgroundColor: '#555',
      clockHandColor: '#9fbd90',
      clockFaceTimeInactiveColor: '#fff'
    }
  };
}
