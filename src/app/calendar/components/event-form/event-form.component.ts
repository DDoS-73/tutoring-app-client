import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { Event } from '../../models/Event.model';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  override getFirstDayOfWeek(): number {
    return 1;
  }
}

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  providers: [{ provide: DateAdapter, useClass: CustomDateAdapter }],
})
export class EventFormComponent implements OnInit {
  clients = ['Vlad', 'Dana', 'Katya'];
  @Input({ required: true }) initData!: Event;
  @Output() formSubmit = new EventEmitter();
  constructor(private fb: FormBuilder) {}

  eventForm!: FormGroup;

  ngOnInit() {
    this.eventForm = this.fb.group({
      client: this.fb.group({
        name: [this.initData.client.name],
      }),
      price: [],
      date: [this.initData.date],
      startTime: [this.initData.startTime],
      finishTime: [this.initData.finishTime],
      repeatable: [this.initData.repeatable],
    });
  }

  submit() {
    this.formSubmit.emit(this.eventForm.value);
  }

  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#424242',
      buttonColor: '#fff',
    },
    dial: {
      dialBackgroundColor: '#555',
    },
    clockFace: {
      clockFaceBackgroundColor: '#555',
      clockHandColor: '#9fbd90',
      clockFaceTimeInactiveColor: '#fff',
    },
  };
}
