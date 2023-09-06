import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarBodyHourListComponent } from './calendar-body-hour-list.component';

describe('CalendarBodyHourListComponent', () => {
  let component: CalendarBodyHourListComponent;
  let fixture: ComponentFixture<CalendarBodyHourListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarBodyHourListComponent],
    });
    fixture = TestBed.createComponent(CalendarBodyHourListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
