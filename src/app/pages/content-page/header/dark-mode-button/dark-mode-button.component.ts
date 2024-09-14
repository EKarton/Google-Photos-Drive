import { Component, OnInit } from '@angular/core';
import {
  NbButtonModule,
  NbIconModule,
  NbLayoutModule,
  NbThemeService,
} from '@nebular/theme';

@Component({
  selector: 'app-dark-mode-button',
  standalone: true,
  imports: [
    NbLayoutModule,
    NbIconModule,
    NbButtonModule,
    DarkModeButtonComponent,
  ],
  templateUrl: './dark-mode-button.component.html',
  styleUrl: './dark-mode-button.component.scss',
})
export class DarkModeButtonComponent implements OnInit {
  theme: string;

  constructor(private themeService: NbThemeService) {
    this.theme = themeService.currentTheme;
  }

  ngOnInit(): void {
    this.themeService.onThemeChange().subscribe((theme) => {
      this.theme = theme.name;
    });
  }

  toggleButton() {
    const curTheme = this.themeService.currentTheme;
    if (curTheme === 'dark') {
      this.themeService.changeTheme('cosmic');
    } else if (curTheme === 'cosmic') {
      this.themeService.changeTheme('corporate');
    } else {
      this.themeService.changeTheme('dark');
    }
  }
}
