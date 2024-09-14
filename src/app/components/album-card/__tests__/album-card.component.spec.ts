import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlbumCardComponent } from '../album-card.component';

describe('AlbumCardComponent', () => {
  let component: AlbumCardComponent;
  let fixture: ComponentFixture<AlbumCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumCardComponent);
    component = fixture.componentInstance;
  });

  [
    { numPhotos: 10, numAlbums: 10, expectedString: '10 photos · 10 albums' },
    { numPhotos: 1, numAlbums: 10, expectedString: '1 photo · 10 albums' },
    { numPhotos: 10, numAlbums: 1, expectedString: '10 photos · 1 album' },
    { numPhotos: 0, numAlbums: 10, expectedString: '10 albums' },
    { numPhotos: 10, numAlbums: 0, expectedString: '10 photos' },
    { numPhotos: 0, numAlbums: 1, expectedString: '1 album' },
    { numPhotos: 1, numAlbums: 0, expectedString: '1 photo' },
  ].forEach(({ numPhotos, numAlbums, expectedString }) => {
    it(`should show ${expectedString} given num photos = ${numPhotos} and num sub albums = ${numAlbums}`, () => {
      component.albumTitle = 'Photos';
      component.coverPhotoBaseUrls = [
        'http://photos.google.com/albums/1/cover',
        'http://photos.google.com/albums/2/cover',
        'http://photos.google.com/albums/3/cover',
      ];
      component.numPhotos = numPhotos;
      component.numSubAlbums = numAlbums;

      fixture.detectChanges();

      const element = fixture.nativeElement.querySelector(
        '.album-card__details'
      );
      expect(element.textContent).toContain(expectedString);
    });
  });

  it(`should show the correct album cover given more than 1 album url cover`, () => {
    component.albumTitle = 'Photos';
    component.coverPhotoBaseUrls = [
      'http://photos.google.com/albums/1/cover',
      'http://photos.google.com/albums/2/cover',
      'http://photos.google.com/albums/3/cover',
    ];
    component.numPhotos = 10;
    component.numSubAlbums = 10;

    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('.album-card__image');
    expect(element.src).toEqual('http://photos.google.com/albums/1/cover');
  });
});
