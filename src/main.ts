import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import uk from '@angular/common/locales/uk';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideTanStackQuery } from '@tanstack/angular-query-experimental';
import { QueryClient } from '@tanstack/query-core';
import { provideNzConfig } from 'ng-zorro-antd/core/config';
import { provideNzI18n, uk_UA } from 'ng-zorro-antd/i18n';
import { routes } from './app/app-routes';
import { AppComponent } from './app/app.component';
import { nzConfig } from './app/core/interceptors/config/nz-config';
import { ErrorInterceptor } from './app/core/interceptors/error.interceptor';

registerLocaleData(uk);

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([ErrorInterceptor])),
    provideRouter(routes),
    provideNzI18n(uk_UA),
    provideAnimationsAsync(),
    provideTanStackQuery(new QueryClient()),
    provideNzConfig(nzConfig),
  ],
}).catch(err => console.error(err));
