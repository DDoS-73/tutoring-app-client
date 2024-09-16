import { NgModule } from '@angular/core';
import { LayoutComponent } from './components/layout/layout.component';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { OAuthModule } from 'angular-oauth2-oidc';

@NgModule({
    declarations: [LayoutComponent, SidebarComponent],
    exports: [LayoutComponent],
    imports: [
        RouterOutlet,
        MatSidenavModule,
        HttpClientModule,
        MatIconModule,
        MatDividerModule,
        CommonModule,
        OAuthModule.forRoot(),
    ],
})
export class CoreModule {}
