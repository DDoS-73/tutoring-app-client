import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarBodyComponent } from './calendar-body.component';

describe('CalendarBodyComponent', () => {
  let component: CalendarBodyComponent;
  let fixture: ComponentFixture<CalendarBodyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarBodyComponent],
    });
    fixture = TestBed.createComponent(CalendarBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
