import { TestBed } from '@angular/core/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter, Router } from '@angular/router';
import { firstValueFrom, of, throwError } from 'rxjs';
import { Component, importProvidersFrom } from '@angular/core';
import { NbThemeModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { Base64 } from 'js-base64';
import { AuthService } from '../../../core/auth/Auth.service';
import { LoginCallbackPageComponent } from '../login-callback-page.component';

@Component({
  selector: 'app-test-empty-component',
  standalone: true,
})
class TestEmptyComponent {}

describe('LoginCallbackComponent', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', [
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
            path: '',
            component: TestEmptyComponent,
          },
          {
            path: 'auth/login/callback',
            component: LoginCallbackPageComponent,
          },
          {
            path: 'content/:pathId',
            component: TestEmptyComponent,
          },
        ]),
        provideLocationMocks(),
        importProvidersFrom(NbThemeModule.forRoot({ name: 'default' })),
        importProvidersFrom(NbEvaIconsModule),
      ],
    }).compileComponents();

    jasmine.clock().install();
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should redirect user to content page, given correct code and state in query params', async () => {
    authServiceMock.exchangeCodeWithTokens.and.returnValue(of(undefined));
    const harness = await RouterTestingHarness.create();
    const fixture = harness.fixture;

    const component = await harness.navigateByUrl(
      'auth/login/callback?code=123&state=abc',
      LoginCallbackPageComponent
    );
    harness.detectChanges();

    expect(component).toBeTruthy();
    const element = fixture.nativeElement.querySelector('nb-card-body');
    expect(element.textContent).toEqual('Login Success!');

    jasmine.clock().tick(5000);
    const lastRouterEvent = await firstValueFrom(router.events);
    const expectedUrl = `/content/${encodeURIComponent(Base64.encode('Home'))}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((lastRouterEvent as any).url).toEqual(expectedUrl);
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

  it('should redirect user to the home page, given it shows the error page and user clicks on the button', async () => {
    authServiceMock.exchangeCodeWithTokens.and.returnValue(
      throwError(() => new Error('Invalid state / code'))
    );
    const harness = await RouterTestingHarness.create();
    const fixture = harness.fixture;
    await harness.navigateByUrl(
      'auth/login/callback?code=123&state=abc',
      LoginCallbackPageComponent
    );
    harness.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    const lastRouterEvent = await firstValueFrom(router.events);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((lastRouterEvent as any).url).toEqual('/');
  });
});
