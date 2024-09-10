import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  NbButtonModule,
  NbLayoutModule,
  NbSidebarModule,
  NbSidebarService,
} from '@nebular/theme';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NbLayoutModule, NbSidebarModule, NbButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [NbSidebarService],
})
export class HomeComponent {
  constructor(private router: Router) {}

  handleLoginClick() {
    this.router.navigateByUrl('/auth/login');
  }
}
