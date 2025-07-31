import { NgModule } from '@angular/core';
import { LayoutComponent } from './components/layout/layout.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { OAuthModule } from 'angular-oauth2-oidc';
import { LetDirective } from '../shared/directives/local-let.directive';

@NgModule({ declarations: [LayoutComponent, SidebarComponent],
    exports: [LayoutComponent], imports: [RouterOutlet,
        MatSidenavModule,
        MatIconModule,
        MatDividerModule,
        CommonModule,
        OAuthModule.forRoot(),
        LetDirective,
        RouterLinkActive,
        RouterLink], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class CoreModule {}
