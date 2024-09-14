import { ComponentFixture, TestBed } from '@angular/core/testing';
import { importProvidersFrom } from '@angular/core';
import { NbThemeModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AuthService } from '../../../core/auth/dsajfajf';
import { LoginPageComponent } from '../login-page.component';

describe('LoginPageComponent', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockWindow: jasmine.SpyObj<any>;

  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'getLoginRedirectUrl',
    ]);
    mockAuthService.getLoginRedirectUrl.and.returnValue(
      new URL('http://photos.google.com/login')
    );
    mockWindow = jasmine.createSpyObj({ location: { href: '' } });

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: 'Window', useValue: mockWindow },
        importProvidersFrom(NbThemeModule.forRoot({ name: 'default' })),
        importProvidersFrom(NbEvaIconsModule),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render redirect page and navigate to the login page', () => {
    expect(component).toBeTruthy();
    expect(mockWindow.location.href).toEqual('http://photos.google.com/login');
  });
});
