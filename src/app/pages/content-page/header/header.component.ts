import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NbLayoutModule } from '@nebular/theme';
import { ComponentsModule } from '../../../components/components.module';
import { DarkModeButtonComponent } from './dark-mode-button/dark-mode-button.component';
import { LogoutButtonComponent } from './logout-button/logout-button.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { LogoComponent } from './logo/logo.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AsyncPipe,
    MatProgressBarModule,
    ComponentsModule,
    LogoComponent,
    SearchBarComponent,
    DarkModeButtonComponent,
    LogoutButtonComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input({ required: true }) isLoading!: boolean;
}
