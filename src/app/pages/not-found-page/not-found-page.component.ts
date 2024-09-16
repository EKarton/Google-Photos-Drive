import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbLayoutModule,
} from '@nebular/theme';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [NbLayoutModule, NbCardModule, NbButtonModule, NbIconModule],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss',
})
export class NotFoundPageComponent {
  constructor(private router: Router) {}

  handleHomePageButtonClick() {
    this.router.navigate(['/']);
  }
}
