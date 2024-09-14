import { ComponentFixture, TestBed } from '@angular/core/testing';
import { importProvidersFrom } from '@angular/core';
import { NbThemeModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AuthService } from '../../../core/auth/dsajfajf';
import { HomePageComponent } from '../home-page.component';

describe('HomePageComponent', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockWindow: jasmine.SpyObj<any>;

  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'getLoginRedirectUrl',
    ]);
    mockAuthService.getLoginRedirectUrl.and.returnValue(
      new URL('http://photos.google.com/login')
    );
    mockWindow = jasmine.createSpyObj({ location: { href: '' } });

    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: 'Window', useValue: mockWindow },
        importProvidersFrom(NbThemeModule.forRoot({ name: 'default' })),
        importProvidersFrom(NbEvaIconsModule),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the login page when the user clicks on the login button', () => {
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    expect(mockWindow.location.href).toEqual('http://photos.google.com/login');
  });
});
