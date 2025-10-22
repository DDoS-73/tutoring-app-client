import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
@NgModule({
    imports: [RouterOutlet, CommonModule, RouterLinkActive, RouterLink],
})
export class CoreModule {}
