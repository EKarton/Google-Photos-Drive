import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumsSectionComponent } from './albums-section.component';

describe('AlbumsSectionComponent', () => {
  let component: AlbumsSectionComponent;
  let fixture: ComponentFixture<AlbumsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumsSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
