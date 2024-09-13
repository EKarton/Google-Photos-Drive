import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MediaItemsRequestService } from '../MediaItemsRequest.service';
import { MediaItem } from '../MediaItems';
import { page1, page2 } from './MockMediaItemsPagedResponses';

describe('MediaItemsRequestService', () => {
  let httpMock: HttpTestingController;
  let service: MediaItemsRequestService;

  beforeEach(() => {
    localStorage.setItem('access_token', 'accessToken123');
    localStorage.setItem('refresh_token', 'refreshToken123');

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        MediaItemsRequestService,
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(MediaItemsRequestService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('fetchMediaItems()', () => {
    it('should emit correct media items, given a list of paged results with no album ID', (done) => {
      const emittedValues: MediaItem[][] = [];
      service.fetchMediaItems().subscribe({
        next: (val: MediaItem[]) => emittedValues.push(val),
        error: done.fail,
        complete: () => {
          expect(emittedValues[0]).toEqual(page1.mediaItems);
          expect(emittedValues[1]).toEqual([
            ...page1.mediaItems,
            ...page2.mediaItems,
          ]);
          done();
        },
      });

      httpMock
        .expectOne(
          (req) =>
            req.url ===
              'https://photoslibrary.googleapis.com/v1/mediaItems:search' &&
            req.headers.get('Authorization') === 'Bearer accessToken123' &&
            req.body['pageToken'] === undefined
        )
        .flush(page1, { status: 200, statusText: 'OK' });
      httpMock
        .expectOne(
          (req) =>
            req.url ===
              'https://photoslibrary.googleapis.com/v1/mediaItems:search' &&
            req.headers.get('Authorization') === 'Bearer accessToken123' &&
            req.body['pageToken'] === page1.nextPageToken
        )
        .flush(page2, { status: 200, statusText: 'OK' });
    });

    it('should emit correct values, given album ID', (done) => {
      const emittedValues: MediaItem[][] = [];
      service.fetchMediaItems('album1').subscribe({
        next: (val: MediaItem[]) => emittedValues.push(val),
        error: done.fail,
        complete: () => {
          expect(emittedValues[0]).toEqual(page1.mediaItems);
          expect(emittedValues[1]).toEqual([
            ...page1.mediaItems,
            ...page2.mediaItems,
          ]);
          done();
        },
      });

      httpMock
        .expectOne(
          (req) =>
            req.url ===
              'https://photoslibrary.googleapis.com/v1/mediaItems:search' &&
            req.headers.get('Authorization') === 'Bearer accessToken123' &&
            req.body['pageToken'] === undefined &&
            req.body['albumId'] === 'album1'
        )
        .flush(page1, { status: 200, statusText: 'OK' });
      httpMock
        .expectOne(
          (req) =>
            req.url ===
              'https://photoslibrary.googleapis.com/v1/mediaItems:search' &&
            req.headers.get('Authorization') === 'Bearer accessToken123' &&
            req.body['pageToken'] === page1.nextPageToken &&
            req.body['albumId'] === 'album1'
        )
        .flush(page2, { status: 200, statusText: 'OK' });
    });
  });
});
