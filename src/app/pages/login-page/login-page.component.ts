import { Component, Inject, OnInit } from '@angular/core';
import { NbCardModule, NbLayoutModule } from '@nebular/theme';
import { AuthService } from '../../core/auth/dsajfajf';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [NbLayoutModule, NbCardModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit {
  constructor(
    @Inject('Window') private window: Window,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const url = this.authService.getLoginRedirectUrl();
    this.window.location.href = url.href;
  }
}
