import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbThemeModule, NbThemeService } from '@nebular/theme';
import { importProvidersFrom } from '@angular/core';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { DarkModeButtonComponent } from '../dark-mode-button.component';

describe('DarkModeButtonComponent', () => {
  let nbThemeService: NbThemeService;
  let fixture: ComponentFixture<DarkModeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DarkModeButtonComponent],
      providers: [
        importProvidersFrom(NbThemeModule.forRoot({ name: 'default' })),
        importProvidersFrom(NbEvaIconsModule),
      ],
    }).compileComponents();

    nbThemeService = TestBed.inject(NbThemeService);
    fixture = TestBed.createComponent(DarkModeButtonComponent);
  });

  [
    {
      currentTheme: 'dark',
      expectedIconValue: 'moon',
    },
    {
      currentTheme: 'corporate',
      expectedIconValue: 'moon-outline',
    },
    {
      currentTheme: 'cosmic',
      expectedIconValue: 'moon',
    },
  ].forEach(({ currentTheme, expectedIconValue }) => {
    it(`should show ${expectedIconValue}, given current theme is ${currentTheme}`, () => {
      nbThemeService.changeTheme(currentTheme);

      const component = fixture.componentInstance;
      fixture.detectChanges();

      const element = fixture.nativeElement.querySelector('nb-icon');
      expect(component).toBeTruthy();
      expect(element.getAttribute('icon')).toEqual(expectedIconValue);
    });

    it(`should show ${expectedIconValue}, given current theme changed to ${currentTheme}`, () => {
      fixture = TestBed.createComponent(DarkModeButtonComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();

      nbThemeService.changeTheme(currentTheme);
      fixture.detectChanges();

      const element = fixture.nativeElement.querySelector('nb-icon');
      expect(component).toBeTruthy();
      expect(component.theme).toEqual(currentTheme);
      expect(element.getAttribute('icon')).toEqual(expectedIconValue);
    });
  });
});
