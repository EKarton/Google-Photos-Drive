import { Component } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbLayoutModule,
  NbSidebarModule,
  NbSidebarService,
} from '@nebular/theme';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    NbLayoutModule,
    NbSidebarModule,
    NbButtonModule,
    NbIconModule,
    NbCardModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  providers: [NbSidebarService],
})
export class HomePageComponent {
  constructor(private authService: AuthService) {}

  handleLoginClick() {
    window.location.href = this.authService.getLoginRedirectUrl().href;
  }
}
