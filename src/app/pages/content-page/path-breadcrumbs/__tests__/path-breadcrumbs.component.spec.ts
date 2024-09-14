import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PathBreadcrumbsComponent } from '../path-breadcrumbs.component';
import { Base64 } from 'js-base64';
import { Router } from '@angular/router';

describe('PathBreadcrumbsComponent', () => {
  let component: PathBreadcrumbsComponent;
  let routerSpy: jasmine.SpyObj<Router>;
  let fixture: ComponentFixture<PathBreadcrumbsComponent>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.resolveTo(true);

    await TestBed.configureTestingModule({
      imports: [PathBreadcrumbsComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(PathBreadcrumbsComponent);
    component = fixture.componentInstance;
    component.path = 'Home/Archives/Photos/2010/Dog';
    fixture.detectChanges();
  });

  afterEach(() => {
    routerSpy.navigate.calls.reset();
  });

  it('should render components correctly', () => {
    expect(component).toBeTruthy();

    const element = fixture.nativeElement.querySelector('.breadcrumbs');
    expect(element.textContent).toContain('Archives/Photos/2010/Dog');
  });

  [
    { text: 'Home', expectedRedirect: 'Home' },
    { text: 'Archives', expectedRedirect: 'Home/Archives' },
    { text: 'Photos', expectedRedirect: 'Home/Archives/Photos' },
    { text: '2010', expectedRedirect: 'Home/Archives/Photos/2010' },
  ].forEach(({ text, expectedRedirect }) => {
    it(`should navigate to ${expectedRedirect} given user clicked on ${text}`, () => {
      const elements = fixture.nativeElement.querySelectorAll(
        '.breadcrumbs__item > a'
      ) as NodeList;

      const element = Array.from(elements).find((e) => e.textContent === text);
      (element as HTMLElement)?.click();
      fixture.detectChanges();

      expect(routerSpy.navigate).toHaveBeenCalledWith([
        '/content',
        Base64.encode(expectedRedirect),
      ]);
    });
  });
});
