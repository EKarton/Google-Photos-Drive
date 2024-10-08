import { Component } from '@angular/core';
import { AuthService } from '../../../../core/auth/Auth.service';
import { Router } from '@angular/router';
import { NbButtonModule, NbIconModule, NbLayoutModule } from '@nebular/theme';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  imports: [NbLayoutModule, NbIconModule, NbButtonModule],
  templateUrl: './logout-button.component.html',
  styleUrl: './logout-button.component.scss',
})
export class LogoutButtonComponent {
  constructor(private authService: AuthService, private router: Router) {}

  toggleButton() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logged out successfully');
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        console.error('Failed to log out successfully');
        console.error(err);
        this.router.navigateByUrl('/500');
      },
    });
  }
}
