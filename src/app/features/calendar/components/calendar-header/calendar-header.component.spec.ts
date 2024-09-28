import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarHeaderComponent } from './calendar-header.component';

describe('HeaderComponent', () => {
    let component: CalendarHeaderComponent;
    let fixture: ComponentFixture<CalendarHeaderComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CalendarHeaderComponent],
        });
        fixture = TestBed.createComponent(CalendarHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
