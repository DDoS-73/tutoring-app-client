import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTileComponent } from './event-tile.component';

describe('EventTileComponent', () => {
    let component: EventTileComponent;
    let fixture: ComponentFixture<EventTileComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EventTileComponent],
        });
        fixture = TestBed.createComponent(EventTileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
