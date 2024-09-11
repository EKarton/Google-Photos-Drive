import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbLayoutModule,
  NbSpinnerModule,
} from '@nebular/theme';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-login-callback',
  standalone: true,
  imports: [
    NbLayoutModule,
    NbCardModule,
    NbSpinnerModule,
    NbButtonModule,
    NbIconModule,
  ],
  templateUrl: './login-callback.component.html',
  styleUrl: './login-callback.component.scss',
})
export class LoginCallbackComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  isLoading = false;
  isSuccessful = false;

  async ngOnInit() {
    const queryParams = this.route.snapshot.queryParamMap;
    const state = queryParams.get('state')!;
    const code = queryParams.get('code')!;

    try {
      this.isLoading = true;
      await this.authService.exchangeCodeWithTokens(state, code);
      setTimeout(
        () => this.router.navigateByUrl(`/content/${Base64.encode('Home')}`),
        1500
      );
      this.isSuccessful = true;
    } catch (error) {
      this.isSuccessful = false;
      console.error('Error in getting auth token', error);
    } finally {
      this.isLoading = false;
    }
  }

  handleHomePageButtonClick() {
    this.router.navigateByUrl('/');
  }
}
