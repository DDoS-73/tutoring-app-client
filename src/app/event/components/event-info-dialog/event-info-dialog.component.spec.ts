import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventInfoDialogComponent } from './event-info-dialog.component';

describe('EventInfoDialogComponent', () => {
  let component: EventInfoDialogComponent;
  let fixture: ComponentFixture<EventInfoDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventInfoDialogComponent],
    });
    fixture = TestBed.createComponent(EventInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
