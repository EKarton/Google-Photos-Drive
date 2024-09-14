import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoCardComponent } from '../photo-card.component';

describe('PhotoCardComponent', () => {
  let component: PhotoCardComponent;
  let fixture: ComponentFixture<PhotoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoCardComponent);
  });

  it('should show image given image', () => {
    component = fixture.componentInstance;
    component.imgSrc = 'https://photos.google.com/image/1';
    component.imgName = 'Image 1';
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('img');
    expect(element.src).toContain('https://photos.google.com/image/1');
  });
});
