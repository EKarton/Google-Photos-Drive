import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { NbCardModule, NbLayoutModule } from '@nebular/theme';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [NbLayoutModule, NbCardModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const url = this.authService.getLoginRedirectUrl();
    window.location.href = url.href;
  }
}
