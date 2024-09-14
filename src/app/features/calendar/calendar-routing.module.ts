import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CalendarPages } from '../../shared/models/pages';
import { CalendarComponent } from './calendar.component';

const routes: Route[] = [
    {
        path: CalendarPages.Calendar,
        component: CalendarComponent,
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
})
export class CalendarRoutingModule {}
