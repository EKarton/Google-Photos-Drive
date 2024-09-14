import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { NbThemeModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NotFoundPageComponent } from '../not-found-page.component';

describe('NotFoundPageComponent', () => {
  let routerSpy: jasmine.SpyObj<Router>;

  let component: NotFoundPageComponent;
  let fixture: ComponentFixture<NotFoundPageComponent>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.resolveTo(true);

    await TestBed.configureTestingModule({
      imports: [NotFoundPageComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        importProvidersFrom(NbThemeModule.forRoot({ name: 'default' })),
        importProvidersFrom(NbEvaIconsModule),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create page', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect user to home page when user clicks on the button', () => {
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});
