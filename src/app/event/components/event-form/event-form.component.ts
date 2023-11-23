import {
  Component,
  DestroyRef,
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
import { map, Observable, startWith } from 'rxjs';
import { Client } from '../../../calendar/models/Client.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  clients: Client[] = [];
  filteredClients$!: Observable<Client[]>;
  @Input({ required: true }) initData!: Event;
  @Output() formSubmit = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private destroyRef: DestroyRef
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

    this.eventService
      .getAllClients()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(clients => {
        this.clients = clients;
        this.filteredClients$ = this.eventForm.controls[
          'client'
        ].valueChanges.pipe(
          startWith(''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.name;
            return name
              ? this._filterClients(name as string)
              : this.clients.slice();
          })
        );
      });
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

  private _filterClients(name: string) {
    const filterValue = name.toLowerCase();
    return this.clients.filter(client =>
      client.name.toLowerCase().includes(filterValue)
    );
  }
}
