import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-callback',
  standalone: true,
  imports: [],
  templateUrl: './login-callback.component.html',
  styleUrl: './login-callback.component.scss',
})
export class LoginCallbackComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const queryParams = this.route.snapshot.queryParamMap;
    const state = queryParams.get('state')!;
    const code = queryParams.get('code')!;

    try {
      await this.authService.exchangeCodeWithTokens(state, code);
      this.router.navigateByUrl('/albums');
    } catch (_error) {
      alert('Retry login');
      this.router.navigateByUrl('/auth/login');
    }
  }
}
