import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import uk from '@angular/common/locales/uk';
import { LOCALE_ID } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideTanStackQuery } from '@tanstack/angular-query-experimental';
import { QueryClient } from '@tanstack/query-core';
import { provideNzI18n, uk_UA } from 'ng-zorro-antd/i18n';
import { routes } from './app/app-routes';
import { AppComponent } from './app/app.component';
import nzConfig from './app/core/config/nz-config';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './app/core/interceptors/error.interceptor';
import { refreshTokenInterceptor } from './app/core/interceptors/refresh-token.interceptor';

registerLocaleData(uk);

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, ErrorInterceptor, refreshTokenInterceptor])),
    provideRouter(routes),
    provideNzI18n(uk_UA),
    provideAnimationsAsync(),
    provideTanStackQuery(new QueryClient()),
    { provide: LOCALE_ID, useValue: 'uk' },
    ...nzConfig,
  ],
}).catch((err) => console.error(err));
