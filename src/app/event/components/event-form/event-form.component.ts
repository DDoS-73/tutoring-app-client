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
import { EventService } from '../../services/EventService/event.service';
import { Observable } from 'rxjs';
import { Client } from '../../../calendar/models/Client.model';

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
  clients$!: Observable<Client[]>;
  @Input({ required: true }) initData!: Event;
  @Output() formSubmit = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private eventService: EventService
  ) {}

  eventForm!: FormGroup;

  ngOnInit() {
    this.eventForm = this.fb.group({
      client: this.initData.client,
      price: [],
      date: [this.initData.date],
      startTime: [this.initData.startTime],
      finishTime: [this.initData.finishTime],
      repeatable: [this.initData.repeatable],
    });

    this.clients$ = this.eventService.getAllClients();
  }

  submit() {
    const event = { ...this.eventForm.value };
    if (typeof event.client === 'string') {
      event.client = { name: event.client };
    }
    this.formSubmit.emit(event);
  }

  public displayFn(client: Client): string {
    return client.name;
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
