import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { NbThemeModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NotFoundPageComponent } from '../not-found-page.component';
import { RouterTestingHarness } from '@angular/router/testing';

describe('NotFoundPageComponent', () => {
  let router: Router;

  let component: NotFoundPageComponent;
  let fixture: ComponentFixture<NotFoundPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundPageComponent],
      providers: [
        provideRouter([{ path: '404', component: NotFoundPageComponent }]),
        importProvidersFrom(NbThemeModule.forRoot({ name: 'default' })),
        importProvidersFrom(NbEvaIconsModule),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);

    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('404', NotFoundPageComponent);
    fixture = harness.fixture as ComponentFixture<NotFoundPageComponent>;

    harness.detectChanges();
  });

  it('should create page', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect user to home page when user clicks on the button', (done) => {
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    router.events.subscribe({
      next: (event) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((event as any).url).toEqual('/');
        done();
      },
    });
  });
});
