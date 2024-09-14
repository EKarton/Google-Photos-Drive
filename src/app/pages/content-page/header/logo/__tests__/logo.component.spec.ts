import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoComponent } from '../logo.component';

describe('LogoComponent', () => {
  let component: LogoComponent;
  let fixture: ComponentFixture<LogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component correctly', () => {
    const img = fixture.nativeElement.querySelector('img');
    const h5 = fixture.nativeElement.querySelector('h5');

    expect(component).toBeTruthy();
    expect(img.getAttribute('alt')).toEqual('Google logo');
    expect(h5.textContent).toEqual('Photos Drive');
  });
});
