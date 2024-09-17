import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MediaItem } from '../../../../core/media-items/MediaItems';
import { PhotosSectionComponent } from '../photos-section.component';
import { importProvidersFrom } from '@angular/core';
import { NbThemeModule } from '@nebular/theme';

describe('PhotosSectionComponent', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockWindow: jasmine.SpyObj<any>;

  let component: PhotosSectionComponent;
  let fixture: ComponentFixture<PhotosSectionComponent>;

  beforeEach(async () => {
    mockWindow = jasmine.createSpyObj({
      open: jasmine.createSpy(),
    });

    await TestBed.configureTestingModule({
      imports: [PhotosSectionComponent],
      providers: [
        { provide: 'Window', useValue: mockWindow },
        importProvidersFrom(NbThemeModule.forRoot({ name: 'default' })),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotosSectionComponent);
    component = fixture.componentInstance;
    component.photos = mediaItems;
    component.numPhotosLeft = 45;
    component.photosAlbumUrl = 'https://photos.google.com';
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

  it('should navigate to url when user clicks on a photo', () => {
    fixture.nativeElement.querySelector('img').click();

    expect(mockWindow.open).toHaveBeenCalledWith(
      'https://photos.google.com/photos/photo1',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('should navigate to photos album link when user clicks on the more photos button', () => {
    fixture.nativeElement
      .querySelector('.photos-section__more-photos-container > button')
      .click();

    expect(mockWindow.open).toHaveBeenCalledWith(
      'https://photos.google.com',
      '_blank',
      'noopener,noreferrer'
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
