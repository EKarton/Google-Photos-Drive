import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { LoginCallbackPageComponent } from '../login-callback-page.component';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/Auth.service';
import { EMPTY, of, throwError } from 'rxjs';
import { importProvidersFrom } from '@angular/core';
import { NbThemeModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { Base64 } from 'js-base64';
import { Location } from '@angular/common';

describe('LoginCallbackComponent', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let location: Location;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    routerSpy.navigateByUrl.and.resolveTo(true);
    authServiceMock = jasmine.createSpyObj(AuthService, [
      'exchangeCodeWithTokens',
    ]);

    await TestBed.configureTestingModule({
      imports: [LoginCallbackPageComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        provideRouter([
          {
            path: 'auth/login/callback',
            component: LoginCallbackPageComponent,
          },
        ]),
        provideLocationMocks(),
        importProvidersFrom(NbThemeModule.forRoot({ name: 'default' })),
        importProvidersFrom(NbEvaIconsModule),
      ],
    }).compileComponents();

    jasmine.clock().install();
    location = TestBed.inject(Location);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should redirect user to content page, given correct code and state in query params', async () => {
    authServiceMock.exchangeCodeWithTokens.and.returnValue(of());
    const harness = await RouterTestingHarness.create();
    const fixture = harness.fixture;

    const component = await harness.navigateByUrl(
      'auth/login/callback?code=123&state=abc',
      LoginCallbackPageComponent
    );
    harness.detectChanges();

    expect(component).toBeTruthy();
    // const element = fixture.nativeElement.querySelector('nb-card-body');
    // expect(element.textContent).toEqual('Login Success!');

    jasmine.clock().tick(5000);
    expect(location.path()).toEqual(`/content/${Base64.encode('Home')}`);
  });

  it('should show error page, given incorrect code and state in query params', async () => {
    authServiceMock.exchangeCodeWithTokens.and.returnValue(
      throwError(() => new Error('Invalid state / code'))
    );
    const harness = await RouterTestingHarness.create();
    const fixture = harness.fixture;

    const component = await harness.navigateByUrl(
      'auth/login/callback?code=123&state=abc',
      LoginCallbackPageComponent
    );
    harness.detectChanges();

    expect(component).toBeTruthy();
    const element = fixture.nativeElement.querySelector('nb-card-header');
    expect(element.textContent).toEqual('Login Failed');
  });
});
