import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbThemeModule } from '@nebular/theme';
import { LogoutButtonComponent } from '../logout-button.component';
import { AuthService } from '../../../../../core/auth/dsajfajf';

describe('LogoutButtonComponent', () => {
  let component: LogoutButtonComponent;
  let fixture: ComponentFixture<LogoutButtonComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [LogoutButtonComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        importProvidersFrom(NbThemeModule.forRoot({ name: 'default' })),
        importProvidersFrom(NbEvaIconsModule),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoutButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });

  it('should logout and redirect user to home page when user clicks on the button', () => {
    authServiceSpy.logout.and.returnValue(of('OK'));

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(component).toBeTruthy();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should redirect user to error page when logging out fails', () => {
    authServiceSpy.logout.and.returnValue(
      throwError(() => new Error('Failed to logout'))
    );

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(component).toBeTruthy();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/500');
  });
});
