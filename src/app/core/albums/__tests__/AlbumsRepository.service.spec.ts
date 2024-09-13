import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Album } from '../Albums';
import { AlbumsRepositoryService } from '../AlbumsRepository.service';
import { AlbumsRequestService } from '../AlbumsRequest.service';
import {
  sharedAlbumsPage1,
  sharedAlbumsPage2,
} from './MockSharedAlbumsPagedReponses';
import { albumsPage1, albumsPage2 } from './MockAlbumsPagedResponses';

describe('AlbumsRepositoryService', () => {
  let httpMock: HttpTestingController;
  let service: AlbumsRepositoryService;

  beforeEach(() => {
    localStorage.setItem('access_token', 'accessToken123');
    localStorage.setItem('refresh_token', 'refreshToken123');

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        AlbumsRequestService,
        AlbumsRepositoryService,
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AlbumsRepositoryService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getSharedAlbums()', () => {
    it('should return a list of albums', (done) => {
      const emittedValues: Album[][] = [];
      service.getSharedAlbums().subscribe({
        next: (val: Album[]) => emittedValues.push(val),
        error: done.fail,
        complete: () => {
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

  describe('getAlbums()', () => {
    it('should return a list of albums', (done) => {
      const emittedValues: Album[][] = [];
      service.getAlbums().subscribe({
        next: (val: Album[]) => emittedValues.push(val),
        error: done.fail,
        complete: () => {
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
  });

  describe('getAllAlbumsStream()', () => {
    it('should emit all unique albums', (done) => {
      const emittedValues: Album[] = [];
      const expectedMediaItems = [
        ...albumsPage1.albums!,
        ...albumsPage2.albums!,
        ...sharedAlbumsPage1.sharedAlbums!,
        ...sharedAlbumsPage2.sharedAlbums!,
      ];
      service.getAllAlbumsStream().subscribe({
        next: (val: Album) => emittedValues.push(val),
        error: done.fail,
        complete: () => {
          expect(emittedValues.length).toEqual(12);
          expect(new Set(emittedValues)).toEqual(new Set(expectedMediaItems));
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
});
