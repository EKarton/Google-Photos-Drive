import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosSectionComponent } from '../photos-section.component';
import { MediaItem } from '../../../../core/media-items/MediaItems';

describe('PhotosSectionComponent', () => {
  let component: PhotosSectionComponent;
  let fixture: ComponentFixture<PhotosSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotosSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotosSectionComponent);
    component = fixture.componentInstance;
    component.photos = mediaItems;
    fixture.detectChanges();
  });

  it('should render all photos', () => {
    expect(component).toBeTruthy();

    const elements = fixture.nativeElement.querySelectorAll('img');
    expect(elements.length).toEqual(3);
    expect(elements[0].src).toEqual(
      'https://photos.google.com/thumbnails/photo1'
    );
    expect(elements[1].src).toEqual(
      'https://photos.google.com/thumbnails/photo2'
    );
    expect(elements[2].src).toEqual(
      'https://photos.google.com/thumbnails/photo3'
    );
  });
});

const mediaItems: MediaItem[] = [
  {
    id: 'photo1',
    productUrl: 'https://photos.google.com/photos/photo1',
    baseUrl: 'https://photos.google.com/thumbnails/photo1',
  },
  {
    id: 'photo2',
    productUrl: 'https://photos.google.com/photos/photo2',
    baseUrl: 'https://photos.google.com/thumbnails/photo2',
  },
  {
    id: 'photo3',
    productUrl: 'https://photos.google.com/photos/photo3',
    baseUrl: 'https://photos.google.com/thumbnails/photo3',
  },
];
