import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadcrumbsComponent } from '../breadcrumbs.component';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbsComponent);
  });

  it('should show correct text given breadcrumbs', () => {
    component = fixture.componentInstance;
    component.items = [
      {
        label: 'Archives',
        onClick: jasmine.createSpy(),
      },
      {
        label: 'Photos',
        onClick: jasmine.createSpy(),
      },
      {
        label: '2010',
        onClick: jasmine.createSpy(),
      },
    ];
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('.breadcrumbs');
    expect(element.textContent).toContain('Archives/Photos/2010');
  });
});
