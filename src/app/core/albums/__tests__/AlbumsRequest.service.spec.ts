import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Album } from '../Albums';
import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AlbumsRequestService } from '../AlbumsRequest.service';
import { albumsPage1, albumsPage2 } from './MockAlbumsPagedResponses';
import {
  sharedAlbumsPage1,
  sharedAlbumsPage2,
} from './MockSharedAlbumsPagedReponses';

describe('AlbumsRequestService', () => {
  let httpMock: HttpTestingController;
  let service: AlbumsRequestService;

  beforeEach(() => {
    localStorage.setItem('access_token', 'accessToken123');
    localStorage.setItem('refresh_token', 'refreshToken123');

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        AlbumsRequestService,
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AlbumsRequestService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('fetchSharedAlbums()', () => {
    it('should return a list of shared albums', (done) => {
      const emittedValues: Album[][] = [];
      service.fetchSharedAlbums().subscribe({
        next: (val: Album[]) => emittedValues.push(val),
        error: done.fail,
        complete: () => {
          expect(emittedValues.length).toEqual(2);
          expect(emittedValues[0]).toEqual(sharedAlbumsPage1.sharedAlbums!);
          expect(emittedValues[1]).toEqual([
            ...sharedAlbumsPage1.sharedAlbums!,
            ...sharedAlbumsPage2.sharedAlbums!,
          ]);
          done();
        },
      });

      httpMock
        .expectOne(
          (req) =>
            req.url ===
              'https://photoslibrary.googleapis.com/v1/sharedAlbums' &&
            req.headers.get('Authorization') === 'Bearer accessToken123' &&
            !req.params.get('pageToken')
        )
        .flush(sharedAlbumsPage1, { status: 200, statusText: 'OK' });
      httpMock
        .expectOne(
          (req) =>
            req.url ===
              'https://photoslibrary.googleapis.com/v1/sharedAlbums' &&
            req.headers.get('Authorization') === 'Bearer accessToken123' &&
            req.params.get('pageToken') === sharedAlbumsPage1.nextPageToken
        )
        .flush(sharedAlbumsPage2, { status: 200, statusText: 'OK' });
    });
  });

  describe('fetchAlbums()', () => {
    it('should return a list of albums', (done) => {
      const emittedValues: Album[][] = [];
      service.fetchAlbums().subscribe({
        next: (val: Album[]) => emittedValues.push(val),
        error: done.fail,
        complete: () => {
          expect(emittedValues.length).toEqual(2);
          expect(emittedValues[0]).toEqual(albumsPage1.albums!);
          expect(emittedValues[1]).toEqual([
            ...albumsPage1.albums!,
            ...albumsPage2.albums!,
          ]);
          done();
        },
      });

      httpMock
        .expectOne(
          (req) =>
            req.url === 'https://photoslibrary.googleapis.com/v1/albums' &&
            req.headers.get('Authorization') === 'Bearer accessToken123' &&
            !req.params.get('pageToken')
        )
        .flush(albumsPage1, { status: 200, statusText: 'OK' });
      httpMock
        .expectOne(
          (req) =>
            req.url === 'https://photoslibrary.googleapis.com/v1/albums' &&
            req.headers.get('Authorization') === 'Bearer accessToken123' &&
            req.params.get('pageToken') === albumsPage1.nextPageToken
        )
        .flush(albumsPage2, { status: 200, statusText: 'OK' });
    });

    it('should return a list of albums given last page has no albums', (done) => {
      const emittedValues: Album[][] = [];
      service.fetchAlbums().subscribe({
        next: (val: Album[]) => emittedValues.push(val),
        error: done.fail,
        complete: () => {
          expect(emittedValues.length).toEqual(2);
          expect(emittedValues[0]).toEqual(albumsPage1.albums!);
          expect(emittedValues[1]).toEqual(albumsPage1.albums!);
          done();
        },
      });

      httpMock
        .expectOne(
          (req) =>
            req.url === 'https://photoslibrary.googleapis.com/v1/albums' &&
            req.headers.get('Authorization') === 'Bearer accessToken123' &&
            !req.params.get('pageToken')
        )
        .flush(albumsPage1, { status: 200, statusText: 'OK' });
      httpMock
        .expectOne(
          (req) =>
            req.url === 'https://photoslibrary.googleapis.com/v1/albums' &&
            req.headers.get('Authorization') === 'Bearer accessToken123' &&
            req.params.get('pageToken') === albumsPage1.nextPageToken
        )
        .flush({}, { status: 200, statusText: 'OK' });
    });
  });
});
