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
  selector: 'app-home',
  standalone: true,
  imports: [
    NbLayoutModule,
    NbSidebarModule,
    NbButtonModule,
    NbIconModule,
    NbCardModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [NbSidebarService],
})
export class HomeComponent {
  constructor(private authService: AuthService) {}

  handleLoginClick() {
    window.location.href = this.authService.getLoginRedirectUrl().href;
  }
}
