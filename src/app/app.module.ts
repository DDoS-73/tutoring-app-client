import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoaderInterceptor } from './core/interceptors/loader.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { CoreModule } from './core/core.module';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

@NgModule({
    declarations: [AppComponent],
    imports: [
        CoreModule,
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule,
        AppRoutingModule,
        HttpClientModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoaderInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        provideCharts(withDefaultRegisterables()),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
