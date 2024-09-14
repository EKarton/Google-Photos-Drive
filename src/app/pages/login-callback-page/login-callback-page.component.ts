import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth/Auth.service';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbLayoutModule,
  NbSpinnerModule,
} from '@nebular/theme';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-login-callback-page',
  standalone: true,
  imports: [
    NbLayoutModule,
    NbCardModule,
    NbSpinnerModule,
    NbButtonModule,
    NbIconModule,
  ],
  templateUrl: './login-callback-page.component.html',
  styleUrl: './login-callback-page.component.scss',
})
export class LoginCallbackPageComponent implements OnInit {
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

    this.isLoading = true;
    this.authService.exchangeCodeWithTokens(state, code).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccessful = true;

        setTimeout(() => {
          this.router
            .navigateByUrl(`/content/${Base64.encode('Home')}`)
            .then(() => console.log('Navigated to content page'))
            .catch((err) =>
              console.error(`Failed to navigate to content page: ${err}`)
            );
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.isSuccessful = false;
        console.error('Error in getting auth token', err);
      },
    });
  }

  handleHomePageButtonClick() {
    this.router.navigateByUrl('/');
  }
}
