import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCallbackPageComponent } from './login-callback-page.component';

describe('LoginCallbackComponent', () => {
  let component: LoginCallbackPageComponent;
  let fixture: ComponentFixture<LoginCallbackPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginCallbackPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginCallbackPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
