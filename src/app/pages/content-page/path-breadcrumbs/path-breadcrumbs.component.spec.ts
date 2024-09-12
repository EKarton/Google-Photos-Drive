import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PathBreadcrumbsComponent } from './path-breadcrumbs.component';

describe('PathBreadcrumbsComponent', () => {
  let component: PathBreadcrumbsComponent;
  let fixture: ComponentFixture<PathBreadcrumbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PathBreadcrumbsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PathBreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
