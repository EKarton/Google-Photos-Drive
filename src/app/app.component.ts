import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthModule } from './auth/auth.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AuthModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Better-Albums-for-Google-Photos';
}
