import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NbCardModule, NbLayoutModule } from '@nebular/theme';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NbLayoutModule, NbCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const url = this.authService.getLoginRedirectUrl();
    window.location.href = url.href;
  }
}
