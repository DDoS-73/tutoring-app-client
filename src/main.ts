import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { LoaderInterceptor } from './app/core/interceptors/loader.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routes';

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(
            withInterceptors([LoaderInterceptor])
        ),
        provideRouter(routes)
    ]
}).catch(err => console.error(err));
